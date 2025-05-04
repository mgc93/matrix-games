var jsPsychGameChoiceKeyboardResponse = (function(jsPsych) {
  "use strict";

  const info = {
    name: "game-choice-keyboard-response",
    version: "1.0.0",
    parameters: {
      stimulus: {
        type: jsPsych.ParameterType.HTML_STRING,
        default: undefined,
        description: "The HTML string to be displayed"
      },
      choices: {
        type: jsPsych.ParameterType.KEYS,
        default: ["F", "J"],
        description: "The keys the subject is allowed to press to respond to the stimulus."
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
        description: "Game matrix number."
      },
      stimulus_display: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Display type of the game matrix."
      },
      stimulus_r: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Riskiness parameter of the game."
      },
      stimulus_type_game: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Mean riskiness parameter of the game."
      },
      stimulus_eu: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Expected utility parameter of the game."
      },
      stimulus_n_game: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Original Game Number."
      },
      stimulus_n_game_r: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Original game number within the same mean riskiness level."
      }
    },
    data: {
      stimulus: {
        type: jsPsych.ParameterType.HTML_STRING
      },
      rt: {
        type: jsPsych.ParameterType.INT
      },
      key_press: {
        type: jsPsych.ParameterType.KEYS
      }
    }
  };

  /**
   * **binary-choice-game**
   *
   * Plugin to create a binary choice game experiment in jsPsych.
   *
   * @version 1.0.0
   * @see https://www.jspsych.org/
   */
  class GameChoiceKeyboardResponsePlugin {
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

      // This function clears all active setTimeout timers for the current trial.
      const killTimers = () => {
        setTimeoutHandlers.forEach((timer) => clearTimeout(timer));
      };

      // This function cancels any active keyboard listeners for the current trial.
      const killListeners = () => {
        if (keyboardListener) {
          this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
        }
      };

      const displayStage = () => {
        display_element.innerHTML = "";
        let new_html = "";

        new_html += '<div class="container-multi-choice">';
        new_html += `<table class="tg">`;
        new_html += `<tbody>`;
        new_html += `<tr>`;
        new_html += `<td class="tg-0lax-other"></td>`;
        new_html += `<td class="tg-baqh-other" colspan="2"><div class="action-other" id="action-other-left">L</div></td>`;
        new_html += `<td class="tg-baqh-other" colspan="2"><div class="action-other" id="action-other-right">R</div></td>`;
        new_html += `</tr>`;
        new_html += `<tr class="row-1">`;
        new_html += `<td class="container-multi-choice-column" id="multiattribute-choices-stimulus-top" rowspan="2"><div class="action-self" id="action-self-top">T</div></td>`;
        new_html += `<td class="tg-0lax-top"></td>`;
        new_html += `<td class="tg-viqs"><div class="points-other" id="points-top-other-left">${trial.stimulus[1]}</div></td>`;
        new_html += `<td class="tg-0lax-top"></td>`;
        new_html += `<td class="tg-viqs"><div class="points-other" id="points-top-other-right">${trial.stimulus[3]}</div></td>`;
        new_html += `</tr>`;
        new_html += `<tr class="row-2">`;
        new_html += `<td class="tg-ti2t"><div class="points-self" id="points-top-self-left">${trial.stimulus[0]}</div></td>`;
        new_html += `<td class="tg-0lax"></td>`;
        new_html += `<td class="tg-ti2t"><div class="points-self" id="points-top-self-right">${trial.stimulus[2]}</div></td>`;
        new_html += `<td class="tg-0lax"></td>`;
        new_html += `</tr>`;
        new_html += `<tr class="row-3">`;
        new_html += `<td class="container-multi-choice-column" id="multiattribute-choices-stimulus-bottom" rowspan="2"><div class="action-self" id="action-self-bottom">B</div></td>`;
        new_html += `<td class="tg-0lax-top"></td>`;
        new_html += `<td class="tg-viqs"><div class="points-other" id="points-bottom-other-left">${trial.stimulus[5]}</div></td>`;
        new_html += `<td class="tg-0lax-top"></td>`;
        new_html += `<td class="tg-viqs"><div class="points-other" id="points-bottom-other-right">${trial.stimulus[7]}</div></td>`;
        new_html += `</tr>`;
        new_html += `<tr class="row-4">`;
        new_html += `<td class="tg-ti2t"><div class="points-self" id="points-bottom-self-left">${trial.stimulus[4]}</div></td>`;
        new_html += `<td class="tg-0lax"></td>`;
        new_html += `<td class="tg-ti2t"><div class="points-self" id="points-bottom-self-right">${trial.stimulus[6]}</div></td>`;
        new_html += `<td class="tg-0lax"></td>`;
        new_html += `</tr>`;
        new_html += `</tbody>`;
        new_html += `</table>`;
        new_html += '<div id="binary-timeoutinfo"></div>';
        new_html += '</div>';

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
              this.jsPsych.pluginAPI.setTimeout(() => endTrial(false), trial.stimulus_duration ? trial.stimulus_duration - response.rt : 500);
            },
            valid_responses: trial.choices,
            rt_method: "performance",
            persist: false,
            allow_held_key: false
          });
        }
      };

      const displaySelection = () => {
        if (response.key === trial.choices[0]) {
          display_element.querySelector('.row-1').className += '-responded';
          display_element.querySelector('.row-2').className += '-responded';
        } else if (response.key === trial.choices[1]) {
          display_element.querySelector('.row-3').className += '-responded';
          display_element.querySelector('.row-4').className += '-responded';
        }
      };


      const endTrial = (timeout) => {
        const trial_data = {
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
          rt: response.rt,
          key_press: response.key,
          timeout: timeout,
        };

        this.jsPsych.finishTrial(trial_data);
      };

      // Start the trial
      displayStage();
      startResponseListener();

      // Set up stimulus duration timer
      if (trial.stimulus_duration !== null) {
        setTimeoutHandlers.push(
          this.jsPsych.pluginAPI.setTimeout(() => {
            display_element.querySelector(".container-multi-choice").style.visibility = "hidden";
          }, trial.stimulus_duration)
        );
      }

      // Set up response timeout
      if (trial.timing_response > 0) {
        setTimeoutHandlers.push(
          this.jsPsych.pluginAPI.setTimeout(() => {
            killListeners();
            endTrial(true); // Timeout occurred
          }, trial.timing_response)
        );
      }
    }
  }

  GameChoiceKeyboardResponsePlugin.info = info;
  return GameChoiceKeyboardResponsePlugin;
})(jsPsychModule);

