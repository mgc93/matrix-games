var jsPsychGameBeliefRTTableSliderResponse = (function (jsPsych) {
  "use strict";

  const info = {
    name: "game-belief-rt-table-slider-response",
    version: "1.0.0",
    parameters: {
      stimulus: {
        type: jsPsych.ParameterType.HTML_STRING,
        default: undefined,
        description: "The table to be displayed",
      },
      stimulus_height: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Set the image height in pixels",
      },
      stimulus_width: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Set the image width in pixels",
      },
      maintain_aspect_ratio: {
        type: jsPsych.ParameterType.BOOL,
        default: true,
        description: "Maintain the aspect ratio after setting width or height",
      },
      min: {
        type: jsPsych.ParameterType.INT,
        default: 0,
        description: "Sets the minimum value of the slider.",
      },
      max: {
        type: jsPsych.ParameterType.INT,
        default: 100,
        description: "Sets the maximum value of the slider",
      },
      start: {
        type: jsPsych.ParameterType.FLOAT,
        default: 50,
        description: "Sets the starting value of the slider",
      },
      step: {
        type: jsPsych.ParameterType.INT,
        default: 1,
        description: "Sets the step of the slider",
      },
      labels: {
        type: jsPsych.ParameterType.HTML_STRING,
        default: [],
        array: true,
        description: "Labels of the slider.",
      },
      slider_width: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Width of the slider in pixels.",
      },
      button_label: {
        type: jsPsych.ParameterType.STRING,
        default: "Continue",
        description: "Label of the button to advance.",
      },
      require_movement: {
        type: jsPsych.ParameterType.BOOL,
        default: false,
        description: "If true, the participant will have to move the slider before continuing.",
      },
      prompt: {
        type: jsPsych.ParameterType.STRING,
        default: null,
        description: "Any content here will be displayed below the slider.",
      },
      stimulus_duration: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "How long to hide the stimulus.",
      },
      trial_duration: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "How long to show the trial.",
      },
      response_ends_trial: {
        type: jsPsych.ParameterType.BOOL,
        default: true,
        description: "If true, trial will end when user makes a response.",
      },
      stimulus_order: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Game matrix number",
      },
      stimulus_display: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Display type of the game matrix",
      },
      stimulus_r: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Riskiness parameter of the game",
      },
      stimulus_type_game: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Mean riskiness parameter of the game",
      },
      stimulus_eu: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Expected utility parameter of the game",
      },
      stimulus_n_game: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Original Game Number",
      },
      stimulus_n_game_r: {
        type: jsPsych.ParameterType.INT,
        default: null,
        description: "Original game number within the same mean riskiness level",
      },
      player_number: {
        type: jsPsych.ParameterType.INT,
        default: 1,
        description: "The player number to be displayed in the sentence."
      },
      player_action: {
        type: jsPsych.ParameterType.STRING,
        default: "L",
        description: "The action chosen by the player to be displayed in the sentence."
      },
      player_rt: {
        type: jsPsych.ParameterType.FLOAT,
        default: 3.0,
        description: "The time taken by the player to respond."
      },
      player_rt_q: {
        type: jsPsych.ParameterType.FLOAT,
        default: 3.0,
        description: "The quantile time taken by the player to respond."
      },
      subject: {
        type: jsPsych.ParameterType.FLOAT,
        default: 3.0,
        description: "The subject number of the player."
      },
    },
    data: {
      stimulus: {
        type: jsPsych.ParameterType.HTML_STRING, 
      },
      rt: {
        type: jsPsych.ParameterType.INT, 
      },
      rating: {
        type: jsPsych.ParameterType.INT, 
      },
    }
  };

  class GameBeliefRTTableSliderResponsePlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }

    trial(display_element, trial) {
      var html = '<div class="container-multi-belief-rt">';
      html += `<table class="tb">`;
      html += `<tbody>`;
      html += `  <tr>`;
      html += `    <td class="tb-0lax-other"></td>`;
      html += `    <td class="tb-baqh-other" colspan="2"><div class = "action-other" id = "action-other-left">L</div></td>`;
      html += `    <td class="tb-baqh-other" colspan="2"><div class = "action-other" id = "action-other-right">R</div></td>`;
      html += `  </tr>`;
      html += `  <tr>`;
      html += `    <td class="container-multi-belief-column-rt" id= "multiattribute-choices-stimulus-top" rowspan="2"><div class = "action-self" id = "action-self-top">T</div></td>`;
      html += `    <td class="tb-0lax-top"></td>`;
      html += `    <td class="tb-viqs"><div class = "points-other" id="points-top-other-left">${trial.stimulus[1]}</div></td>`;
      html += `    <td class="tb-0lax-top"></td>`;
      html += `    <td class="tb-viqs"><div class = "points-other" id="points-top-other-right">${trial.stimulus[3]}</div></td>`;
      html += `  </tr>`;
      html += `  <tr>`;
      html += `    <td class="tb-ti2t"><div class = "points-self" id="points-top-self-left">${trial.stimulus[0]}</div></td>`;
      html += `    <td class="tb-0lax"></td>`;
      html += `    <td class="tb-ti2t"><div class = "points-self" id="points-top-self-right">${trial.stimulus[2]}</div></td>`;
      html += `    <td class="tb-0lax"></td>`;
      html += `  </tr>`;
      html += `  <tr>`;
      html += `    <td class="container-multi-belief-column-rt" id= "multiattribute-choices-stimulus-bottom" rowspan="2"><div class = "action-self" id = "action-self-bottom">B</div></td>`;
      html += `    <td class="tb-0lax-top"></td>`;
      html += `    <td class="tb-viqs"><div class = "points-other" id="points-bottom-other-left">${trial.stimulus[5]}</div></td>`;
      html += `    <td class="tb-0lax-top"></td>`;
      html += `    <td class="tb-viqs"><div class = "points-other" id="points-bottom-other-right">${trial.stimulus[7]}</div></td>`;
      html += `  </tr>`;
      html += `  <tr>`;
      html += `    <td class="tb-ti2t"><div class = "points-self" id="points-bottom-self-left">${trial.stimulus[4]}</div></td>`;
      html += `    <td class="tb-0lax"></td>`;
      html += `    <td class="tb-ti2t"><div class = "points-self" id="points-bottom-self-right">${trial.stimulus[6]}</div></td>`;
      html += `    <td class="tb-0lax"></td>`;
      html += `  </tr>`;
      html += `</tbody>`;
      html += `</table>`;
      html += '<div class="jspsych-table-slider-response-rt-container">';
      html += '<input type="range" value="'+trial.start+'" min="'+trial.min+'" max="'+trial.max+'" step="'+trial.step+'" style="width: 100%;" id="jspsych-table-slider-response-rt-response"></input>';
      html += '<div>';
      for(var j=0; j < trial.labels.length; j++){
        var width = 100/(trial.labels.length-1);
        var left_offset = (j * (100 /(trial.labels.length - 1))) - (width/2);
        html += '<div style="display: inline-block; position: absolute; left:'+left_offset+'%; text-align: center; width: '+width+'%;">';
        html += '<span style="text-align: center; font-size: 80%;">'+trial.labels[j]+'</span>';
        html += '</div>';
      }
      html += '</div>';
      html += '</div>';
      html += '<p id = "display_prompt_belief_rt">';

      if (trial.prompt !== null){
        html += trial.prompt;
      }
      html += '</p>';
      html += '<div display ="inline-block">';
      html += '<button id="jspsych-table-slider-response-rt-next" class="jspsych-btn" '+ (trial.require_movement ? "disabled" : "") + '>'+trial.button_label+'</button>';
      html += '</div>';
      display_element.innerHTML = html;

      var response = {
        rt: null,
        response: null
      };

      if(trial.require_movement){
        display_element.querySelector('#jspsych-table-slider-response-rt-response').addEventListener('change', function(){
          display_element.querySelector('#jspsych-table-slider-response-rt-next').disabled = false;
        })
      }

      display_element.querySelector('#jspsych-table-slider-response-rt-next').addEventListener('click', function() {
        let endTime = performance.now();
        response.rt = endTime - startTime;
        response.response = display_element.querySelector('#jspsych-table-slider-response-rt-response').value;

        if (trial.response_ends_trial) {
          end_trial();
        } else {
          display_element.querySelector('#jspsych-table-slider-response-rt-next').disabled = true;
        }
      });

      const end_trial = () => {
        this.jsPsych.pluginAPI.clearAllTimeouts();

        let trialdata = {
          stimulus: trial.stimulus,
          top_stimulus: trial.stimulus.slice(0, 4),
          bottom_stimulus: trial.stimulus.slice(4),
          rt: response.rt,
          rating: response.response,
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
          subject: trial.subject
        };

        display_element.innerHTML = '';
        this.jsPsych.finishTrial(trialdata);
      };

      if (trial.stimulus_duration !== null) {
        this.jsPsych.pluginAPI.setTimeout(() => {
          display_element.querySelector('#jspsych-table-slider-response-rt-stimulus').style.visibility = 'hidden';
        }, trial.stimulus_duration);
      }

      if (trial.trial_duration !== null) {
        this.jsPsych.pluginAPI.setTimeout(() => {
          end_trial();
        }, trial.trial_duration);
      }

      let startTime = performance.now();
    }
  }

  GameBeliefRTTableSliderResponsePlugin.info = info;

  return GameBeliefRTTableSliderResponsePlugin;
})(jsPsychModule);
