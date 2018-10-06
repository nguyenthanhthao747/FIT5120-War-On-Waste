//This js file is for line chart.

//customize or change the default behavior of a chart
Chart.pluginService.register({
    beforeDraw: function (chart, easing) {
        if (chart.config.options.chartArea && chart.config.options.chartArea.backgroundColor) {
            var helpers = Chart.helpers;
            var ctx = chart.chart.ctx;
            var chartArea = chart.chartArea;

            ctx.save();
            ctx.fillStyle = chart.config.options.chartArea.backgroundColor;
            ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
            ctx.restore();
        }
    }
});

//define variables
var DATA = {};
var YEAR = {};

var config = {};

var line_cart_cutom = {};

//create function to load line chart
function onload_line_chart() {
    //get selected suburb from drop down list in html
    selected_suburb = $("#SuburbSelect").val();

      //get data from server
      $.ajax({
        url: "./detail/" + selected_suburb + "/",
        success: function(the_json){
          DATA = the_json;

          //match server's data with selected suburb
          DATA.data.area = selected_suburb;
          //config for the line chart
          config = {
              //define the chart type
              type: 'line',
              //define data for chart
              data: {
                  labels: DATA.data.year,
                  datasets: [{
                      label: 'Timber',
                      backgroundColor: 'rgb(255, 99, 132)',
                      borderColor: 'rgb(255, 99, 132)',
                      data: DATA.data.timber,
                      fill: false,
                  }, {
                      label: 'Plasterboard',
                      fill: false,
                      backgroundColor: 'rgb(98, 223, 255)',
                      borderColor: 'rgb(98, 223, 255)',
                      data: DATA.data.plasterboard,
                  }, {
                      label: 'Concrete',
                      fill: false,
                      backgroundColor: 'rgb(205, 97, 255)',
                      borderColor: 'rgb(205, 97, 255)',
                      data: DATA.data.concrete,
                  }, {
                      label: 'Bricks',
                      fill: false,
                      backgroundColor: 'rgb(63, 132, 63)',
                      borderColor: 'rgb(63, 132, 63)',
                      data: DATA.data.bricks,
                  }, {
                      label: 'Tiles',
                      fill: false,
                      backgroundColor: 'rgb(242, 242, 26)',
                      borderColor: 'rgb(242, 242, 26)',
                      data: DATA.data.tiles,
                  }]
              },
                  //define some custom options for the line chart
                  options: {
                      chartArea: {
                          backgroundColor: '#ffffff',
                      },
                      responsive: true,
                      tooltips: {
                          mode: 'index',
                          intersect: false,
                      },
                      hover: {
                          mode: 'nearest',
                          intersect: true
                      },
                      scales: {
                          xAxes: [{
                              display: true,
                              scaleLineColor: 'rgb(179, 242, 237)',
                              scaleLabel: {
                                  display: true,
                                  labelString: 'Year'
                              }
                          }],
                          yAxes: [{
                              display: true,
                              scaleLineColor: 'rgb(179, 242, 237)',
                              scaleLabel: {
                                  display: true,
                                  labelString: 'Tonnes of Waste'
                              }
                          }]
                      }
                  }
              };

              $('#graph-container').html("");
              $('#graph-container').append('<canvas id="canvas"><canvas>');

            var ctx = canvas = document.querySelector('#canvas').getContext('2d');
            line_cart_cutom = new Chart(ctx, config);
        }
      });
}

//function for loading line chart after change
function onchange_line_chart() {
    //get selected suburb from drop down list in html
    selected_suburb = $("#SuburbSelect").val();

    //match server data with selected suburb
    DATA.data.area = selected_suburb;

      $.ajax({
        url: "./detail/" + selected_suburb,
        success: function(the_json){
          DATA = the_json;

          console.log(line_cart_cutom.data.labels);
          line_cart_cutom.data.labels.pop();

          line_cart_cutom.data.labels = DATA.data.year;
          console.log(line_cart_cutom.data.labels);

          line_cart_cutom.data.datasets.forEach((dataset) => {
              // console.log(dataset.data);
              dataset.data.pop();
          });

          line_cart_cutom.data.datasets = [{
              label: 'Timber',
              backgroundColor: 'rgb(255, 99, 132)',
              borderColor: 'rgb(255, 99, 132)',
              data: DATA.data.timber,
              fill: false,
          }, {
              label: 'Plasterboard',
              fill: false,
              backgroundColor: 'rgb(98, 223, 255)',
              borderColor: 'rgb(98, 223, 255)',
              data: DATA.data.plasterboard,
          }, {
              label: 'Concrete',
              fill: false,
              backgroundColor: 'rgb(205, 97, 255)',
              borderColor: 'rgb(205, 97, 255)',
              data: DATA.data.concrete,
          }, {
              label: 'Bricks',
              fill: false,
              backgroundColor: 'rgb(63, 132, 63)',
              borderColor: 'rgb(63, 132, 63)',
              data: DATA.data.bricks,
          }, {
              label: 'Tiles',
              fill: false,
              backgroundColor: 'rgb(242, 242, 26)',
              borderColor: 'rgb(242, 242, 26)',
              data: DATA.data.tiles,
          }];

          // line_cart_cutom.data = {};

          line_cart_cutom.update();
        }
      });
}

$(document).ready(function() {
    console.log( "ready!" );

      onload_line_chart();

      $( "#SuburbSelect" ).change(function() {
        onchange_line_chart();
      });
});
