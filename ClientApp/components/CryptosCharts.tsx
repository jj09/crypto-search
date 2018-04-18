import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';
import { Chart } from 'chart.js';

interface CryptosExampleState {
    cryptos: Crypto[];
    loading: boolean;
}

const cryptoSymbols = [
    "cardano",
    "iota",
    "eor",
    "xrp",
    "xlm",
    "litecoin",
    "ethereum",
    "eos",
    "bitcoin",
    "neo",
]

export class CryptosCharts extends React.Component<RouteComponentProps<{}>, any> {
    constructor() {
        super();
        this.state = { cryptos: [], loading: true };        
    }

    public render() {
        return <div>
            <h1>Crypto charts</h1>
            <p>Avgerage sentiment and price</p>
            <div id="visualisation">
                <canvas id="canvas"></canvas>
            </div>
        </div>;
    }

    public componentDidMount() {
        fetch('api/Cryptos/TweetsAvg')
            .then(response => {
                let avgs = response.json();

                return avgs;
            })
            .then(result => {
                //this.setState({ cryptos: data, loading: false });
                for(let crypto in result) {
                    console.log(crypto);
        
                    let data = [];

                    let dateAndSentiment = result[crypto];
        
                    for(let date in dateAndSentiment) {
                        data.push({
                            price: dateAndSentiment[date],
                            date: new Date(date)
                        });
                    }
        
                    CryptosCharts.drawChart(data, crypto);
                    return;
                }
            });        
    }

    private static drawChart(data: any, crypto: any) {
        const chartColors = {
            red: 'rgb(255, 99, 132)',
            orange: 'rgb(255, 159, 64)',
            yellow: 'rgb(255, 205, 86)',
            green: 'rgb(75, 192, 192)',
            blue: 'rgb(54, 162, 235)',
            purple: 'rgb(153, 102, 255)',
            grey: 'rgb(201, 203, 207)'
        };
      
              var config = {
                  type: 'line',
                  data: {
                      labels: [
                new Date("2018-04-12").toISOString().substring(5,10).replace('-','/'), 
                new Date("2018-04-17").toISOString().substring(5,10).replace('-','/'), 
                new Date("2018-04-18").toISOString().substring(5,10).replace('-','/'), 
                new Date("2018-04-19").toISOString().substring(5,10).replace('-','/'), 
                new Date("2018-05-12").toISOString().substring(5,10).replace('-','/'), 
                new Date("2018-05-13").toISOString().substring(5,10).replace('-','/')
              ],
                      datasets: [{
                          label: 'BTC',
                          backgroundColor: chartColors.red,
                          borderColor: chartColors.red,
                          data: [
                              0.45,
                              0.435,
                              0.235,
                  0.4325,
                  0.15,
                  0.925,
                          ],
                          fill: false,
                      }, {
                          label: 'ETH',
                          fill: false,
                          backgroundColor: chartColors.blue,
                          borderColor: chartColors.blue,
                          data: [
                              0.145,
                              0.2435,
                              0.3235,
                  0.4325,
                  0.915,
                  0.1925,
                          ],
                      }]
                  },
                  options: {
                      responsive: true,
                      title: {
                          display: true,
                          text: 'Sentiment for crypto currencies'
                      },
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
                              scaleLabel: {
                                  display: true,
                                  labelString: 'date'
                              }
                          }],
                          yAxes: [{
                              display: true,
                              scaleLabel: {
                                  display: true,
                                  labelString: 'sentiment'
                              }
                          }]
                      }
                  }
              };
      
              window.onload = function() {
                  var ctx = (document.getElementById('canvas') as any).getContext('2d');
                  let chart = new Chart(ctx, config);
              };
    }

    // private static drawChart(data: any, crypto: any) {
    //     let vis = d3.select("#visualisation");
    //     const WIDTH = 600;
    //     const HEIGHT = 500;
    //     const MARGINS = {
    //         top: 20,
    //         right: 20,
    //         bottom: 20,
    //         left: 50
    //       };
    //     let xScale = d3.time.scale()
    //       .range([MARGINS.left, WIDTH - MARGINS.right])
    //       .domain(d3.extent(data, function(d: any) { return d.date; }));
    
    //     let yScale = d3.scale.linear()
    //       .range([HEIGHT - MARGINS.top, MARGINS.bottom])
    //       .domain(d3.extent(data, function(d: any) { return d.price; }));
    
    //     let xAxis = d3.svg.axis()
    //       .scale(xScale)
    //       .orient("bottom")
    //       .innerTickSize(-HEIGHT)
    //       .outerTickSize(0)
    //       .ticks(5)
    //       .tickPadding(10);
    
    //     let yAxis = d3.svg.axis()
    //       .scale(yScale)
    //       .orient("left")
    //       .innerTickSize(-WIDTH)
    //       .outerTickSize(0)
    //       .tickPadding(10);
    
    //     let yGrid = d3.svg.axis()
    //       .scale(yScale)
    //       .orient("left")
    //       .tickSize(-(WIDTH-MARGINS.left-MARGINS.right), 0)
    //       .tickFormat("")
    //       .tickPadding(50)
    //       .ticks(5);
        
    //     vis.append("svg:g")
    //         .attr("class", "x axis")
    //         .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
    //         .style('fill', '#888888')
    //         .call(xAxis);
    
    //     vis.append("svg:g")
    //         .attr("class", "y axis")
    //         .attr("transform", "translate(" + (MARGINS.left) + ",0)")
    //         .style('fill', '#888888')
    //         .call(yAxis);
    
    //     vis.append("svg:g")
    //         .attr("class", "y axis")
    //         .attr("class", "grid")
    //         .attr("transform", "translate(" + (MARGINS.left) + ",0)")
    //         .style('fill', '#888888')
    //         .call(yGrid);
    
    //     let lineGen = d3.svg.line()
    //         .x(function(d: any) {
    //             return xScale(d.date);
    //         })
    //         .y(function(d: any) {
    //             return yScale(d.price);
    //         })
    //         .interpolate("none");
    
    //     vis.append('svg:path')
    //         .datum(data)
    //         .attr("class", "line")
    //         .attr("d", lineGen)
    //         .attr('stroke', '#2A9FD6')
    //         .attr('stroke-width', 1)
    //         .attr('fill', 'none');
    //   }
}

interface Crypto {
    id: number;
    date: string;
    text: number;
    sentiment: number;
    crypto: string;
}
