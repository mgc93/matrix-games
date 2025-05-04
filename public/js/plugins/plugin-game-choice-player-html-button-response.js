var jsPsychGameChoicePlayerHTMLButtonResponse = (function (jsPsych) {
  "use strict";

  const info = {
    name: "game-choice-player-html-button-response",
    version: "1.0.0",
    parameters: {
      stimulus: {
        type: jsPsych.ParameterType.HTML_STRING,
        default: undefined,
        description: "The table to be displayed",
      },
      choices: {
        type: jsPsych.ParameterType.STRING,
        default: undefined,
        array: true,
        description: "The button labels for each choice.",
      },
      button_html: {
        type: jsPsych.ParameterType.FUNCTION,
        default: function(choice, choice_index) {
          return `<button class=\"jspsych-btn\">${choice}</button>`;
        },
        description: "HTML to use for the buttons.",
      },
      prompt: {
        type: jsPsych.ParameterType.HTML_STRING,
        default: null,
        description: "Any content here will be displayed below the buttons.",
      },
      button_layout: {
        type: jsPsych.ParameterType.STRING,
        default: "grid",
        description: "The layout for the buttons, either grid or flex.",
      },
      grid_rows: {
        type: jsPsych.ParameterType.INT,
        default: 1,
        description: "Number of rows for grid layout.",
      },
      grid_columns: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Number of columns for grid layout.",
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
      response_ends_trial: {
        type: jsPsych.ParameterType.BOOL,
        default: true,
        description: "If true, the trial ends after a response is made.",
      },
      player_1_action: {
        type: jsPsych.ParameterType.STRING,
        default: null,
        description: "Action taken by Player 1.",
      },
      player_2_action: {
        type: jsPsych.ParameterType.STRING,
        default: null,
        description: "Action taken by Player 2.",
      },
      player_1_rt_q: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Response time quantile for Player 1.",
      },
      player_2_rt_q: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Response time quantile for Player 2.",
      },
      player_1_rt: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Response time for Player 1.",
      },
      player_2_rt: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Response time for Player 2.",
      },
      subject_1: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Subject number for Player 1.",
      },
      subject_2: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Subject number for Player 2.",
      }
    },
    data: {
      stimulus: {
        type: jsPsych.ParameterType.HTML_STRING,
        description: "The stimulus content shown in the trial."
      },
      rt: {
        type: jsPsych.ParameterType.INT,
        description: "Response time for the trial."
      },
      response: {
        type: jsPsych.ParameterType.INT,
        description: "Button choice made by the participant."
      },
      selected_player: {
        type: jsPsych.ParameterType.STRING,
        description: "The selected player by the participant."
      },
      player_1_action: {
        type: jsPsych.ParameterType.STRING,
        description: "Action taken by Player 1."
      },
      player_2_action: {
        type: jsPsych.ParameterType.STRING,
        description: "Action taken by Player 2."
      },
      player_1_rt_q: {
        type: jsPsych.ParameterType.INT,
        description: "Response time quantile for Player 1."
      },
      player_2_rt_q: {
        type: jsPsych.ParameterType.INT,
        description: "Response time quantile for Player 2."
      },
      player_1_rt: {
        type: jsPsych.ParameterType.INT,
        description: "Response time for Player 1."
      },
      player_2_rt: {
        type: jsPsych.ParameterType.INT,
        description: "Response time for Player 2."
      },
      subject_1: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Subject number for Player 1.",
      },
      subject_2: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Subject number for Player 2.",
      }
    }
  };

  class GameChoicePlayerHTMLButtonResponse {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }

    trial(display_element, trial) {
      // Create table container
      const displayStage = () => {
        let new_html = "";

        new_html += '<div class="container-multi-choice-player">';
        new_html += `<table class="tp">`;
        new_html += `<tbody>`;
        new_html += `<tr>`;
        new_html += `<td class="tp-0lax-other"></td>`;
        new_html += `<td class="tp-baqh-other" colspan="2"><div class="action-other" id="action-other-left">L</div></td>`;
        new_html += `<td class="tp-baqh-other" colspan="2"><div class="action-other" id="action-other-right">R</div></td>`;
        new_html += `</tr>`;
        new_html += `<tr class="row-1">`;
        new_html += `<td class="container-multi-choice-column-player" id="multiattribute-choices-stimulus-top" rowspan="2"><div class="action-self" id="action-self-top">T</div></td>`;
        new_html += `<td class="tp-0lax-top"></td>`;
        new_html += `<td class="tp-viqs"><div class="points-other" id="points-top-other-left">${trial.stimulus[1]}</div></td>`;
        new_html += `<td class="tp-0lax-top"></td>`;
        new_html += `<td class="tp-viqs"><div class="points-other" id="points-top-other-right">${trial.stimulus[3]}</div></td>`;
        new_html += `</tr>`;
        new_html += `<tr class="row-2">`;
        new_html += `<td class="tp-ti2t"><div class="points-self" id="points-top-self-left">${trial.stimulus[0]}</div></td>`;
        new_html += `<td class="tp-0lax"></td>`;
        new_html += `<td class="tp-ti2t"><div class="points-self" id="points-top-self-right">${trial.stimulus[2]}</div></td>`;
        new_html += `<td class="tp-0lax"></td>`;
        new_html += `</tr>`;
        new_html += `<tr class="row-3">`;
        new_html += `<td class="container-multi-choice-column-player" id="multiattribute-choices-stimulus-bottom" rowspan="2"><div class="action-self" id="action-self-bottom">B</div></td>`;
        new_html += `<td class="tp-0lax-top"></td>`;
        new_html += `<td class="tp-viqs"><div class="points-other" id="points-bottom-other-left">${trial.stimulus[5]}</div></td>`;
        new_html += `<td class="tp-0lax-top"></td>`;
        new_html += `<td class="tp-viqs"><div class="points-other" id="points-bottom-other-right">${trial.stimulus[7]}</div></td>`;
        new_html += `</tr>`;
        new_html += `<tr class="row-4">`;
        new_html += `<td class="tp-ti2t"><div class="points-self" id="points-bottom-self-left">${trial.stimulus[4]}</div></td>`;
        new_html += `<td class="tp-0lax"></td>`;
        new_html += `<td class="tp-ti2t"><div class="points-self" id="points-bottom-self-right">${trial.stimulus[6]}</div></td>`;
        new_html += `<td class="tp-0lax"></td>`;
        new_html += `</tr>`;
        new_html += `</tbody>`;
        new_html += `</table>`;

        // add player info right after the table
        new_html += `
        <div id="player-info">
          <p>Player 1 answered action <span style="color: red; font-size: 1.2em; font-weight: bold;">${trial.player_1_action}</span> in <span style="font-size: 1.2em; font-weight: bold;">${trial.player_1_rt.toFixed(1)}</span> seconds.</p>
          <p>Player 2 answered action <span style="color: red; font-size: 1.2em; font-weight: bold;">${trial.player_2_action}</span> in <span style="font-size: 1.2em; font-weight: bold;">${trial.player_2_rt.toFixed(1)}</span> seconds.</p>
          <p>Which player do you want to play with next?</p>
        </div>
        `;

        // add buttons inside the same container
        new_html += `<div class="player-choice-buttons">`;
        trial.choices.forEach((choice, index) => {
          const buttonHTML = trial.button_html(choice, index);
          new_html += `<div>${buttonHTML}</div>`;
        });
        new_html += `</div>`;

        // Close the container
        new_html += '</div>';

        display_element.innerHTML = new_html;

        // Button event listeners
        const buttons = display_element.querySelectorAll(".jspsych-btn");
        buttons.forEach((button, index) => {
          button.dataset.choice = index;
          button.addEventListener("click", () => afterResponse(index));
        });

      };

      displayStage();


      let response = {
        rt: null,
        button: null,
      };

      const afterResponse = (choice) => {
        response.rt = performance.now();
        response.button = choice;

        if (trial.response_ends_trial) {
          endTrial();
        }
      };

      const endTrial = () => {
        const trialData = {
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
          response: response.button,
          rt: response.rt,
          selected_player: trial.choices[response.button],
          player_1_action: trial.player_1_action,
          player_2_action: trial.player_2_action,
          player_1_rt_q: trial.player_1_rt_q,
          player_2_rt_q: trial.player_2_rt_q,
          player_1_rt: trial.player_1_rt,
          player_2_rt: trial.player_2_rt,
          subject_1: trial.subject_1,
          subject_2: trial.subject_2,
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

  return GameChoicePlayerHTMLButtonResponse;
})(jsPsychModule);
