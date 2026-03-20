/**
 * Playwright simulation of N participants going through the matrix_game experiment.
 *
 * Usage (run from project root):
 *   node scripts/simulate_participants.js                         # 50 participants, localhost:2000
 *   node scripts/simulate_participants.js --n 5                   # 5 participants
 *   node scripts/simulate_participants.js --url https://arcane-savannah-14341.herokuapp.com
 *   node scripts/simulate_participants.js --n 10 --workers 3      # 10 participants, 3 in parallel
 *   node scripts/simulate_participants.js --headed               # watch the browser (1 at a time)
 *
 * Prerequisites:
 *   npm install playwright   (already done)
 *   npx playwright install chromium
 *   node app.js              (server must be running if targeting localhost)
 */

const { chromium } = require('playwright');

// ── Parse CLI args ─────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (flag, def) => {
    const i = args.indexOf(flag);
    return i !== -1 ? args[i + 1] : def;
};
const N_PARTICIPANTS = parseInt(getArg('--n', '50'), 10);
const SERVER_URL     = getArg('--url', 'http://localhost:2000');
const WORKERS        = parseInt(getArg('--workers', '3'), 10);
const HEADED         = args.includes('--headed');

// Data-loading wait: 3 minutes max (CSV is ~48MB, takes ~1 min on Heroku)
const DATA_LOAD_TIMEOUT_MS = 3 * 60 * 1000;
// Per-trial action timeout (most trials should respond within 5s)
const TRIAL_TIMEOUT_MS = 10_000;
// Total experiment timeout per participant (generous upper bound)
const EXPERIMENT_TIMEOUT_MS = 20 * 60 * 1000;

// ── Correct quiz answers ───────────────────────────────────────────────────
// Choice quiz: Q1=200, Q2=150, Q3=100, Q4=0, Q5=TRUE, Q6=FALSE
// Belief quiz: Q1=$8, Q2=TRUE, Q3=FALSE
const QUIZ_ANSWERS = ['200', '150', '100', '0', 'TRUE', 'FALSE', '$8', 'TRUE', 'FALSE'];
let quizAnswerIdx = 0; // reset per participant

// ── Helpers ────────────────────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/**
 * Move a range slider to a random value and fire change + input events.
 * Uses JS evaluation to bypass Playwright's usual slider dragging.
 */
