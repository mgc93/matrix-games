var jsPsychGameBeliefRTInfoTableSliderResponse = (function (jsPsych) {
  "use strict";

  const info = {
    name: "game-belief-rt-info-table-slider-response",
    version: "1.0.0",
    parameters: {
      // --- Right panel: new game (y) + slider ---
      stimulus: {
        type: jsPsych.ParameterType.HTML_STRING,
        default: undefined,
        description: "The new game matrix (y) displayed on the right."
      },
      min: {
        type: jsPsych.ParameterType.INT,
        default: 0,
        description: "Minimum value of the slider."
      },
      max: {
        type: jsPsych.ParameterType.INT,
        default: 100,
        description: "Maximum value of the slider."
      },
      start: {
        type: jsPsych.ParameterType.FLOAT,
        default: 50,
        description: "Starting value of the slider."
      },
      step: {
        type: jsPsych.ParameterType.INT,
        default: 1,
        description: "Step of the slider."
      },
      labels: {
        type: jsPsych.ParameterType.HTML_STRING,
        default: [],
        array: true,
        description: "Labels of the slider."
      },
      slider_width: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Width of the slider in pixels."
      },
      button_label: {
        type: jsPsych.ParameterType.STRING,
        default: "Continue",
        description: "Label of the continue button."
      },
      require_movement: {
        type: jsPsych.ParameterType.BOOL,
        default: false,
        description: "If true, participant must move the slider before continuing."
      },
      prompt: {
        type: jsPsych.ParameterType.STRING,
        default: null,
        description: "Content displayed below the slider."
      },
      stimulus_duration: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "How long to show the stimulus."
      },
      trial_duration: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "How long to allow the trial."
      },
      response_ends_trial: {
        type: jsPsych.ParameterType.BOOL,
        default: true,
        description: "If true, trial ends when participant clicks Continue."
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
      player_number: {
        type: jsPsych.ParameterType.INT,
        default: 1,
        description: "Which player is shown (1 or 2). Saved in data."
      },
      player_action: {
        type: jsPsych.ParameterType.STRING,
        default: null,
        description: "Action chosen by the current player."
      },
      player_rt: {
        type: jsPsych.ParameterType.FLOAT,
        default: null,
        description: "RT of the current player."
      },
      player_rt_q: {
        type: jsPsych.ParameterType.FLOAT,
        default: null,
        description: "RT quantile of the current player."
      },
      subject: {
        type: jsPsych.ParameterType.FLOAT,
        default: null,
        description: "Subject ID of the current player."
      },
      // --- Left panel: previous game (x) ---
      prev_stimulus: {
        type: jsPsych.ParameterType.HTML_STRING,
        default: undefined,
        description: "The previous game matrix (x) displayed on the left."
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
      // --- Both players' data (always saved) ---
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
      },
      prev_median_rt_game: {
        type: jsPsych.ParameterType.FLOAT,
        default: null,
        description: "Median RT (in seconds) of previous participants for the previous game."
      }
    },
    data: {
      stimulus: { type: jsPsych.ParameterType.HTML_STRING },
      prev_stimulus: { type: jsPsych.ParameterType.HTML_STRING },
      rt: { type: jsPsych.ParameterType.INT },
      rating: { type: jsPsych.ParameterType.INT }
    }
  };

  /**
   * **game-belief-rt-info-table-slider-response**
   *
   * Split-screen plugin: left panel shows the previous game (read-only) with
   * the current player's RT info; right panel shows the new game with a
   * slider belief elicitation.
   *
   * @version 1.0.0
   */
  class GameBeliefRTInfoTableSliderResponsePlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }

    static info = info;

    trial(display_element, trial) {
      const buildTable = (payoffs, prefix) => {
        let html = "";
        html += `<table class="t${prefix}">`;
        html += `<tbody>`;
        html += `<tr>`;
        html += `<td class="t${prefix}-0lax-other"></td>`;
        html += `<td class="t${prefix}-baqh-other" colspan="2"><div class="action-other" id="${prefix}-action-other-left">L</div></td>`;
        html += `<td class="t${prefix}-baqh-other" colspan="2"><div class="action-other" id="${prefix}-action-other-right">R</div></td>`;
        html += `</tr>`;
        html += `<tr>`;
        html += `<td class="t${prefix}-column" rowspan="2"><div class="action-self" id="${prefix}-action-self-top">T</div></td>`;
        html += `<td class="t${prefix}-0lax-top"></td>`;
        html += `<td class="t${prefix}-viqs"><div class="points-other" id="${prefix}-points-top-other-left">${payoffs[1]}</div></td>`;
        html += `<td class="t${prefix}-0lax-top"></td>`;
        html += `<td class="t${prefix}-viqs"><div class="points-other" id="${prefix}-points-top-other-right">${payoffs[3]}</div></td>`;
        html += `</tr>`;
        html += `<tr>`;
        html += `<td class="t${prefix}-ti2t"><div class="points-self" id="${prefix}-points-top-self-left">${payoffs[0]}</div></td>`;
        html += `<td class="t${prefix}-0lax"></td>`;
        html += `<td class="t${prefix}-ti2t"><div class="points-self" id="${prefix}-points-top-self-right">${payoffs[2]}</div></td>`;
        html += `<td class="t${prefix}-0lax"></td>`;
        html += `</tr>`;
        html += `<tr>`;
        html += `<td class="t${prefix}-column" rowspan="2"><div class="action-self" id="${prefix}-action-self-bottom">B</div></td>`;
        html += `<td class="t${prefix}-0lax-top"></td>`;
        html += `<td class="t${prefix}-viqs"><div class="points-other" id="${prefix}-points-bottom-other-left">${payoffs[5]}</div></td>`;
        html += `<td class="t${prefix}-0lax-top"></td>`;
        html += `<td class="t${prefix}-viqs"><div class="points-other" id="${prefix}-points-bottom-other-right">${payoffs[7]}</div></td>`;
        html += `</tr>`;
        html += `<tr>`;
        html += `<td class="t${prefix}-ti2t"><div class="points-self" id="${prefix}-points-bottom-self-left">${payoffs[4]}</div></td>`;
        html += `<td class="t${prefix}-0lax"></td>`;
        html += `<td class="t${prefix}-ti2t"><div class="points-self" id="${prefix}-points-bottom-self-right">${payoffs[6]}</div></td>`;
        html += `<td class="t${prefix}-0lax"></td>`;
        html += `</tr>`;
        html += `</tbody>`;
        html += `</table>`;
        return html;
      };

      let html = '<div class="container-belief-rt-info">';

      // --- Left panel: previous game (read-only) ---
      html += '<div class="panel-belief-rt-info panel-belief-prev">';
      html += buildTable(trial.prev_stimulus, "bprev");
      html += `<div class="info-text-belief-rt-info">
        Half of previous participants made their decision in this game within <span class="highlight-rt-belief">${trial.prev_median_rt_game.toFixed(1)}</span> seconds.
      </div>`;
      html += `<div class="info-text-belief-rt-info">
        Player answered action <span class="highlight-action-belief">${trial.player_action}</span> in <span class="highlight-rt-belief">${trial.player_rt.toFixed(1)}</span> seconds.
      </div>`;
      html += '</div>';

      // --- Vertical divider ---
      html += '<div class="divider-belief-rt-info"></div>';

      // --- Right panel: new game + slider ---
      html += '<div class="panel-belief-rt-info panel-belief-next">';
      html += buildTable(trial.stimulus, "bnext");

      // Slider
      html += '<div class="jspsych-belief-rt-info-slider-container">';
      html += `<input type="range" value="${trial.start}" min="${trial.min}" max="${trial.max}" step="${trial.step}" style="width: 100%;" id="jspsych-belief-rt-info-slider"></input>`;
      html += '<div style="position: relative; width: 100%;">';
      for (var j = 0; j < trial.labels.length; j++) {
        var width = 100 / (trial.labels.length - 1);
        var left_offset = (j * (100 / (trial.labels.length - 1))) - (width / 2);
        html += `<div style="display: inline-block; position: absolute; left:${left_offset}%; text-align: center; width: ${width}%;">`;
        html += `<span style="text-align: center; font-size: 80%;">${trial.labels[j]}</span>`;
        html += '</div>';
      }
      html += '</div>';
      html += '</div>';

      // Prompt
      html += '<p id="display_prompt_belief_rt_info">';
      if (trial.prompt !== null) { html += trial.prompt; }
      html += '</p>';

      // Continue button
      html += `<div><button id="jspsych-belief-rt-info-next" class="jspsych-btn" ${trial.require_movement ? "disabled" : ""}>${trial.button_label}</button></div>`;

      html += '</div>'; // close panel-belief-next
      html += '</div>'; // close container

      display_element.innerHTML = html;

      var response = { rt: null, response: null };
      const startTime = performance.now();

      if (trial.require_movement) {
        display_element.querySelector('#jspsych-belief-rt-info-slider').addEventListener('change', function () {
          display_element.querySelector('#jspsych-belief-rt-info-next').disabled = false;
        });
      }

      display_element.querySelector('#jspsych-belief-rt-info-next').addEventListener('click', function () {
        response.rt = performance.now() - startTime;
        response.response = display_element.querySelector('#jspsych-belief-rt-info-slider').value;
        if (trial.response_ends_trial) {
          end_trial();
        } else {
          display_element.querySelector('#jspsych-belief-rt-info-next').disabled = true;
        }
      });

      const end_trial = () => {
        this.jsPsych.pluginAPI.clearAllTimeouts();

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
          rating: response.response,
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
          subject_2: trial.subject_2,
          prev_median_rt_game: trial.prev_median_rt_game
        };

        display_element.innerHTML = '';
        this.jsPsych.finishTrial(trial_data);
      };

      if (trial.stimulus_duration !== null) {
        this.jsPsych.pluginAPI.setTimeout(() => {
          display_element.querySelector('#jspsych-belief-rt-info-slider').style.visibility = 'hidden';
        }, trial.stimulus_duration);
      }

      if (trial.trial_duration !== null) {
        this.jsPsych.pluginAPI.setTimeout(() => { end_trial(); }, trial.trial_duration);
      }
    }
  }

  GameBeliefRTInfoTableSliderResponsePlugin.info = info;
  return GameBeliefRTInfoTableSliderResponsePlugin;
})(jsPsychModule);
