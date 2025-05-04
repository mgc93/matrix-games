
// part 1
// choose action in game (based on new games shown later)
// part 2
// choose player after seeing same action in the game
// another two screens
// for player 1 - choose action in new game knowing rt
// for player 2 - choose action in new game knowing rt
// part 3
// choose belief of what a random player does
// part 4
// choose belief of what a player with a given rt does (repeat rt shown before)
// needs to be split in two screens: one shows the game and rt, another shows new game and asks for belief


/** to do list */
// (done) screen for game + player's rt
// (done) screen for player rt + game choice
// (done) screen for belief + rt 
// (done) instructions + preload images
// (done) survey code + participant number
// (done) control quiz: choice
// (done) control quiz: belief
// (done) fullscreen enter and check
// (done) add game details to all the plugins
// (done) make response to belieft rt diaplay only to advance with spacebar
// (done) change jspsych to jsPsych in the plugins
// (done) figure out how to handle new design
// (done) fix all css code
// (done) check all functions - especially shuffling of games
// (done) make sure all relevant data is saved in the plugins
// (done) add full design - add random numbers for testing?
// (done) choice action for each player rt (need 2 screens - one for each player)
// (done) select design trials based on desired grouping
// (done) make sure the same unique games are displayed for choice and belief without rt

// (done) add fixation cross - currently blank
// (done) replace ohio seal with ucla seal - make sure the consent form is correct ucla one
// (done) add choice and belief overview for the RT parts
// (done) double check all relevant data is saved in the plugin
// (done) test flow
// adjust data for pluings to include previous and next game each time?
// on finish callback and rest of functions back to normal after putting on heroku
// code for preprocessing data
// code for payment

// to ask
// (done) write additional instructions
// (done) add instructions for the other parts: choice + rt, choice + player, belief + rt
// add quiz for the other parts?
// think about whether you want to allow duplicate games - makes things harder?
// consider adding a line about mean RT 
// should i shuffle order of actions for each player? now it’s 1 then 2 regardless of who you chose
// player 1 is alwways faster than player 2 based on how i select quantiles - should i randomize this?

// tests to check
// (done) check if correct data is saved for each part (based on the actual display)
// (done) check that getgamematrix displays the right game (x or y)
// (done) check that display order is the same for choice and beliefs
// (done) check that the same y games as used throughout
// (done) check that sampled number of games makes sense and follows desired sampling