async function moveSlider(page, sliderId) {
    await page.evaluate((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const val = Math.floor(Math.random() * 101); // 0-100
        // Use native setter so React-style listeners also fire
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(el, val);
        el.dispatchEvent(new Event('input',  { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
    }, sliderId);
}

/**
 * Main trial-handling loop. Returns when the experiment's jsPsych display
 * element is gone (experiment finished) or throws on timeout.
 */
async function runTrials(page, participantNum) {
    const deadline = Date.now() + EXPERIMENT_TIMEOUT_MS;
    let trialCount = 0;
    quizAnswerIdx = 0;

    while (Date.now() < deadline) {
        trialCount++;

        // Check if experiment finished (success_guard sets this flag)
        const experimentDone = await page.evaluate(() => window._experimentDone === true);
        if (experimentDone) {
            console.log(`    [P${participantNum}] Experiment finished after ${trialCount} actions`);
            return;
        }

        // Detect and handle the current trial type
        const handled = await page.evaluate(({ quizIdx, quizAnswers }) => {
            const $ = (sel) => document.querySelector(sel);
            const $$ = (sel) => [...document.querySelectorAll(sel)];

            // 1. Instructions plugin → click Next
            if ($('#jspsych-instructions-next')) {
                $('#jspsych-instructions-next').click();
                return 'instructions-next';
            }

            // 2. Survey multi-choice (quiz) → pick correct answer then submit
            if ($('#jspsych-survey-multi-choice-next')) {
                const answer = quizAnswers[quizIdx % quizAnswers.length];
                // Find radio input whose value or label matches the answer
                const radios = $$('input[type="radio"]');
                let clicked = false;
                for (const r of radios) {
                    if (r.value === answer || (r.nextSibling && r.nextSibling.textContent && r.nextSibling.textContent.trim() === answer)) {
                        r.click();
                        clicked = true;
                        break;
                    }
                }
                if (!clicked && radios.length > 0) radios[0].click(); // fallback
                document.getElementById('jspsych-survey-multi-choice-next').click();
                return 'survey:' + answer;
            }

            // 3. Fullscreen button
            if ($('#jspsych-fullscreen-btn')) {
                $('#jspsych-fullscreen-btn').click();
                return 'fullscreen';
            }

            // 4. Belief-RT-info slider (require_movement=true, button starts disabled)
            if ($('#jspsych-belief-rt-info-next')) {
                // Slider movement handled outside (see below), just signal
                return 'belief-rt-info-slider';
            }

            // 5. Belief plain slider
            if ($('#jspsych-table-slider-response-next')) {
                return 'belief-plain-slider';
            }

            // 6. Player choice buttons (2 × .jspsych-btn, no specific IDs)
            const allBtns = $$('.jspsych-btn:not([disabled])').filter(b =>
                !['jspsych-instructions-next', 'jspsych-fullscreen-btn',
                  'jspsych-survey-multi-choice-next'].includes(b.id)
            );
            if (allBtns.length >= 2 && !$('input[type="range"]')) {
                const idx = Math.random() < 0.5 ? 0 : 1;
                allBtns[idx].click();
                return 'player-choice';
            }

            // 7. Any enabled standalone button (single button without slider)
            if (allBtns.length === 1 && !$('input[type="range"]')) {
                allBtns[0].click();
                return 'single-button';
            }

            // 8. Game table present (choice trial) → press ArrowUp/Down
            if ($('.tg') || $('.tc') || $('.tprev') || $('.tnext')) {
                return 'choice-keyboard';
            }

            // 9. Generic keyboard / loading / fixation screen → press Space
            return 'keyboard-space';

        }, { quizIdx: quizAnswerIdx, quizAnswers: QUIZ_ANSWERS });

        // Increment quiz index after each survey trial
        if (handled && handled.startsWith('survey')) {
            quizAnswerIdx++;
        }

        // Handle cases that need native Playwright actions
        if (handled === 'belief-rt-info-slider') {
            await moveSlider(page, 'jspsych-belief-rt-info-slider');
            await sleep(50);
            // Wait for button to become enabled then click
            try {
                await page.waitForSelector('#jspsych-belief-rt-info-next:not([disabled])',
                    { timeout: 2000 });
                await page.click('#jspsych-belief-rt-info-next');
            } catch {
                // button may have already been clicked or trial ended
            }
        } else if (handled === 'belief-plain-slider') {
            await moveSlider(page, 'jspsych-table-slider-response-response');
            await sleep(50);
            try {
                await page.waitForSelector('#jspsych-table-slider-response-next:not([disabled])',
                    { timeout: 2000 });
                await page.click('#jspsych-table-slider-response-next');
            } catch {}
        } else if (handled === 'choice-keyboard') {
            const key = Math.random() < 0.5 ? 'ArrowUp' : 'ArrowDown';
            await page.keyboard.press(key);
        } else if (handled === 'keyboard-space') {
            await page.keyboard.press(' ');
        }
        // All other cases ('instructions-next', 'fullscreen', 'player-choice',
        // 'single-button', survey) are already handled via page.evaluate clicks.

        // Short pause between actions so jsPsych can process and render next trial
        await sleep(150);
    }

    throw new Error(`Participant ${participantNum} timed out after ${EXPERIMENT_TIMEOUT_MS / 1000}s`);
}

// ── Per-participant simulation ─────────────────────────────────────────────
async function simulateParticipant(browser, participantNum) {
    const context = await browser.newContext({
        viewport: { width: 1280, height: 800 }
    });
    const page = await context.newPage();

    const errors  = [];
    const consoleLogs = [];

    page.on('console', msg => {
        if (msg.type() === 'error') {
            const text = msg.text();
            // Ignore innocuous Playwright / third-party noise
            if (!text.includes('favicon') && !text.includes('net::ERR')) {
                errors.push(text);
            }
        }
    });
    page.on('pageerror', err => errors.push(`PAGE ERROR: ${err.message}`));

    try {
        // Navigate to experiment
        await page.goto(SERVER_URL, { waitUntil: 'domcontentloaded', timeout: 30_000 });

        // Consent page
        await page.check('#consent-checkbox');
        await page.click('#continue-button');

        // Wait for data to load + preload to finish — signalled by the fullscreen
        // button appearing (wait_for_data → preload → fullscreen_enter)
        console.log(`    [P${participantNum}] Waiting for data to load (up to 3 min)...`);
        await page.waitForSelector('#jspsych-fullscreen-btn', { timeout: DATA_LOAD_TIMEOUT_MS });
        console.log(`    [P${participantNum}] Data loaded. Running trials...`);

        await runTrials(page, participantNum);

        return { participantNum, success: true, errors };
    } catch (err) {
        errors.push(err.message);
        return { participantNum, success: false, errors };
    } finally {
        await context.close();
    }
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
    console.log(`\nMatrix Game Participant Simulator`);
    console.log(`  Participants : ${N_PARTICIPANTS}`);
    console.log(`  Server       : ${SERVER_URL}`);
    console.log(`  Workers      : ${WORKERS}`);
    console.log(`  Headed       : ${HEADED}`);
    console.log('─'.repeat(50));

    const browser = await chromium.launch({ headless: !HEADED });

    const queue = Array.from({ length: N_PARTICIPANTS }, (_, i) => i + 1);
    const results = [];
    let running = 0;

    await new Promise((resolve) => {
        function startNext() {
            if (queue.length === 0 && running === 0) { resolve(); return; }
            while (running < WORKERS && queue.length > 0) {
                const pNum = queue.shift();
                running++;
                console.log(`  [P${pNum}] Starting...`);
                simulateParticipant(browser, pNum).then(result => {
                    results.push(result);
                    running--;
                    const status = result.success ? 'OK ✓' : 'FAIL ✗';
                    console.log(`  [P${result.participantNum}] ${status}${result.errors.length ? ' — ' + result.errors[0].slice(0, 80) : ''}`);
                    startNext();
                });
            }
        }
        startNext();
    });

    await browser.close();

    // Summary
    const successes = results.filter(r => r.success).length;
    const failures  = results.filter(r => !r.success);
    console.log('─'.repeat(50));
    console.log(`Results: ${successes}/${N_PARTICIPANTS} successful`);
    if (failures.length > 0) {
        console.log(`\nFailed participants:`);
        failures.forEach(r => {
            console.log(`  P${r.participantNum}: ${r.errors.join(' | ')}`);
        });
    }
    process.exit(failures.length > 0 ? 1 : 0);
}

main().catch(err => { console.error(err); process.exit(1); });
