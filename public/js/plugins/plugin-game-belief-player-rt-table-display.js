var jsPsychGameBeliefPlayerRTTableDisplay = (function (jsPsych) {
  "use strict";

  const info = {
    name: "game-belief-player-rt-table-display",
    version: "1.0.0",
    parameters: {
      stimulus: {
        type: jsPsych.ParameterType.HTML_STRING,
        default: undefined,
        description: "The table to be displayed",
      },
      choices: {
        type: jsPsych.ParameterType.KEYS,
        default: "ALL_KEYS"
      },
      stimulus_duration: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "How long to display the stimulus.",
      },
      trial_duration: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "How long to allow the trial.",
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
      },
      player_number: {
        type: jsPsych.ParameterType.STRING,
        default: null,
        description: "Player number.",
      },
      player_action: {
        type: jsPsych.ParameterType.STRING,
        default: null,
        description: "Action taken by Player.",
      },
      player_rt: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Response time for Player.",
      },
      player_rt_q: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Response time quantile for Player.",
      },
      subject: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Subject number for Player.",
      }
    },
    data: {
      stimulus: {
        type: jsPsych.ParameterType.HTML_STRING,
        description: "The stimulus content shown in the trial."
      },
      player_number: {
        type: jsPsych.ParameterType.STRING,
        default: null,
        description: "Player number.",
      },
      player_action: {
        type: jsPsych.ParameterType.STRING,
        description: "Action taken by Player."
      },
      player_rt: {
        type: jsPsych.ParameterType.INT,
        description: "Response time for Player."
      },
      player_rt_q: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Response time quantile for Player.",
      },
      subject: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Subject number for Player.",
      },
      key_press: {
        type: jsPsych.ParameterType.STRING,
        description: "Key pressed to end the trial.",
      },
      rt: {
        type: jsPsych.ParameterType.INT, 
        description: "RT of the key press",
      },
    }
  };

  class GameBeliefPlayerRTTableDisplay {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }

    trial(display_element, trial) {
      // Create table container
      const displayStage = () => {
        let new_html = "";

        new_html += '<div class="container-multi-belief-player">';
        new_html += `<table class="ts">`;
        new_html += `<tbody>`;
        new_html += `<tr>`;
        new_html += `<td class="ts-0lax-other"></td>`;
        new_html += `<td class="ts-baqh-other" colspan="2"><div class="action-other" id="action-other-left">L</div></td>`;
        new_html += `<td class="ts-baqh-other" colspan="2"><div class="action-other" id="action-other-right">R</div></td>`;
        new_html += `</tr>`;
        new_html += `<tr class="row-1">`;
        new_html += `<td class="container-multi-belief-column-player" id="multiattribute-choices-stimulus-top" rowspan="2"><div class="action-self" id="action-self-top">T</div></td>`;
        new_html += `<td class="ts-0lax-top"></td>`;
        new_html += `<td class="ts-viqs"><div class="points-other" id="points-top-other-left">${trial.stimulus[1]}</div></td>`;
        new_html += `<td class="ts-0lax-top"></td>`;
        new_html += `<td class="ts-viqs"><div class="points-other" id="points-top-other-right">${trial.stimulus[3]}</div></td>`;
        new_html += `</tr>`;
        new_html += `<tr class="row-2">`;
        new_html += `<td class="ts-ti2t"><div class="points-self" id="points-top-self-left">${trial.stimulus[0]}</div></td>`;
        new_html += `<td class="ts-0lax"></td>`;
        new_html += `<td class="ts-ti2t"><div class="points-self" id="points-top-self-right">${trial.stimulus[2]}</div></td>`;
        new_html += `<td class="ts-0lax"></td>`;
        new_html += `</tr>`;
        new_html += `<tr class="row-3">`;
        new_html += `<td class="container-multi-belief-column-player" id="multiattribute-choices-stimulus-bottom" rowspan="2"><div class="action-self" id="action-self-bottom">B</div></td>`;
        new_html += `<td class="ts-0lax-top"></td>`;
        new_html += `<td class="ts-viqs"><div class="points-other" id="points-bottom-other-left">${trial.stimulus[5]}</div></td>`;
        new_html += `<td class="ts-0lax-top"></td>`;
        new_html += `<td class="ts-viqs"><div class="points-other" id="points-bottom-other-right">${trial.stimulus[7]}</div></td>`;
        new_html += `</tr>`;
        new_html += `<tr class="row-4">`;
        new_html += `<td class="ts-ti2t"><div class="points-self" id="points-bottom-self-left">${trial.stimulus[4]}</div></td>`;
        new_html += `<td class="ts-0lax"></td>`;
        new_html += `<td class="ts-ti2t"><div class="points-self" id="points-bottom-self-right">${trial.stimulus[6]}</div></td>`;
        new_html += `<td class="ts-0lax"></td>`;
        new_html += `</tr>`;
        new_html += `</tbody>`;
        new_html += `</table>`;

        // add player info right after the table
        new_html += `
        <div id="player-info-belief">
          <p>Player answered action <span style="color: red; font-size: 1.2em; font-weight: bold;">${trial.player_action}</span> in <span style="font-size: 1.2em; font-weight: bold;">${trial.player_rt.toFixed(1)}</span> seconds.</p>
        </div>
        `;

        // Close the container
        new_html += '</div>';

        display_element.innerHTML = new_html;
      };

      displayStage();


      let response = {
        key: null,
        rt: null,
      };

      // Set up key listener
      const keyboardListener = this.jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: (info) => {
          response.key = info.key;
          response.rt = info.rt;
          endTrial();
        },
        valid_responses: trial.choices === "ALL_KEYS" ? null : trial.choices,
        rt_method: "performance",
        persist: false,
        allow_held_key: false,
      });

      // End trial
      const endTrial = () => {
        this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);

        let trialData = {
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
          player_number: trial.player_number,
          player_action: trial.player_action,
          player_rt: trial.player_rt,
          player_rt_q: trial.player_rt_q,
          subject: trial.subject,
          key_press: response.key,
          rt: response.rt,
        };

        this.jsPsych.finishTrial(trialData);
      };

      if (trial.stimulus_duration) {
        setTimeout(() => {
          document.querySelector(".tg").style.visibility = "hidden";
        }, trial.stimulus_duration);
      }

      if (trial.trial_duration) {
        setTimeout(endTrial, trial.trial_duration);
      }
    }

    static get info() {
      return info;
    }
  }

  return GameBeliefPlayerRTTableDisplay;
})(jsPsychModule);