function startExperiment() {

    var trialcounter;

    var survey_code = '';
    var payFailQuiz1 = '0c';
    var payFailQuiz2 = '500c';


    function uploadSubjectStatus(status) {
        $.ajax({
            type: "POST",
            url: "/subject-status",
            data: JSON.stringify({ subject_id, status }),
            contentType: "application/json"
        });
    }

    function makeSurveyCode(status) {
        uploadSubjectStatus(status);
        var prefix = { 'success': 'cg', 'failed_quiz_game': 'fg', 'failed_quiz_belief': 'fb' }[status]
        return `${prefix}${subject_id}`;
    }
    

    var successExp = false;
    var success_guard = {
        type: jsPsychCallFunction,
        func: () => { 
            successExp = true; 
        }
    }
    

    /* Close fullscreen */
    function closeFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            /* Chrome, Safari and Opera */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            /* IE/Edge */
            document.msExitFullscreen();
        }
    }

    // Initialize jsPsych
    const jsPsych = initJsPsych(
        {
            on_trial_finish: function () {
                trialcounter = jsPsych.data.get().count();
                if (successExp) {
                    closeFullscreen();
                    survey_code = makeSurveyCode('success');
                    //Your survey code is: ${makeSurveyCode('success')}. </br>
                    document.body.style.cursor = 'pointer'
                    jsPsych.endExperiment(`<div>
                    Thank you for your participation!</br>
                    We will send you the payment for Part 1 or Part 2 soon. </br>
                    <br></br>
                    Your completion code is <span style="color:cyan;">xxxxxxx</span>.<br/>
                    Make sure you copy this code in order to get paid! </br>
                    <br></br>
                    You can close the browser to end the experiment now. </br>
                    </div>`);
                }
                if (trialcounter == 10) { 
                    console.log(`Current trial counter: ${trialcounter}`);
                    on_finish_callback();
                    jsPsych.data.reset();
                }
            },
            on_interaction_data_update: function(data){
                if(data.event == 'fullscreenexit' && should_be_in_fullscreen){
                  console.log('exited fullscreen');
                  // hide the contents of the current trial
                  jsPsych.getDisplayElement().style.visibility = 'hidden';
                  // add a div that contains a message and button to re-enter fullscreen
                  jsPsych.getDisplayElement().insertAdjacentHTML('beforebegin',
                  '<div id="message-div" style="margin: auto; width: 100%; text-align: center; position: absolute; top: 40%;">'+
                  '<p>Please remain in fullscreen mode during the task.</p>'+
                  '<p>When you click the button below, you will enter fullscreen mode.</p>'+
                  '<button id="jspsych-fullscreen-btn" class="jspsych-btn">Continue</button></div>');
                  // call the request fullscreen function when the button is clicked
                  document.querySelector('#jspsych-fullscreen-btn').addEventListener('click', function() {
                    var element = document.documentElement;
                    if (element.requestFullscreen) {
                      element.requestFullscreen();
                    } else if (element.mozRequestFullScreen) {
                      element.mozRequestFullScreen();
                    } else if (element.webkitRequestFullscreen) {
                      element.webkitRequestFullscreen();
                    } else if (element.msRequestFullscreen) {
                      element.msRequestFullscreen();
                    }
                  });
                }
                if(data.event == 'fullscreenenter'){
                  console.log('entered fullscreen');
                  // when entering fullscreen, check to see if the participant is re-entering fullscreen, 
                  // i.e. the 'please enter fullscreen' message is on the page
                  var msg_div = document.querySelector('#message-div');
                  if (msg_div !== null) {
                    // remove the message
                    msg_div.remove(); 
                    // show the contents of the current trial again
                    jsPsych.getDisplayElement().style.visibility = 'visible';
                  }
                }
            },
            on_finish: () => {
                console.log("Experiment finished");
                on_finish_callback();
            },
            on_close: () => {
                console.log("Experiment closed");
                on_finish_callback();
            }
        }
    );


    var subject_id = jsPsych.randomization.randomID(7);

    // get prolific ID from subjects
    // capture info from Prolific
    var prolific_subject_id = jsPsych.data.getURLVariable('PROLIFIC_PID');
    var prolific_study_id = jsPsych.data.getURLVariable('STUDY_ID');
    var prolific_session_id = jsPsych.data.getURLVariable('SESSION_ID');

    var on_finish_callback = function () {
        try {
            console.log("on_finish_callback triggered");
            jsPsych.data.addProperties({
                browser_name: bowser.name,
                browser_type: bowser.version,
                subject: subject_id,
                pass_quiz_1: passed_quiz_1,
                pass_quiz_2: passed_quiz_2,
                prolific_subject_id: prolific_subject_id,
                prolific_study_id: prolific_study_id,
                prolific_session_id: prolific_session_id,
                interaction: jsPsych.data.getInteractionData().json(),
                windowWidth: screen.width,
                windowHight: screen.height
            });
            var data = JSON.stringify(jsPsych.data.get().values());
            $.ajax({
                type: "POST",
                url: "/data",
                data: data,
                contentType: "application/json"
            })
            .done(function () {
                console.log("Data successfully sent to server");
            })
            .fail(function () {
                console.error("Error saving data to server");
            });
        } catch (error) {
            console.error("Error in on_finish_callback:", error);
        }
    };
    
    

    // functions
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRandomFixDur(min, max) {
        return Math.random() * max + min;
    }

    function listToMatrix(list, elementsPerSubArray) {
        var matrix = [], i, k;
        for (i = 0, k = -1; i < list.length; i++) {
            if (i % elementsPerSubArray === 0) {
                k++;
                matrix[k] = [];
            }
            matrix[k].push(list[i]);
        }
        return matrix;
    }


    // define game class
    class Game {
        constructor({
            r_x, r_y,
            type_game_x, type_game_y,
            eu_x, eu_y,
            n_game_x, n_game_y,
            n_game_r_x, n_game_r_y,
            a_x, b_x, c_x, d_x,
            a_y, b_y, c_y, d_y,
            rt_q_1, rt_q_2, rt_obs_1, rt_obs_2,
            subject_1, subject_2,
            player_1_chosen, player_2_chosen
        }) {
            // Payoffs
            this.payoff_x = [a_x, a_x, c_x, b_x, b_x, c_x, d_x, d_x]; //payoff_x;
            this.payoff_y = [a_y, a_y, c_y, b_y, b_y, c_y, d_y, d_y]; //payoff_y;
    
            // Game parameters
            this.r_x = r_x;
            this.r_y = r_y;
            this.type_game_x = type_game_x;
            this.type_game_y = type_game_y;
            this.eu_x = eu_x;
            this.eu_y = eu_y;
            this.n_game_x = n_game_x;
            this.n_game_y = n_game_y;
            this.n_game_r_x = n_game_r_x;
            this.n_game_r_y = n_game_r_y;
    
            // Transitions
            this.a_x = a_x; this.b_x = b_x; this.c_x = c_x; this.d_x = d_x;
            this.a_y = a_y; this.b_y = b_y; this.c_y = c_y; this.d_y = d_y;
    
            // Reaction times
            this.rt_q_1 = rt_q_1;
            this.rt_q_2 = rt_q_2;
            this.rt_obs_1 = rt_obs_1;
            this.rt_obs_2 = rt_obs_2;
    
            // Subjects & decisions
            this.subject_1 = subject_1;
            this.subject_2 = subject_2;
            this.player_1_chosen = player_1_chosen;
            this.player_2_chosen = player_2_chosen;
        }
    
        // Reshuffle all arrays in the same random order
        reshuffle() {
            const n = this.r_x.length;
            const indices = Array.from({ length: n }, (_, i) => i);
            const shuffledIndices = jsPsych.randomization.shuffle(indices);
        
            const shuffleArray = (arr) => shuffledIndices.map(i => arr[i]);
        
            const reshuffledGame = new Game({
                r_x: shuffleArray(this.r_x),
                r_y: shuffleArray(this.r_y),
                type_game_x: shuffleArray(this.type_game_x),
                type_game_y: shuffleArray(this.type_game_y),
                eu_x: shuffleArray(this.eu_x),
                eu_y: shuffleArray(this.eu_y),
                n_game_x: shuffleArray(this.n_game_x),
                n_game_y: shuffleArray(this.n_game_y),
                n_game_r_x: shuffleArray(this.n_game_r_x),
                n_game_r_y: shuffleArray(this.n_game_r_y),
                a_x: shuffleArray(this.a_x),
                b_x: shuffleArray(this.b_x),
                c_x: shuffleArray(this.c_x),
                d_x: shuffleArray(this.d_x),
                a_y: shuffleArray(this.a_y),
                b_y: shuffleArray(this.b_y),
                c_y: shuffleArray(this.c_y),
                d_y: shuffleArray(this.d_y),
                rt_q_1: shuffleArray(this.rt_q_1),
                rt_q_2: shuffleArray(this.rt_q_2),
                rt_obs_1: shuffleArray(this.rt_obs_1),
                rt_obs_2: shuffleArray(this.rt_obs_2),
                subject_1: shuffleArray(this.subject_1),
                subject_2: shuffleArray(this.subject_2),
                player_1_chosen: shuffleArray(this.player_1_chosen),
                player_2_chosen: shuffleArray(this.player_2_chosen)
            });
        
            reshuffledGame.shuffle_order = shuffledIndices; // Save it!
        
            return reshuffledGame;
        }
        

        getGameMatrix(choiceCount, randDisplayOrder, game_x_or_y) {
            const payoffOrder = {
                // [A, A, C, B, B, C, D, D];
                0: [1, 2, 3, 4, 5, 6, 7, 8], // top - bottom
                1: [5, 6, 7, 8, 1, 2, 3, 4], // bottom - top
                2: [7, 8, 5, 6, 3, 4, 1, 2], // bottom - top
                3: [3, 4, 1, 2, 7, 8, 5, 6], // top - bottom
            };
    
            // index - 1 to transfer the numbering of payoff into javascript index that starts at 0
            if(game_x_or_y=="x"){
                return payoffOrder[randDisplayOrder[choiceCount]].map(
                    (index) => parseFloat(this.payoff_x[index - 1][choiceCount]).toFixed(0) 
                );
            } else if(game_x_or_y=="y"){
                return payoffOrder[randDisplayOrder[choiceCount]].map(
                    (index) => parseFloat(this.payoff_y[index - 1][choiceCount]).toFixed(0) 
                );
            } else {
                return("Game x or y not specified!")
            }
        }
    }

    // Put this at the top of your script
    let shuffledGameChoiceWithoutRT;
    let shuffledGameChoiceWithRT;
    let shuffledGameBeliefWithoutRT;
    let shuffledGameBeliefWithRT;

    let randomOrderChoiceWithoutRT;
    let randomOrderChoiceWithRT;
    let randomOrderBeliefWithoutRT;
    let randomOrderBeliefWithRT;

    // constant throughout the experiment
    let randDisplayOrderChoice;
    let randDisplayOrderBelief;

    // Load JSON and initialize game instance
    fetch("json/design_data_play_comb_pred.json")
        .then(response => response.json())
        .then(data => {
            const shuffle = (array) => {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
            };

            // unique combinations of rt quantiles for player 1 and player 2 and next game number
            const getUniqueRows = (dataSubset, count) => {
                const seenKeys = new Set();
                const selected = [];
                shuffle(dataSubset);
                for (const row of dataSubset) {
                    const key = `${row['rt_1']}|${row['rt_2']}|${row['n_game.y']}`;
                    if (!seenKeys.has(key)) {
                        seenKeys.add(key);
                        selected.push(row);
                    }
                    if (selected.length === count) break;
                }
                return selected;
            };

            const uniqueTypes = Array.from(new Set(data.map(row => row['type_game.x'])));
            const allSelectedRows = [];

            // for each game type: get 3 rows where the players chose top and 3 rows where the players chose bottom
            // total of (3 + 3) x 4 = 6 x 4 = 24?
            uniqueTypes.forEach(typeVal => {
                const typeSubset = data.filter(row => row['type_game.x'] === typeVal);
                const topRows = typeSubset.filter(row => row['player_1_chosen'] === 'top');
                const bottomRows = typeSubset.filter(row => row['player_1_chosen'] === 'bottom');
                const selectedTop = getUniqueRows(topRows, 3);
                const selectedBottom = getUniqueRows(bottomRows, 3);
                allSelectedRows.push(...selectedTop, ...selectedBottom);
            });

            // Extract variables
            const get = key => allSelectedRows.map(row => row[key]);

            const gameInstance = new Game({
                r_x: get('r.x'),
                r_y: get('r.y'),
                type_game_x: get('type_game.x'),
                type_game_y: get('type_game.y'),
                eu_x: get('euEfficient.x'),
                eu_y: get('euEfficient.y'),
                n_game_x: get('n_game.x'),
                n_game_y: get('n_game.y'),
                n_game_r_x: get('n_game_within_r.x'),
                n_game_r_y: get('n_game_within_r.y'),
                a_x: get('a_trans.x'),
                b_x: get('b_trans.x'),
                c_x: get('c_trans.x'),
                d_x: get('d_trans.x'),
                a_y: get('a_trans.y'),
                b_y: get('b_trans.y'),
                c_y: get('c_trans.y'),
                d_y: get('d_trans.y'),
                rt_q_1: get('rt_1'),
                rt_q_2: get('rt_2'),
                rt_obs_1: get('rt_obs_1'),
                rt_obs_2: get('rt_obs_2'),
                subject_1: get('subject_number_1'),
                subject_2: get('subject_number_2'),
                player_1_chosen: get('player_1_chosen'),
                player_2_chosen: get('player_2_chosen')
            });

            // Now initialize reshuffled game instances
            shuffledGameChoiceWithoutRT = gameInstance.reshuffle();
            shuffledGameChoiceWithRT = gameInstance.reshuffle();
            shuffledGameBeliefWithoutRT = gameInstance.reshuffle();
            shuffledGameBeliefWithRT = gameInstance.reshuffle();

            // Create display order arrays
            const n = shuffledGameChoiceWithoutRT.r_x.length;
            const order = getRandomInt(0, 3);
            randDisplayOrderChoice = Array(n).fill(order);
            randDisplayOrderBelief = randDisplayOrderChoice;

            // Save shuffle order
            randomOrderChoiceWithoutRT = shuffledGameChoiceWithoutRT.shuffle_order;
            randomOrderChoiceWithRT = shuffledGameChoiceWithRT.shuffle_order;
            randomOrderBeliefWithoutRT = shuffledGameBeliefWithoutRT.shuffle_order;
            randomOrderBeliefWithRT = shuffledGameBeliefWithRT.shuffle_order;

            // Map top/bottom to left/right based on randDisplayOrderChoice
            const mapChoice = (choice, display) => {
                if (choice === "top") {
                    return (display === 0 || display === 1) ? "L" : "R";
                } else if (choice === "bottom") {
                    return (display === 0 || display === 1) ? "R" : "L";
                } else {
                    return null;
                }
            };

            shuffledGameChoiceWithRT.player_1_chosen_mapped = shuffledGameChoiceWithRT.player_1_chosen.map(
                (choice, i) => mapChoice(choice, randDisplayOrderChoice[i])
            );
            shuffledGameChoiceWithRT.player_2_chosen_mapped = shuffledGameChoiceWithRT.player_2_chosen.map(
                (choice, i) => mapChoice(choice, randDisplayOrderChoice[i])
            );

            shuffledGameBeliefWithRT.player_1_chosen_mapped = shuffledGameBeliefWithRT.player_1_chosen.map(
                (choice, i) => mapChoice(choice, randDisplayOrderBelief[i])
            );
            shuffledGameBeliefWithRT.player_2_chosen_mapped = shuffledGameBeliefWithRT.player_2_chosen.map(
                (choice, i) => mapChoice(choice, randDisplayOrderBelief[i])
            );

            // testing
            console.log("shuffledGameChoiceWithRT:",shuffledGameChoiceWithRT);
            console.log("shuffledGameBeliefWithRT:",shuffledGameBeliefWithRT);
            console.log("randomOrderChoiceWithRT:", randomOrderChoiceWithRT);
            console.log("randomOrderBeliefWithRT:", randomOrderBeliefWithRT);
            console.log("randDisplayOrderChoice:", randDisplayOrderChoice);
            console.log("randDisplayOrderBelief:", randDisplayOrderBelief);
            console.log("Game Matrix x with RT:", shuffledGameChoiceWithRT.getGameMatrix(0, randDisplayOrderChoice, "x"));
            console.log("Game Matrix y with RT:", shuffledGameChoiceWithRT.getGameMatrix(0, randDisplayOrderChoice, "y"));
            console.log("Belief Matrix x with RT:", shuffledGameBeliefWithRT.getGameMatrix(0, randDisplayOrderBelief, "x"));
            console.log("Belief Matrix y with RT:", shuffledGameBeliefWithRT.getGameMatrix(0, randDisplayOrderBelief, "y"));

        });

        
    // select a random number of trials based on grouping

    // select unique games from the design for choice and beliefs without rt
    // make sure they are the same games as those with rt displayed

    // design 
    // var A = [
    //     100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100
    // ];

    // var B = [
    //     50, 50, 50, 50, 50, 50, 50, 50, 60, 60, 60, 60, 60, 60, 60, 60, 70, 70, 70, 70, 70, 70, 70, 70, 80, 80, 80, 80, 80, 80, 90, 90, 90, 90, 90, 90, 110, 110, 110, 110, 110, 110, 120, 120, 120, 120, 120, 120, 130, 130, 130, 130, 130, 130, 130, 130, 140, 140, 140, 140, 140, 140, 140, 140, 150, 150, 150, 150, 150, 150, 150, 150
    // ];

    // var C = [
    //     10, 20, 30, 40, 60, 70, 80, 90, 0, 20, 30, 40, 60, 70, 80, 100, 0, 10, 30, 40, 60, 70, 90, 100, 0, 10, 20, 80, 90, 100, 0, 10, 20, 80, 90, 100, 0, 10, 20, 80, 90, 100, 0, 10, 20, 80, 90, 100, 0, 10, 30, 40, 60, 70, 90, 100, 0, 20, 30, 40, 60, 70, 80, 100, 10, 20, 30, 40, 60, 70, 80, 90
    // ];

    // var D = [
    //     50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50
    // ];

    // var payoff = [A, A, C, B, B, C, D, D];

    // var r = [
    //     0.4444444, 0.3750000, 0.2857143, 0.1666667, -0.2500000, -0.6666667, -1.5000000, -4.0000000, 0.5555556, 0.4285714, 0.3333333, 0.2000000, -0.3333333, -1.0000000, -3.0000000, 5.0000000, 0.6250000, 0.5714286, 0.4000000, 0.2500000, -0.5000000, -2.0000000, 4.0000000, 2.5000000, 0.7142857, 0.6666667, 0.6000000, 3.0000000, 2.0000000, 1.6666667, 0.8333333, 0.8000000, 0.7500000, 1.5000000, 1.3333333, 1.2500000, 1.2500000, 1.3333333, 1.5000000, 0.7500000, 0.8000000, 0.8333333, 1.6666667, 2.0000000, 3.0000000, 0.6000000, 0.6666667, 0.7142857, 2.5000000, 4.0000000, -2.0000000, -0.5000000, 0.2500000, 0.4000000, 0.5714286, 0.6250000, 5.0000000, -3.0000000, -1.0000000, -0.3333333, 0.2000000, 0.3333333, 0.4285714, 0.5555556, -4.0000000, -1.5000000, -0.6666667, -0.2500000, 0.1666667, 0.2857143, 0.3750000, 0.4444444
    // ];

    // var type_game = [
    //     3.00, 3.00, 3.00, 3.00, 1.00, 1.00, 1.00, 1.00, 3.00, 3.00, 3.00, 3.00, 1.00, 1.00, 1.00, 1.00, 3.00, 3.00, 3.00, 3.00, 1.00, 1.00, 1.00, 1.00, 3.00, 3.00, 3.00, 1.00, 1.00, 1.00, 3.00, 3.00, 3.00, 1.00, 1.00, 1.00, 4.00, 4.00, 4.00, 2.00, 2.00, 2.00, 4.00, 4.00, 4.00, 2.00, 2.00, 2.00, 4.00, 4.00, 4.00, 4.00, 2.00, 2.00, 2.00, 2.00, 4.00, 4.00, 4.00, 4.00, 2.00, 2.00, 2.00, 2.00, 4.00, 4.00, 4.00, 4.00, 2.00, 2.00, 2.00, 2.00
    // ];

    // var eu = [
    //     5.000000, 5.000000, 5.000000, 5.000000, 5.000000, 5.000000, 5.000000, 5.000000, 5.555556, 5.428571, 5.333333, 5.200000, 4.666667, 4.000000, 2.000000, 10.000000, 6.250000, 6.142857, 5.800000, 5.500000, 4.000000, 1.000000, 13.000000, 10.000000, 7.142857, 7.000000, 6.800000, 14.000000, 11.000000, 10.000000, 8.333333, 8.200000, 8.000000, 11.000000, 10.333333, 10.000000, 12.500000, 13.000000, 14.000000, 9.500000, 9.800000, 10.000000, 16.666667, 19.000000, 26.000000, 9.200000, 9.666667, 10.000000, 25.000000, 37.000000, -11.000000, 1.000000, 7.000000, 8.200000, 9.571429, 10.000000, 50.000000, -22.000000, -4.000000, 2.000000, 6.800000, 8.000000, 8.857143, 10.000000, -35.000000, -10.000000, -1.666667, 2.500000, 6.666667, 7.857143, 8.750000, 9.444444
    // ];

    // var n_game_r = [
    //     1, 2, 3, 4, 1, 2, 3, 4, 5, 6, 7, 8, 5, 6, 7, 8, 9, 10, 11, 12, 9, 10, 11, 12, 13, 14, 15, 13, 14, 15, 16, 17, 18, 16, 17, 18, 1, 2, 3, 1, 2, 3, 4, 5, 6, 4, 5, 6, 7, 8, 9, 10, 7, 8, 9, 10, 11, 12, 13, 14, 11, 12, 13, 14, 15, 16, 17, 18, 15, 16, 17, 18
    // ];

    // var n_game = [
    //     1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72
    // ];

    // // no need to reshape the payoff anymore
    // var GameMatrices = payoff;

    // // randomize order of games
    // var n = GameMatrices[0].length;
    // function getRandomGameOrder(n) {
    //     var nList = [];
    //     for (var i = 0; i < n; i++) {
    //         nList.push(i);
    //     }
    //     var randInd = jsPsych.randomization.shuffle(nList);
    //     return randInd;
    // }

    // // randomize for each subject top and bottom actions
    // // choose either display 0 or 3 for each subject throughout the experiment
    // var order = getRandomInt(0, 3);
    // if (order == 0) {
    //     var randDisplayOrderChoice = Array(n).fill([0]).flat();
    // } else if (order == 1) {
    //     var randDisplayOrderChoice = Array(n).fill([1]).flat();
    // } else if (order == 2) {
    //     var randDisplayOrderChoice = Array(n).fill([2]).flat();
    // } else if (order == 3) {
    //     var randDisplayOrderChoice = Array(n).fill([3]).flat();
    // }

    // // to display the game matrix for the belief task the way it was displayed in the choice task
    // var randDisplayOrderBelief = randDisplayOrderChoice;

    // class Game {
    //     constructor(payoff, r, type_game, eu, n_game, n_game_r) {
    //         this.payoff = payoff; // Array of payoffs
    //         this.r = r;           // Array of risk values
    //         this.type_game = type_game; // Array of game types
    //         this.eu = eu;         // Array of expected utilities
    //         this.n_game = n_game; // Game numbers
    //         this.n_game_r = n_game_r; // Sub-game numbers
    //     }

    //     // Shuffle the order of games
    //     shuffle(order) {
    //         const shuffleArray = (array) => order.map((index) => array[index]);
    //         return new Game(
    //             this.payoff.map((matrix) => shuffleArray(matrix)), // Shuffle each matrix in payoff
    //             shuffleArray(this.r),
    //             shuffleArray(this.type_game),
    //             shuffleArray(this.eu),
    //             shuffleArray(this.n_game),
    //             shuffleArray(this.n_game_r)
    //         );
    //     }
    //     // Get a game matrix for a specific trial
    //     getGameMatrix(choiceCount, randDisplayOrder) {
    //         const payoffOrder = {
    //             0: [1, 2, 3, 4, 5, 6, 7, 8],
    //             1: [5, 6, 7, 8, 1, 2, 3, 4],
    //             2: [7, 8, 5, 6, 3, 4, 1, 2],
    //             3: [3, 4, 1, 2, 7, 8, 5, 6],
    //         };

    //         return payoffOrder[randDisplayOrder[choiceCount]].map(
    //             (index) => parseFloat(this.payoff[index - 1][choiceCount]).toFixed(0)
    //         );
    //     }
    // }

    // // Create an instance of the Game class with the initial data.
    // const initialGame = new Game(
    //     payoff, //[A, A, C, B, B, C, D, D], // Payoffs
    //     r, // r values
    //     type_game, // Game types
    //     eu, // Expected utilities
    //     n_game, //Array.from({ length: 72 }, (_, i) => i + 1), // Game numbers
    //     n_game_r // Sub-game numbers
    // );

    // // Use the shuffle method to randomize the games for each participant.
    // const randomOrderChoice = getRandomGameOrder(initialGame.payoff[0].length); // Generate a random order
    // const randomOrderBelief = getRandomGameOrder(initialGame.payoff[0].length); // Generate a new random order
    // const shuffledChoiceGame = initialGame.shuffle(randomOrderChoice); // Create a shuffled version of the game
    // const shuffledBeliefGame = initialGame.shuffle(randomOrderBelief);

    // Retrieve specific trial data, like the game matrix, using class methods.
    //const trialMatrixChoice = shuffledChoiceGame.getGameMatrix(choiceCount, randDisplayOrderChoice);



    var should_be_in_fullscreen = false;

    /** full screen */
    var fullscreen_enter = {
        type: jsPsychFullscreen,
        message: `<div> Before we begin, please close any unnecessary programs or applications on your computer. <br/>
        This will help the study run more smoothly.    <br/>
        Also, please close any browser tabs that could produce popups or alerts that would interfere with the study.    <br/>
        Finally, once the study has started, <b>DO NOT EXIT</b> fullscreen mode or you will terminate the study and not receive any payment. <br/>   
        <br><br/>
        The study will switch to full screen mode when you press the button below.  <br/>
        When you are ready to begin, press the button.</div>`,
        fullscreen_mode: true,
        on_start: function() {
            should_be_in_fullscreen = true; // once this trial starts, the participant should be in fullscreen
        },
        on_finish: function () {
            document.body.style.cursor = 'none'
        }
    };

    var experiment_overview = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `<div> <font size=120%; font color = 'green';>Experiment Overview </font><br/>
                                                     <br><br/>
                          Now, we will begin with the study.<br/>
                                                        <br><br/>
                          When you are ready, press the  <b>SPACE BAR</b> to continue. </div>`,
        choices: [" "],
        post_trial_gap: 500
        //on_finish: () => document.body.style.cursor = 'pointer',
    }

    var choice_overview = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `<div><font size=120%; font color = 'green';>Part 1 Task </font><br/>
                                        <br><br/>
            Each round, you will see a table on the screen. <br/>      
            To select the top row of the table, press the <b><font color='green'>UP</font></b> key. <br/>
            To select the bottom row of the table, press  the <b><font color='green'>DOWN</font></b> key. <br/>
            After each choice, look at the red circle at the center of the screen.  <br/>
            <br><br/>
            You will make a total of <font size=105%; font color = 'white';> 20 </font>decision in this part. <br/>
            <br><br/>
            When you are ready, press the  <b>SPACE BAR</b> to continue.  </div>`,
        choices: [" "],
        post_trial_gap: 500
    }

    var choice_rt_overview = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `<div><font size=120%; font color = 'green';> Part 1 Additional Task </font><br/>
                                        <br><br/>
            Each round, you will see a table on the screen and the previous actions of 2 other participants in that table<br/>   
            as well as how long they took to choose those actions. <br/>  
            <br><br/>
            You will first choose one of them to interact with in a different table.   <br/>  
            You will also choose an action in the new table for each participant. <br/>  
            Note that the participant you chose to interact with has a higher chance of determining your payment. <br/>  
            <br><br/>
            To select the top row of the table, press the <b><font color='green'>UP</font></b> key. <br/>
            To select the bottom row of the table, press  the <b><font color='green'>DOWN</font></b> key. <br/>
            After each choice, look at the red circle at the center of the screen.  <br/>
            <br><br/>
            You will chose actions in a total of <font size=105%; font color = 'white';> 20 </font> different tables. <br/>
            <br><br/>
            When you are ready, press the  <b>SPACE BAR</b> to continue.  </div>`,
        choices: [" "],
        post_trial_gap: 500
    }

    // belief overview
    var belief_overview = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `<div><font size=120%; font color = 'green';>Part 2 Task </font><br/>
                                            <br><br/>
                Each round, you will see a table on the screen and a slider bar. <br/>  
                You can make your response by clicking on the slider bar. <br/>
                When you are sure of your response, you can click the <b><font color='green'>CONTINUE</font></b> button. <br/>
                After each choice, look at the red dot at the center of the screen.  <br/>
                <br><br/>
                You will make a total of <font size=105%; font color = 'white';> 20 </font> decision in this part. <br/>
                <br><br/>
                When you are ready, press the  <b>SPACE BAR</b> to continue.  </div>`,
        choices: [" "],
        post_trial_gap: 500
    }

    var belief_rt_overview = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `<div><font size=120%; font color = 'green';>Part 2 Task </font><br/>
                                            <br><br/>
                Each round, you will see a table on the screen and the previous action of a participant <br/> 
                as well as how long they took to chose that action. <br/>    
                Press the <b><font color='green'>SPACEBAR</font></b> to continue to the choice screen. <br/>
                <br><br/>
                You will then see a new table on the screen and a slider bar. <br/>  
                You will have to guess how likely that participant is to choose an action in the new table. <br/>  
                <br><br/>
                You can make your response by clicking on the slider bar. <br/>
                When you are sure of your response, you can click the <b><font color='green'>CONTINUE</font></b> button. <br/>
                After each choice, look at the red dot at the center of the screen.  <br/>
                <br><br/>
                You will make guesses in a total of <font size=105%; font color = 'white';> 20 </font> different tables. <br/>
                <br><br/>
                When you are ready, press the  <b>SPACE BAR</b> to continue.  </div>`,
        choices: [" "],
        post_trial_gap: 500
    }

    // fixation
    var fixation = {
        type: jsPsychHtmlKeyboardResponseFixation,
        stimulus: '<span id="calibration_dot_instruction"></span>',
        choices: "NO_KEYS",
        trial_duration: getRandomFixDur(0.5, 1.5) * 1000,
        on_finish: () => document.body.style.cursor = 'pointer',
    };

    // break
    var break_time = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `<div>You are about halfway done! Now you can take a short break if you want.</br>
                    <br></br>
                    When you are ready to continue the study, press the <b>SPACE BAR</b>.</div>`,
        choices: [" "],
        post_trial_gap: 500,
    };

    /** control questions images */
    var control_images = [];
    for (var i = 1; i < 3; i++){
        control_images.push('img/control/control_img_' + i + '.png');
    }

    /** load instructions images */
    var instructions_images = [];
    for (var i = 1; i <= 23; i++) {
        instructions_images.push('img/instructions/Slide' + i + '.png');
    }

    // to manually preload media files, create an array of file paths for each media type
    // these array can be passed into the preload plugin using the images
    var preload = {
        type: jsPsychPreload,
        images: [instructions_images, control_images]
    }

    function getImgHTML(instructions) {
        var imgHTMLInstructions = [];
        var startString = [`<img class = 'img_instructions' src="`];
        var endString = [`"></img>`];
        var elements = [];
        for (var i = 0; i <= instructions.length; i++) {
            elements[i] = startString.concat(instructions[i], endString);
            imgHTMLInstructions.push(elements[i].join(' '));
        }
        return imgHTMLInstructions;
    }

    imgHTMLInstructions = getImgHTML(instructions_images);

    // display instructions choice task
    var choice_instructions = {
        type: jsPsychInstructions,
        pages: imgHTMLInstructions.slice(0, 8),
        show_clickable_nav: true,
        on_finish: function () {
            document.body.style.cursor = 'pointer'
        }
    }

    var choice_rt_instructions = {
        type: jsPsychInstructions,
        pages: imgHTMLInstructions.slice(8, 12),
        show_clickable_nav: true,
        on_finish: function () {
            document.body.style.cursor = 'pointer'
        }
    }

    // display instructions belief task
    var belief_instructions = {
        type: jsPsychInstructions,
        pages: imgHTMLInstructions.slice(12, 20),
        show_clickable_nav: true,
        on_finish: function () {
            document.body.style.cursor = 'pointer'
        }
    }

    var belief_rt_instructions = {
        type: jsPsychInstructions,
        pages: imgHTMLInstructions.slice(20, 23),
        show_clickable_nav: true,
        on_finish: function () {
            document.body.style.cursor = 'pointer'
        }
    }


    // number of correct answers for control questions - choice task
    function getAnswersChoiceQuiz(choice_quiz_data) {
        var nCorrect = 0;
        var responses = [];
        // Extract responses
        for (var i = 0; i < choice_quiz_data.length; i++) {
            if (choice_quiz_data[i] && choice_quiz_data[i].response) {
                // Merge all response values into an array
                Object.values(choice_quiz_data[i].response).forEach(answer => responses.push(answer));
            }
        }
        // Define the correct answers
        var correctAnswers = ["200", "150", "100", "0", "TRUE", "FALSE"];
        // Compare extracted responses with correct answers
        for (var i = 0; i < responses.length; i++) {
            if (responses[i] === correctAnswers[i]) {
                nCorrect++;
            }
        }
        return nCorrect;
    }

    
    // number of correct answers for control questions - belief task
    function getAnswersBeliefQuiz(belief_quiz_data) {
        var nCorrect = 0;
        var responses = [];
        // Extract responses
        for (var i = 0; i < belief_quiz_data.length; i++) {
            if (belief_quiz_data[i] && belief_quiz_data[i].response) {
                // Merge all response values into an array
                Object.values(belief_quiz_data[i].response).forEach(answer => responses.push(answer));
            }
        }
        var correctAnswers = ["$8", "TRUE", "FALSE"];
        // Compare extracted responses with correct answers
        for (var i = 0; i < responses.length; i++) {
            if (responses[i] === correctAnswers[i]) {
                nCorrect++;
            }
        }
        return nCorrect;
    }

    // quiz about the choice task with feedback
    var question_choice_1_options = ["0",
        "100",
        "150",
        "200"];
    var question_choice_2_options = ["50",
        "100",
        "150",
        "200"];
    var question_choice_3_options = ["0",
        "50",
        "100",
        "150"];
    var question_choice_4_options = ["0",
        "50",
        "100",
        "150"];
    var question_choice_5_options = ["TRUE",
        "FALSE"];
    var question_choice_6_options = ["TRUE",
        "FALSE"];

    // highlight correct answer with green and provide explanation at the bottom
    var questions_choice_data = [];
    var feedback_question_choice_1 = [];
    var feedback_question_choice_2 = [];
    var feedback_question_choice_3 = [];
    var feedback_question_choice_4 = [];
    var feedback_question_choice_5 = [];
    var feedback_question_choice_6 = [];

    var passed_quiz_1 = 1;


    // to do: change survey to have the option to go back to instructions

    // question 1
    var control_question_choice_1 = {
        type: jsPsychSurveyMultiChoice,
        questions: [
            { prompt: "Question 1: If the COLUMN CHOOSER selects the column L and you select the row T, how many points will you earn?", 
                name: 'Q1', 
                options: question_choice_1_options, 
                required: true 
            },
        ],
        preamble: `<div> 
<br><br/>
Please answer the following question.</div>
<br><br/>
<div>Consider the following table.</div>
</div>
<br><br/>
<img class = 'img_questions' src="img/control/control_img_1.png"></img>
<br><br/>`,
        on_finish: function (data) {
            questions_choice_data.push(data);
            // Access the specific response for the question
            let response = data.response.Q1;
            // Check if the response includes "200"
            if (response && response.includes("200")) {
                data.correct = true; // Add the correct property
            } else {
                data.correct = false;
            }
        }
    };

    var control_question_choice_1_response = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function () {
            feedback_question_choice_1 = jsPsych.data.get().last(1).values()[0].correct;
            if (feedback_question_choice_1) {
                return `
<div>Your answer was <font size=120%; font color = 'green';> correct </font>!</div>
<br><br/> 
When you are ready, press the  <b>SPACE BAR</b> to continue. 
<br><br/> </div>
`;
            } else {
                return `
<div>Your answer was <font size=120%; font color = 'red';> incorrect </font>!</div>
<br><br/> 
<div>Question 1: If the COLUMN CHOOSER selects the column L and you select the row T, how many points will you earn?</div>
<br><br/> 
<br><br/>
<img class = 'img_questions' src="img/control/control_img_1.png"></img>
<br><br/>
<br><br/>
0 <br>
100 <br>
150 <br>
200 <br>
<br><br/>
The correct answer is: <font color = 'green';> 200 </font>.
<br><br/>
If the COLUMN CHOOSER selects the column L and you select the row T, then you end up in the UPPER-LEFT cell of the table.
<br><br/>
Your payoff is represented in GREEN.<br>
The COLUMN CHOOSER'S payoff is represented in RED. <br>
Therefore, you will earn <font color = 'green';> 200 </font> points. 
<br><br/>
When you are ready, press the  <b>SPACE BAR</b> to continue. 
<br><br/> 
</div>`
            }
        },
        post_trial_gap: 500,
        choices: [" "],
    }

    // question 2
    var control_question_choice_2 = {
        type: jsPsychSurveyMultiChoice,
        questions: [
            { prompt: "Question 2: If the COLUMN CHOOSER selects the column L and you select the row T, how many points will they earn?", 
                name: 'Q2', 
                options: question_choice_2_options, required: true },
        ],
        preamble: `<div> 
<br><br/>
Please answer the following question. </div>
<br><br/>
<div>Consider the following table.</div>
</div>
<br><br/>
<img class = 'img_questions' src="img/control/control_img_1.png"></img>
<br><br/>`,
        on_finish: function (data) {
            questions_choice_data.push(data);
            let response = data.response.Q2;
            if (response && response.includes("150")) {
                data.correct = true; 
            } else {
                data.correct = false;
            }
        }
    };

    var control_question_choice_2_response = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function () {
            feedback_question_choice_2 = jsPsych.data.get().last(1).values()[0].correct;
            if (feedback_question_choice_2) {
                return `
<div>Your answer was <font size=120%; font color = 'green';> correct </font>!</div>
<br><br/> 
When you are ready, press the  <b>SPACE BAR</b> to continue. 
<br><br/> </div>
`;
            } else {
                return `
<div>Your answer was <font size=120%; font color = 'red';> incorrect </font>!</div>
<br><br/> 
<div>Question 2: If the COLUMN CHOOSER selects the column L and you select the row T, how many points will they earn?</div>
<br><br/> 
<br><br/>
<img class = 'img_questions' src="img/control/control_img_1.png"></img>
<br><br/>
<br><br/>
50 <br>
100 <br>
150 <br>
200 <br>
<br><br/>
The correct answer is: <font color = 'green';> 150 </font>.
<br><br/>
If the COLUMN CHOOSER selects the column L and you select the row T, then you end up in the UPPER-LEFT cell of the table.
<br><br/>
Your payoff is represented in GREEN.<br>
The COLUMN CHOOSER'S payoff is represented in RED. <br>
Therefore, they will earn <font color = 'green';> 150 </font> points. 
<br><br/>
When you are ready, press the  <b>SPACE BAR</b> to continue. 
<br><br/> 
</div>`
            }
        },
        post_trial_gap: 500,
        choices: [" "],
    }

    // question 3
    var control_question_choice_3 = {
        type: jsPsychSurveyMultiChoice,
        questions: [
            { prompt: "Question 3: If the COLUMN CHOOSER selects the column L and you select the row B, how many points will you earn?", 
                name: 'Q3', 
                options: question_choice_3_options, required: true },
        ],
        preamble: `<div> 
<br><br/>
Please answer the following question. </div>
<br><br/>
<div>Consider the following table.</div>
</div>
<br><br/>
<img class = 'img_questions' src="img/control/control_img_1.png"></img>
<br><br/>`,
        on_finish: function (data) {
            questions_choice_data.push(data);
            let response = data.response.Q3;
            if (response && response.includes("100")) {
                data.correct = true; 
            } else {
                data.correct = false;
            }
        }
    };

    var control_question_choice_3_response = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function () {
            feedback_question_choice_3 = jsPsych.data.get().last(1).values()[0].correct;
            if (feedback_question_choice_3) {
                return `
<div>Your answer was <font size=120%; font color = 'green';> correct </font>!</div>
<br><br/> 
When you are ready, press the  <b>SPACE BAR</b> to continue. 
<br><br/> </div>
`;
            } else {
                return `
<div>Your answer was <font size=120%; font color = 'red';> incorrect </font>!</div>
<br><br/> 
<div>Question 3: If the COLUMN CHOOSER selects the column L and you select the row B, how many points will you earn?</div>
<br><br/> 
<br><br/>
<img class = 'img_questions' src="img/control/control_img_1.png"></img>
<br><br/>
<br><br/>
0 <br>
100 <br>
150 <br>
200 <br>
<br><br/>
The correct answer is: <font color = 'green';> 100 </font>.
<br><br/>
If the COLUMN CHOOSER selects the column L and you select the row B, then you end up in the LOWER-LEFT cell of the table.
<br><br/>
Your payoff is represented in GREEN.<br>
The COLUMN CHOOSER'S payoff is represented in RED. <br>
Therefore, you will earn <font color = 'green';> 100 </font> points. 
<br><br/>
When you are ready, press the  <b>SPACE BAR</b> to continue. 
<br><br/> 
</div>`
            }
        },
        post_trial_gap: 500,
        choices: [" "],
    }

    // question 4
    var control_question_choice_4 = {
        type: jsPsychSurveyMultiChoice,
        questions: [
            { prompt: "Question 4: If the COLUMN CHOOSER selects the column L and you select the row B, how many points will they earn?", 
                name: 'Q4', 
                options: question_choice_4_options, required: true },
        ],
        preamble: `<div> 
<br><br/>
Please answer the following question. </div>
<br><br/>
<div>Consider the following table.</div>
</div>
<br><br/>
<img class = 'img_questions' src="img/control/control_img_1.png"></img>
<br><br/>`,
        on_finish: function (data) {
            questions_choice_data.push(data);
            let response = data.response.Q4;
            if (response && response.includes("0")) {
                data.correct = true; 
            } else {
                data.correct = false;
            }
        }
    };

    var control_question_choice_4_response = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function () {
            feedback_question_choice_4 = jsPsych.data.get().last(1).values()[0].correct;
            if (feedback_question_choice_4) {
                return `
<div>Your answer was <font size=120%; font color = 'green';> correct </font>!</div>
<br><br/> 
When you are ready, press the  <b>SPACE BAR</b> to continue. 
<br><br/> </div>
`;
            } else {
                return `
<div>Your answer was <font size=120%; font color = 'red';> incorrect </font>!</div>
<br><br/> 
<div>Question 4: If the COLUMN CHOOSER selects the column L and you select the row B, how many points will they earn?</div>
<br><br/> 
<br><br/>
<img class = 'img_questions' src="img/control/control_img_1.png"></img>
<br><br/>
<br><br/>
0 <br>
100 <br>
150 <br>
200 <br>
<br><br/>
The correct answer is: <font color = 'green';> 0 </font>.
<br><br/>
If the COLUMN CHOOSER selects the column L and you select the row B, then you end up in the LOWER-LEFT cell of the table.
<br><br/>
Your payoff is represented in GREEN.<br>
The COLUMN CHOOSER'S payoff is represented in RED. <br>
Therefore, you will earn <font color = 'green';> 0 </font> points. 
<br><br/>
When you are ready, press the  <b>SPACE BAR</b> to continue. 
<br><br/> 
</div>`
            }
        },
        post_trial_gap: 500,
        choices: [" "],
    }


    // question 5
    var control_question_choice_5 = {
        type: jsPsychSurveyMultiChoice,
        questions: [
            { prompt: "Question 5: The participant with whom you are paired will be determined randomly.", 
                name: 'Q5', 
                options: question_choice_5_options, required: true },
        ],
        preamble: `<div> 
<br><br/>
Please answer the following question. </div>
<br><br/>`,
        on_finish: function (data) {
            questions_choice_data.push(data);
            let response = data.response.Q5;
            if (response && response.includes("TRUE")) {
                data.correct = true; 
            } else {
                data.correct = false;
            }
        }
    };

    var control_question_choice_5_response = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function () {
            feedback_question_choice_5 = jsPsych.data.get().last(1).values()[0].correct;
            if (feedback_question_choice_5) {
                return `
<div>Your answer was <font size=120%; font color = 'green';> correct </font>!</div>
<br><br/> 
When you are ready, press the  <b>SPACE BAR</b> to continue. 
<br><br/> </div>
`;
            } else {
                return `
<div>Your answer was <font size=120%; font color = 'red';> incorrect </font>!</div>
<br><br/> 
<div>Question 5: The participant with whom you are paired will be determined randomly.</div>
<br><br/>
TRUE <br>
FALSE <br>
<br><br/>
The correct answer is: <font color = 'green';> TRUE </font>.
<br><br/>
For each decision, you are paired randomly with another participant in the study.
<br><br/>
Therefore, the correct answer is <font color = 'green';> TRUE </font>. 
<br><br/>
When you are ready, press the  <b>SPACE BAR</b> to continue. 
<br><br/> 
</div>`
            }
        },
        post_trial_gap: 500,
        choices: [" "],
    }

    // question 6
    var control_question_choice_6 = {
        type: jsPsychSurveyMultiChoice,
        questions: [
            { prompt: "Question 6: When you make your choice, you will be able to see what the COLUMN CHOOSER has chosen.", 
                name: 'Q6', 
                options: question_choice_6_options, required: true },
        ],
        preamble: `<div> 
<br><br/>
Please answer the following question. </div>
<br><br/>`,
        on_finish: function (data) {
            questions_choice_data.push(data);
            let response = data.response.Q6;
            if (response && response.includes("FALSE")) {
                data.correct = true; 
            } else {
                data.correct = false;
            }
            //console.log("Choice Quiz Data:", questions_choice_data);
        }
    };

    var control_question_choice_6_response = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function () {
            feedback_question_choice_6 = jsPsych.data.get().last(1).values()[0].correct;
            if (feedback_question_choice_6) {
                return `
<div>Your answer was <font size=120%; font color = 'green';> correct </font>!</div>
<br><br/> 
When you are ready, press the  <b>SPACE BAR</b> to continue. 
<br><br/> </div>
`;
            } else {
                return `
<div>Your answer was <font size=120%; font color = 'red';> incorrect </font>!</div>
<br><br/> 
<div>Question 6: When you make your choice, you will be able to see what the COLUMN CHOOSER has chosen.</div>
<br><br/>
TRUE <br>
FALSE <br>
<br><br/>
The correct answer is: <font color = 'green';> FALSE </font>.
<br><br/>
You will not be able to see what the COLUMN CHOOSER did before you make your decision.
<br><br/>
Therefore, the correct answer is <font color = 'green';> FALSE </font>. 
<br><br/>
When you are ready, press the  <b>SPACE BAR</b> to continue. 
<br><br/> 
</div>`
            }
        },
        post_trial_gap: 500,
        choices: [" "],
        on_finish: function (data) {
            document.body.style.cursor = 'none';
            nCorrectChoice = getAnswersChoiceQuiz(questions_choice_data);
            if (nCorrectChoice < 4) {
                should_be_in_fullscreen = false;
                survey_code = makeSurveyCode('failed_quiz_game');
                closeFullscreen();
                jsPsych.endExperiment(`We are sorry! Unfortunately, you have answered only ${nCorrectChoice} questions correctly.</br> 
<br><br/>
Please RETURN YOUR SUBMISSION by closing the survey and clicking <span style="color:cyan;">'Stop Without Completing'</span> on Prolific.<br/>
<br><br/>
Thank you for signing up!`);
                passed_quiz_1 = 0;
            }
        }

    }



    // quiz about the belief task
    var question_belief_1_options = ["$10",
        "$8",
        "$6",
        "$4"];
    var question_belief_2_options = ["TRUE",
        "FALSE"];
    var question_belief_3_options = ["TRUE",
        "FALSE"];


    var questions_belief_data = [];

    var feedback_question_belief_1 = [];
    var feedback_question_belief_2 = [];
    var feedback_question_belief_3 = [];

    var passed_quiz_2 = 1;

    // question 1
    var control_question_belief_1 = {
        type: jsPsychSurveyMultiChoice,
        questions: [
            { prompt: "Question 1: Suppose you estimate that 58% of the other participants selected column L in this round. What will you earn if this decision is selected for payment?", 
                name: 'Q1', 
                options: question_belief_1_options, 
                required: true },
        ],
        preamble: `<div> 
<br><br/>
Please answer the following question. </div>
<div>Consider the following table.</div>
</div>
<br><br/>
<img class = 'img_questions' src="img/control/control_img_2.png"></img>
<br><br/>
<div>Suppose that 80% of the participants in the study selected action L in the table above.</div>
<br><br/>
<div>Recall that you lose $0.50 for every 5% away you are from the correct answer.</div>
<div>If you are within 5% of the correct answer, you earn $10.</div>
<br><br/>`,
        on_finish: function (data) {
            questions_belief_data.push(data);
            // Access the specific response for the question
            let response = data.response.Q1;
            // Check if the response includes "200"
            if (response && response.includes("$8")) {
                data.correct = true; // Add the correct property
            } else {
                data.correct = false;
            }
        }
    };

    var control_question_belief_1_response = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function () {
            feedback_question_belief_1 = jsPsych.data.get().last(1).values()[0].correct;
            if (feedback_question_belief_1) {
                return `
<div>Your answer was <font size=120%; font color = 'green';> correct </font>!</div>
<br><br/> 
When you are ready, press the  <b>SPACE BAR</b> to continue. 
<br><br/> </div>
`;
            } else {
                return `
<div>Your answer was <font size=120%; font color = 'red';> incorrect </font>!</div>
<br><br/> 
<div>Question 1: Suppose you estimate that 58% of the other participants selected column L in this round. What will you earn if this decision is selected for payment?</div>
<br><br/> 
<br><br/>
<img class = 'img_questions' src="img/control/control_img_2.png"></img>
<br><br/>
<div>Recall that you lose $0.50 for every 5% away you are from the correct answer.</div>
<div>If you are within 5% of the correct answer, you earn $10.</div>
<br><br/>
$10 <br>
$8 <br>
$6 <br>
$4 <br>
<br><br/>
The correct answer is: <font color = 'green';> $8 </font>.
<br><br/>
The error in your estimate is |80% - 58%| = 22%.
<br><br/>
Therefore, you earn $10 - $2 = <font color = 'green';> $8 </font>. 
<br><br/>
When you are ready, press the  <b>SPACE BAR</b> to continue. 
<br><br/> 
</div>`
            }
        },
        post_trial_gap: 500,
        choices: [" "],
    }


    // question 2
    var control_question_belief_2 = {
        type: jsPsychSurveyMultiChoice,
        questions: [
            { prompt: "Question 2: The closer your estimate is to the true answer the more you earn.", 
                name: 'Q2', 
                options: question_belief_2_options, required: true },
        ],
        preamble: `<div> 
<br><br/>
Please answer the following question. </div>
<br><br/>`,
        on_finish: function (data) {
            questions_belief_data.push(data);
            let response = data.response.Q2;
            if (response && response.includes("TRUE")) {
                data.correct = true; 
            } else {
                data.correct = false;
            }
        }
    };

    var control_question_belief_2_response = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function () {
            feedback_question_belief_2 = jsPsych.data.get().last(1).values()[0].correct;
            if (feedback_question_belief_2) {
                return `
<div>Your answer was <font size=120%; font color = 'green';> correct </font>!</div>
<br><br/> 
When you are ready, press the  <b>SPACE BAR</b> to continue. 
<br><br/> </div>
`;
            } else {
                return `
<div>Your answer was <font size=120%; font color = 'red';> incorrect </font>!</div>
<br><br/> 
<div>Question 2: The closer your estimate is to the true answer the more you earn.</div>
<br><br/> 
The correct answer is: <font color = 'green';> TRUE </font>.
<br><br/>
When you are ready, press the  <b>SPACE BAR</b> to continue. 
<br><br/> 
</div>`
            }
        },
        post_trial_gap: 500,
        choices: [" "],
    }


    // question 3
    var control_question_belief_3 = {
        type: jsPsychSurveyMultiChoice,
        questions: [
            { prompt: "Question 3: You will receive your payment for this part of the experiment immediately.", 
                name: 'Q3', 
                options: question_belief_3_options, 
                required: true },
        ],
        preamble: `<div> 
<br><br/>
Please answer the following question. </div>
</div>
<br><br/>`,
        on_finish: function (data) {
            questions_belief_data.push(data);
            let response = data.response.Q3;
            if (response && response.includes("FALSE")) {
                data.correct = true; 
            } else {
                data.correct = false;
            }
            //console.log("Belief Quiz Data:", questions_belief_data);
        }
    };

    var control_question_belief_3_response = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function () {
            feedback_question_belief_3 = jsPsych.data.get().last(1).values()[0].correct;
            if (feedback_question_belief_3) {
                return `
<div>Your answer was <font size=120%; font color = 'green';> correct </font>!</div>
<br><br/> 
When you are ready, press the  <b>SPACE BAR</b> to continue. 
<br><br/> </div>
`;
            } else {
                return `
<div>Your answer was <font size=120%; font color = 'red';> incorrect </font>!</div>
<br><br/> 
<div>Question 3: You will receive your payment for this part of the experiment immediately.</div>
<br><br/> 
The correct answer is: <font color = 'green';> FALSE </font>.
<br><br/>
We will send you the payment within 1 or 2 weeks.
<br><br/>
Therefore, the correct answer is <font color = 'green';> FALSE </font>. 
<br><br/>
When you are ready, press the  <b>SPACE BAR</b> to continue. 
<br><br/> 
</div>`
            }
        },
        post_trial_gap: 500,
        choices: [" "],
        on_finish: function (data) {
            document.body.style.cursor = 'none';
            nCorrectBelief = getAnswersBeliefQuiz(questions_belief_data);
            if (nCorrectBelief < 2) {
                should_be_in_fullscreen = false;
                survey_code = makeSurveyCode('failed_quiz_belief');
                closeFullscreen();
                jsPsych.endExperiment(`We are sorry! Unfortunately, you have answered only ${nCorrectBelief} questions correctly.  </br> 
You will receive  ${payFailQuiz2} for making it this far. </br>
<br><br/>
Your completion code is <span style="color:cyan;">xxxxx</span>.<br/>
Make sure you copy this code in order to get paid!
<br><br/>
Thank you for signing up!`);
                passed_quiz_2 = 0;
            }
        }
    }



    // choice game without rt
    let choice_data = [];
    let choice_count = 0;

    var game_choice = {
        timeline: [
            fixation,
            {
                type: jsPsychGameChoiceKeyboardResponse,
                stimulus: () => shuffledGameChoiceWithoutRT.getGameMatrix(choice_count, randDisplayOrderChoice, "y"),
                choices: ["ArrowUp", "ArrowDown"],
                stimulus_order: () => randomOrderChoiceWithoutRT[choice_count],
                stimulus_display: () => randDisplayOrderChoice[choice_count],
                stimulus_r: () => shuffledGameChoiceWithoutRT.r_y[choice_count],
                stimulus_type_game: () => shuffledGameChoiceWithoutRT.type_game_y[choice_count],
                stimulus_eu: () => shuffledGameChoiceWithoutRT.eu_y[choice_count],
                stimulus_n_game: () => shuffledGameChoiceWithoutRT.n_game_y[choice_count],
                stimulus_n_game_r: () => shuffledGameChoiceWithoutRT.n_game_r_y[choice_count],
                on_finish: (data) => {
                    choice_data.push(data);
                    choice_count++;
                    // testing
                     console.log("Current choice_data:", choice_data);
                },
            },
        ],
        loop_function: () => choice_count < 5,
    };



    // choice of player given RT
    var choice_player_data = [];
    var choice_player_count = 0;

    // choice of action for player with RT
    var choice_rt_player_1_data = [];
    var choice_rt_player_1_count = 0;
    var choice_rt_player_2_data = [];
    var choice_rt_player_2_count = 0;


    var game_player_choice = {
        timeline: [
            fixation,
            // rt of player 1 and player 2 in previous game
            {
                type: jsPsychGameChoicePlayerHTMLButtonResponse,
                stimulus: () =>
                    shuffledGameChoiceWithRT.getGameMatrix(choice_player_count, randDisplayOrderChoice, "x"),
                choices: ["Player 1", "Player 2"], // from plugin
                stimulus_order: () => randomOrderChoiceWithRT[choice_player_count],
                stimulus_display: () => randDisplayOrderChoice[choice_player_count],
                stimulus_r: () => shuffledGameChoiceWithRT.r_x[choice_player_count],
                stimulus_type_game: () => shuffledGameChoiceWithRT.type_game_x[choice_player_count],
                stimulus_eu: () => shuffledGameChoiceWithRT.eu_x[choice_player_count],
                stimulus_n_game: () => shuffledGameChoiceWithRT.n_game_x[choice_player_count],
                stimulus_n_game_r: () => shuffledGameChoiceWithRT.n_game_r_x[choice_player_count],
                player_1_action: () => shuffledGameChoiceWithRT.player_1_chosen_mapped[choice_player_count],
                player_2_action: () => shuffledGameChoiceWithRT.player_2_chosen_mapped[choice_player_count],
                player_1_rt_q: () => shuffledGameChoiceWithRT.rt_q_1[choice_player_count],
                player_2_rt_q: () => shuffledGameChoiceWithRT.rt_q_2[choice_player_count],
                player_1_rt: () => shuffledGameChoiceWithRT.rt_obs_1[choice_player_count],
                player_2_rt: () => shuffledGameChoiceWithRT.rt_obs_2[choice_player_count],
                subject_1: () => shuffledGameChoiceWithRT.subject_1[choice_player_count],
                subject_2: () => shuffledGameChoiceWithRT.subject_2[choice_player_count],
                prompt: "Which player do you choose to play with next?",
                response_ends_trial: true,
                on_finish: (data) => {
                    choice_player_data.push(data);
                    choice_player_count++;
                    // testing
                    console.log("Current player_choice_data:", choice_player_data);
                },
            },
            fixation,
            // action for player 1 in the next game
            {
                type: jsPsychGameChoiceRTKeyboardResponse,
                stimulus: () =>
                    shuffledGameChoiceWithRT.getGameMatrix(choice_rt_player_1_count, randDisplayOrderChoice, "y"),
                choices: ["ArrowUp", "ArrowDown"],
                stimulus_order: () => randomOrderChoiceWithRT[choice_rt_player_1_count],
                stimulus_display: () => randDisplayOrderChoice[choice_rt_player_1_count],
                stimulus_r: () => shuffledGameChoiceWithRT.r_y[choice_rt_player_1_count],
                stimulus_type_game: () => shuffledGameChoiceWithRT.type_game_y[choice_rt_player_1_count],
                stimulus_eu: () => shuffledGameChoiceWithRT.eu_y[choice_rt_player_1_count],
                stimulus_n_game: () => shuffledGameChoiceWithRT.n_game_y[choice_rt_player_1_count],
                stimulus_n_game_r: () => shuffledGameChoiceWithRT.n_game_r_y[choice_rt_player_1_count],
                player_number: 1,
                player_action: () => shuffledGameChoiceWithRT.player_1_chosen_mapped[choice_rt_player_1_count],
                player_rt: () => shuffledGameChoiceWithRT.rt_obs_1[choice_rt_player_1_count],
                player_rt_q: () => shuffledGameChoiceWithRT.rt_q_1[choice_rt_player_1_count],
                subject: () => shuffledGameChoiceWithRT.subject_1[choice_rt_player_1_count],
                on_finish: (data) => {
                    choice_rt_player_1_data.push(data);
                    choice_rt_player_1_count++;
                    // testing
                    console.log("Current choice_rt_data player 1:", choice_rt_player_1_data);
                },
            },
            fixation,
            // action for player 2 in the next game
            {
                type: jsPsychGameChoiceRTKeyboardResponse,
                stimulus: () =>
                    shuffledGameChoiceWithRT.getGameMatrix(choice_rt_player_2_count, randDisplayOrderChoice, "y"),
                choices: ["ArrowUp", "ArrowDown"],
                stimulus_order: () => randomOrderChoiceWithRT[choice_rt_player_2_count],
                stimulus_display: () => randDisplayOrderChoice[choice_rt_player_2_count],
                stimulus_r: () => shuffledGameChoiceWithRT.r_y[choice_rt_player_2_count],
                stimulus_type_game: () => shuffledGameChoiceWithRT.type_game_y[choice_rt_player_2_count],
                stimulus_eu: () => shuffledGameChoiceWithRT.eu_y[choice_rt_player_2_count],
                stimulus_n_game: () => shuffledGameChoiceWithRT.n_game_y[choice_rt_player_2_count],
                stimulus_n_game_r: () => shuffledGameChoiceWithRT.n_game_r_y[choice_rt_player_2_count],
                player_number: 2,
                player_action: () => shuffledGameChoiceWithRT.player_2_chosen_mapped[choice_rt_player_2_count],
                player_rt: () => shuffledGameChoiceWithRT.rt_obs_2[choice_rt_player_2_count],
                player_rt_q: () => shuffledGameChoiceWithRT.rt_q_2[choice_rt_player_2_count],
                subject: () => shuffledGameChoiceWithRT.subject_2[choice_rt_player_2_count],
                on_finish: (data) => {
                    choice_rt_player_2_data.push(data);
                    choice_rt_player_2_count++;
                    // testing
                    console.log("Current choice_rt_data player 2:", choice_rt_player_2_data);
                },
            }
        ],
        loop_function: () => choice_player_count < 5 //shuffledGameChoiceWithRT.r_y.length
    };


    // belief elicitation without rt
    var belief_data = [];
    var belief_count = 0;

    var game_belief = {
        timeline: [
            fixation,
            {
                type: jsPsychGameBeliefTableSliderResponse,
                stimulus: () =>
                    shuffledGameBeliefWithoutRT.getGameMatrix(belief_count, randDisplayOrderBelief, "y"), // Use new object
                labels: ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'],
                stimulus_order: () => randomOrderBeliefWithoutRT[belief_count], // New shuffle order
                stimulus_display: () => randDisplayOrderBelief[belief_count], // New display order
                stimulus_r: () => shuffledGameBeliefWithoutRT.r_y[belief_count],
                stimulus_type_game: () => shuffledGameBeliefWithoutRT.type_game_y[belief_count],
                stimulus_eu: () => shuffledGameBeliefWithoutRT.eu_y[belief_count],
                stimulus_n_game: () => shuffledGameBeliefWithoutRT.n_game_y[belief_count],
                stimulus_n_game_r: () => shuffledGameBeliefWithoutRT.n_game_r_y[belief_count],
                min: 0,
                max: 100,
                prompt: "What percentage of participants choose action <span style='color: #0080ff; font-size: 1.2em; font-weight: bold;'>L</span>?",
                require_movement: true,
                start: () => getRandomInt(0, 100),
                response_ends_trial: true,
                on_finish: (data) => {
                    belief_data.push(data);
                    belief_count++;
                    // testing
                    console.log("Current belief_data:", belief_data);
                },
            },
        ],
        loop_function: () => belief_count < 5 //shuffledGameBeliefWithoutRT.r_y.length
    };


    // belief elicitation for player with rt
    var belief_rt_display_player_1_data = [];
    var belief_rt_display_player_1_count = 0;
    var belief_rt_display_player_2_data = [];
    var belief_rt_display_player_2_count = 0;

    var belief_rt_player_1_data = [];
    var belief_rt_player_1_count = 0;
    var belief_rt_player_2_data = [];
    var belief_rt_player_2_count = 0;

    // problem: belief count updated by 2 each time, once for each player - might cause issues
    // consider making different data set for player 1 and player 2 
    // this problem also applies with choice with rt above

    var game_belief_rt = {
        timeline: [
            fixation,
            // show what the player 1 did in the previous game
            {
                type: jsPsychGameBeliefPlayerRTTableDisplay,
                stimulus: () =>
                    shuffledGameBeliefWithRT.getGameMatrix(belief_rt_display_player_1_count, randDisplayOrderBelief, "x"), // Use updated reshuffled object
                choices: [" "],
                stimulus_order: () => randomOrderBeliefWithRT[belief_rt_display_player_1_count],
                stimulus_display: () => randDisplayOrderBelief[belief_rt_display_player_1_count],
                stimulus_r: () => shuffledGameBeliefWithRT.r_x[belief_rt_display_player_1_count],
                stimulus_type_game: () => shuffledGameBeliefWithRT.type_game_x[belief_rt_display_player_1_count],
                stimulus_eu: () => shuffledGameBeliefWithRT.eu_x[belief_rt_display_player_1_count],
                stimulus_n_game: () => shuffledGameBeliefWithRT.n_game_x[belief_rt_display_player_1_count],
                stimulus_n_game_r: () => shuffledGameBeliefWithRT.n_game_r_x[belief_rt_display_player_1_count],
                player_number: 1,
                player_action: () => shuffledGameBeliefWithRT.player_1_chosen_mapped[belief_rt_display_player_1_count],
                player_rt: () => shuffledGameBeliefWithRT.rt_obs_1[belief_rt_display_player_1_count],
                player_rt_q: () => shuffledGameBeliefWithRT.rt_q_1[belief_rt_display_player_1_count],
                subject: () => shuffledGameBeliefWithRT.subject_1[belief_rt_display_player_1_count],
                on_finish: (data) => {
                    belief_rt_display_player_1_data.push(data);
                    belief_rt_display_player_1_count++;
                    // testing
                    console.log("Current belief_rt_display_player_1_data:", belief_rt_display_player_1_data);
                },
            },
            fixation,
            // elicit belief for the player 1 in the new game
            {
                type: jsPsychGameBeliefRTTableSliderResponse,
                stimulus: () =>
                    shuffledGameBeliefWithRT.getGameMatrix(belief_rt_player_1_count, randDisplayOrderBelief, "y"),
                labels: ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'],
                stimulus_order: () => randomOrderBeliefWithRT[belief_rt_player_1_count],
                stimulus_display: () => randDisplayOrderBelief[belief_rt_player_1_count],
                stimulus_r: () => shuffledGameBeliefWithRT.r_y[belief_rt_player_1_count],
                stimulus_type_game: () => shuffledGameBeliefWithRT.type_game_y[belief_rt_player_1_count],
                stimulus_eu: () => shuffledGameBeliefWithRT.eu_y[belief_rt_player_1_count],
                stimulus_n_game: () => shuffledGameBeliefWithRT.n_game_y[belief_rt_player_1_count],
                stimulus_n_game_r: () => shuffledGameBeliefWithRT.n_game_r_y[belief_rt_player_1_count],
                player_number: 1,
                player_action: () => shuffledGameBeliefWithRT.player_1_chosen_mapped[belief_rt_player_1_count],
                player_rt: () => shuffledGameBeliefWithRT.rt_obs_1[belief_rt_player_1_count],
                player_rt_q: () => shuffledGameBeliefWithRT.rt_q_1[belief_rt_player_1_count],
                subject: () => shuffledGameBeliefWithRT.subject_1[belief_rt_player_1_count],
                min: 0,
                max: 100,
                prompt: "How likely is it that the player chose action <span style='color: #0080ff; font-size: 1.2em; font-weight: bold;'>L</span>?",
                require_movement: true,
                start: () => getRandomInt(0, 100),
                response_ends_trial: true,
                on_finish: (data) => {
                    belief_rt_player_1_data.push(data);
                    belief_rt_player_1_count++;
                    // testing
                    console.log("Current belief_rt_player_1_data:", belief_rt_player_1_data);
                },
            },
            fixation,
            // show what the player 2 did in the previous game
            {
                type: jsPsychGameBeliefPlayerRTTableDisplay,
                stimulus: () =>
                    shuffledGameBeliefWithRT.getGameMatrix(belief_rt_display_player_2_count, randDisplayOrderBelief, "x"), // Use updated reshuffled object
                choices: [" "],
                stimulus_order: () => randomOrderBeliefWithRT[belief_rt_display_player_2_count],
                stimulus_display: () => randDisplayOrderBelief[belief_rt_display_player_2_count],
                stimulus_r: () => shuffledGameBeliefWithRT.r_x[belief_rt_display_player_2_count],
                stimulus_type_game: () => shuffledGameBeliefWithRT.type_game_x[belief_rt_display_player_2_count],
                stimulus_eu: () => shuffledGameBeliefWithRT.eu_x[belief_rt_display_player_2_count],
                stimulus_n_game: () => shuffledGameBeliefWithRT.n_game_x[belief_rt_display_player_2_count],
                stimulus_n_game_r: () => shuffledGameBeliefWithRT.n_game_r_x[belief_rt_display_player_2_count],
                player_number: 2,
                player_action: () => shuffledGameBeliefWithRT.player_2_chosen_mapped[belief_rt_display_player_2_count],
                player_rt: () => shuffledGameBeliefWithRT.rt_obs_2[belief_rt_display_player_2_count],
                player_rt_q: () => shuffledGameBeliefWithRT.rt_q_2[belief_rt_display_player_2_count],
                subject: () => shuffledGameBeliefWithRT.subject_2[belief_rt_display_player_2_count],
                on_finish: (data) => {
                    belief_rt_display_player_2_data.push(data);
                    belief_rt_display_player_2_count++;
                    // testing
                    console.log("Current belief_rt_display_player_2_data:", belief_rt_display_player_2_data);
                },
            },
            fixation,
            // elicit belief for the player 2 in the new game
            {
                type: jsPsychGameBeliefRTTableSliderResponse,
                stimulus: () =>
                    shuffledGameBeliefWithRT.getGameMatrix(belief_rt_player_2_count, randDisplayOrderBelief, "y"),
                labels: ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'],
                stimulus_order: () => randomOrderBeliefWithRT[belief_rt_player_2_count],
                stimulus_display: () => randDisplayOrderBelief[belief_rt_player_2_count],
                stimulus_r: () => shuffledGameBeliefWithRT.r_y[belief_rt_player_2_count],
                stimulus_type_game: () => shuffledGameBeliefWithRT.type_game_y[belief_rt_player_2_count],
                stimulus_eu: () => shuffledGameBeliefWithRT.eu_y[belief_rt_player_2_count],
                stimulus_n_game: () => shuffledGameBeliefWithRT.n_game_y[belief_rt_player_2_count],
                stimulus_n_game_r: () => shuffledGameBeliefWithRT.n_game_r_y[belief_rt_player_2_count],
                player_number: 2,
                player_action: () => shuffledGameBeliefWithRT.player_1_chosen_mapped[belief_rt_player_2_count],
                player_rt: () => shuffledGameBeliefWithRT.rt_obs_1[belief_rt_player_2_count],
                player_rt_q: () => shuffledGameBeliefWithRT.rt_q_1[belief_rt_player_2_count],
                subject: () => shuffledGameBeliefWithRT.subject_1[belief_rt_player_2_count],
                min: 0,
                max: 100,
                prompt: "How likely is it that the player chose action <span style='color: #0080ff; font-size: 1.2em; font-weight: bold;'>L</span>?",
                require_movement: true,
                start: () => getRandomInt(0, 100),
                response_ends_trial: true,
                on_finish: (data) => {
                    belief_rt_player_2_data.push(data);
                    belief_rt_player_2_count++;
                    // testing
                    console.log("Current belief_rt_player_2_data:", belief_rt_player_2_data);
                },
            },
        ],
        loop_function: () => belief_rt_player_1_count < 5// shuffledGameBeliefWithRT.r_y.length
    };


    var fullscreen_exit = {
        type: jsPsychCallFunction,
        func: () => { 
          should_be_in_fullscreen = false; // once this trial starts, the participant is no longer required to stay in fullscreen
        }
    };
    



    // Run the experiment
    jsPsych.run([
        preload,
        // fullscreen_enter,
        experiment_overview,
        choice_instructions,
        // control_question_choice_1,
        // control_question_choice_1_response,
        // control_question_choice_2,
        // control_question_choice_2_response,
        // control_question_choice_3,
        // control_question_choice_3_response,
        // control_question_choice_4,
        // control_question_choice_4_response,
        // control_question_choice_5,
        // control_question_choice_5_response,
        // control_question_choice_6,
        // control_question_choice_6_response,
        choice_overview,
        game_choice,
        choice_rt_instructions,
        choice_rt_overview,
        game_player_choice, 
        // break_time,
        belief_instructions,
        // control_question_belief_1,
        // control_question_belief_1_response,
        // control_question_belief_2,
        // control_question_belief_2_response,
        // control_question_belief_3,
        // control_question_belief_3_response,
        belief_overview,
        game_belief,
        belief_rt_instructions,
        belief_rt_overview,
        game_belief_rt
        // fullscreen_exit,
        // success_guard
    ]);


}
