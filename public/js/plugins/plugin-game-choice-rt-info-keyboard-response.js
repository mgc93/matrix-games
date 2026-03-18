var jsPsychGameChoiceRTInfoKeyboardResponse = (function(jsPsych) {
  "use strict";

  const info = {
    name: "game-choice-rt-info-keyboard-response",
    version: "1.0.0",
    parameters: {
      // --- Right panel: new game (y) ---
      stimulus: {
        type: jsPsych.ParameterType.HTML_STRING,
        default: undefined,
        description: "The new game matrix (y) to be displayed on the right."
      },
      choices: {
        type: jsPsych.ParameterType.KEYS,
        default: ["ArrowUp", "ArrowDown"],
        description: "The keys the subject is allowed to press."
      },
      player_number: {
        type: jsPsych.ParameterType.INT,
        default: 1,
        description: "The player number shown on the right panel."
      },
      player_action: {
        type: jsPsych.ParameterType.STRING,
        default: "L",
        description: "Action chosen by the current player."
      },
      player_rt: {
        type: jsPsych.ParameterType.FLOAT,
        default: 3.0,
        description: "RT of the current player."
      },
      player_rt_q: {
        type: jsPsych.ParameterType.FLOAT,
        default: 3.0,
        description: "RT quantile of the current player."
      },
      subject: {
        type: jsPsych.ParameterType.FLOAT,
        default: null,
        description: "Subject ID of the current player."
      },
      timing_response: {
        type: jsPsych.ParameterType.INT,
        default: 0,
        description: "Maximum time to respond."
      },
      stimulus_duration: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Display time of stimulus, regardless of when choice is made."
      },
      stimulus_order: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "New game matrix number."
      },
      stimulus_display: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Display type of the new game matrix."
      },
      stimulus_r: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Riskiness parameter of the new game."
      },
      stimulus_type_game: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Mean riskiness parameter of the new game."
      },
      stimulus_eu: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Expected utility of the new game."
      },
      stimulus_n_game: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Original game number (new game)."
      },
      stimulus_n_game_r: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Original game number within riskiness level (new game)."
      },
      // --- Left panel: previous game (x) ---
      prev_stimulus: {
        type: jsPsych.ParameterType.HTML_STRING,
        default: undefined,
        description: "The previous game matrix (x) to be displayed on the left."
      },
      prev_stimulus_order: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Previous game matrix number."
      },
      prev_stimulus_display: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Display type of the previous game matrix."
      },
      prev_stimulus_r: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Riskiness parameter of the previous game."
      },
      prev_stimulus_type_game: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Mean riskiness parameter of the previous game."
      },
      prev_stimulus_eu: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Expected utility of the previous game."
      },
      prev_stimulus_n_game: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Original game number (previous game)."
      },
      prev_stimulus_n_game_r: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Original game number within riskiness level (previous game)."
      },
      // --- Both players' data (saved regardless of which player is shown) ---
      player_1_action: {
        type: jsPsych.ParameterType.STRING,
        default: null,
        description: "Action taken by Player 1."
      },
      player_2_action: {
        type: jsPsych.ParameterType.STRING,
        default: null,
        description: "Action taken by Player 2."
      },
      player_1_rt: {
        type: jsPsych.ParameterType.FLOAT,
        default: null,
        description: "RT for Player 1."
      },
      player_2_rt: {
        type: jsPsych.ParameterType.FLOAT,
        default: null,
        description: "RT for Player 2."
      },
      player_1_rt_q: {
        type: jsPsych.ParameterType.FLOAT,
        default: null,
        description: "RT quantile for Player 1."
      },
      player_2_rt_q: {
        type: jsPsych.ParameterType.FLOAT,
        default: null,
        description: "RT quantile for Player 2."
      },
      subject_1: {
        type: jsPsych.ParameterType.FLOAT,
        default: null,
        description: "Subject ID for Player 1."
      },
      subject_2: {
        type: jsPsych.ParameterType.FLOAT,
        default: null,
        description: "Subject ID for Player 2."
      }
    },
    data: {
      stimulus: { type: jsPsych.ParameterType.HTML_STRING },
      prev_stimulus: { type: jsPsych.ParameterType.HTML_STRING },
      rt: { type: jsPsych.ParameterType.INT },
      key_press: { type: jsPsych.ParameterType.KEYS }
    }
  };

  /**
   * **game-choice-rt-info-keyboard-response**
   *
   * Split-screen plugin: left panel shows the previous game (read-only) with
   * the current player's RT info; right panel shows the new game with a
   * keyboard response prompt.
   *
   * @version 1.0.0
   */
  class GameChoiceRTInfoKeyboardResponsePlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }

    static info = info;

    trial(display_element, trial) {
      let response = {
        rt: null,
        key: null
      };

      const setTimeoutHandlers = [];
      let keyboardListener;

      const killTimers = () => {
        setTimeoutHandlers.forEach((timer) => clearTimeout(timer));
      };

      const killListeners = () => {
        if (keyboardListener) {
          this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
        }
      };

      const buildTable = (payoffs, prefix) => {
        let html = "";
        html += `<table class="t${prefix}">`;
        html += `<tbody>`;
        html += `<tr>`;
        html += `<td class="t${prefix}-0lax-other"></td>`;
        html += `<td class="t${prefix}-baqh-other" colspan="2"><div class="action-other" id="${prefix}-action-other-left">L</div></td>`;
        html += `<td class="t${prefix}-baqh-other" colspan="2"><div class="action-other" id="${prefix}-action-other-right">R</div></td>`;
        html += `</tr>`;
        html += `<tr class="row-1">`;
        html += `<td class="t${prefix}-column" rowspan="2"><div class="action-self" id="${prefix}-action-self-top">T</div></td>`;
        html += `<td class="t${prefix}-0lax-top"></td>`;
        html += `<td class="t${prefix}-viqs"><div class="points-other" id="${prefix}-points-top-other-left">${payoffs[1]}</div></td>`;
        html += `<td class="t${prefix}-0lax-top"></td>`;
        html += `<td class="t${prefix}-viqs"><div class="points-other" id="${prefix}-points-top-other-right">${payoffs[3]}</div></td>`;
        html += `</tr>`;
        html += `<tr class="row-2">`;
        html += `<td class="t${prefix}-ti2t"><div class="points-self" id="${prefix}-points-top-self-left">${payoffs[0]}</div></td>`;
        html += `<td class="t${prefix}-0lax"></td>`;
        html += `<td class="t${prefix}-ti2t"><div class="points-self" id="${prefix}-points-top-self-right">${payoffs[2]}</div></td>`;
        html += `<td class="t${prefix}-0lax"></td>`;
        html += `</tr>`;
        html += `<tr class="row-3">`;
        html += `<td class="t${prefix}-column" rowspan="2"><div class="action-self" id="${prefix}-action-self-bottom">B</div></td>`;
        html += `<td class="t${prefix}-0lax-top"></td>`;
        html += `<td class="t${prefix}-viqs"><div class="points-other" id="${prefix}-points-bottom-other-left">${payoffs[5]}</div></td>`;
        html += `<td class="t${prefix}-0lax-top"></td>`;
        html += `<td class="t${prefix}-viqs"><div class="points-other" id="${prefix}-points-bottom-other-right">${payoffs[7]}</div></td>`;
        html += `</tr>`;
        html += `<tr class="row-4">`;
        html += `<td class="t${prefix}-ti2t"><div class="points-self" id="${prefix}-points-bottom-self-left">${payoffs[4]}</div></td>`;
        html += `<td class="t${prefix}-0lax"></td>`;
        html += `<td class="t${prefix}-ti2t"><div class="points-self" id="${prefix}-points-bottom-self-right">${payoffs[6]}</div></td>`;
        html += `<td class="t${prefix}-0lax"></td>`;
        html += `</tr>`;
        html += `</tbody>`;
        html += `</table>`;
        return html;
      };

      const displayStage = () => {
        display_element.innerHTML = "";
        let new_html = "";

        new_html += '<div class="container-choice-rt-info">';

        // --- Left panel: previous game (read-only) ---
        new_html += '<div class="panel-choice-rt-info panel-prev" id="prev-game-panel">';
        new_html += buildTable(trial.prev_stimulus, "prev");
        new_html += `<div class="info-text-choice-rt-info">
          Player ${trial.player_number} chose action <span class="highlight-action">${trial.player_action}</span> in <span class="highlight-rt">${trial.player_rt.toFixed(1)}</span> seconds.
        </div>`;
        new_html += '</div>';

        // --- Vertical divider ---
        new_html += '<div class="divider-choice-rt-info"></div>';

        // --- Right panel: new game (interactive) ---
        new_html += '<div class="panel-choice-rt-info panel-next" id="new-game-panel">';
        new_html += buildTable(trial.stimulus, "next");
        new_html += `<div class="info-text-choice-rt-info">
          What do you want to choose given that you are interacting with Player ${trial.player_number}?
        </div>`;
        new_html += '</div>';

        new_html += '</div>'; // close container

        display_element.innerHTML = new_html;
      };

      const startResponseListener = () => {
        if (trial.choices != "NO_KEYS") {
          keyboardListener = this.jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: (info) => {
              killListeners();
              killTimers();
              response = info;
              displaySelection();
              this.jsPsych.pluginAPI.setTimeout(
                () => endTrial(false),
                trial.stimulus_duration ? trial.stimulus_duration - response.rt : 500
              );
            },
            valid_responses: trial.choices,
            rt_method: "performance",
            persist: false,
            allow_held_key: false
          });
        }
      };

      const displaySelection = () => {
        const panel = display_element.querySelector("#new-game-panel");
        if (response.key === trial.choices[0]) {
          panel.querySelector(".row-1").className += "-responded";
          panel.querySelector(".row-2").className += "-responded";
        } else if (response.key === trial.choices[1]) {
          panel.querySelector(".row-3").className += "-responded";
          panel.querySelector(".row-4").className += "-responded";
        }
      };

      const endTrial = (timeout) => {
        const trial_data = {
          // new game (right panel)
          stimulus: trial.stimulus,
          top_stimulus: trial.stimulus.slice(0, 4),
          bottom_stimulus: trial.stimulus.slice(4),
          game_number: trial.stimulus_order,
          display_order: trial.stimulus_display,
          game_r: trial.stimulus_r,
          game_type: trial.stimulus_type_game,
          game_eu: trial.stimulus_eu,
          n_game: trial.stimulus_n_game,
          n_game_r: trial.stimulus_n_game_r,
          // previous game (left panel)
          prev_stimulus: trial.prev_stimulus,
          prev_top_stimulus: trial.prev_stimulus.slice(0, 4),
          prev_bottom_stimulus: trial.prev_stimulus.slice(4),
          prev_game_number: trial.prev_stimulus_order,
          prev_display_order: trial.prev_stimulus_display,
          prev_game_r: trial.prev_stimulus_r,
          prev_game_type: trial.prev_stimulus_type_game,
          prev_game_eu: trial.prev_stimulus_eu,
          prev_n_game: trial.prev_stimulus_n_game,
          prev_n_game_r: trial.prev_stimulus_n_game_r,
          // response
          rt: response.rt,
          key_press: response.key,
          timeout: timeout,
          // current player shown
          player_number: trial.player_number,
          player_action: trial.player_action,
          player_rt: trial.player_rt,
          player_rt_q: trial.player_rt_q,
          subject: trial.subject,
          // both players (always saved)
          player_1_action: trial.player_1_action,
          player_2_action: trial.player_2_action,
          player_1_rt: trial.player_1_rt,
          player_2_rt: trial.player_2_rt,
          player_1_rt_q: trial.player_1_rt_q,
          player_2_rt_q: trial.player_2_rt_q,
          subject_1: trial.subject_1,
          subject_2: trial.subject_2
        };

        this.jsPsych.finishTrial(trial_data);
      };

      // Start the trial
      displayStage();
      startResponseListener();

      if (trial.timing_response > 0) {
        setTimeoutHandlers.push(
          this.jsPsych.pluginAPI.setTimeout(() => {
            killListeners();
            endTrial(true);
          }, trial.timing_response)
        );
      }
    }
  }

  GameChoiceRTInfoKeyboardResponsePlugin.info = info;
  return GameChoiceRTInfoKeyboardResponsePlugin;
})(jsPsychModule);
