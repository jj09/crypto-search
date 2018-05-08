import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';
import { Line } from 'react-chartjs-2';
import * as _ from 'lodash';

interface CryptosChartsState {
    data: any;
    loading: boolean;
}

interface StringMap<T> {
    [x: string]: T;
}

const cryptoColors: StringMap<string> = {
    cardano: 'rgba(75,192,192,1)',
    iota: 'rgba(75,75,192,1)',
    monero: 'rgba(75,192,75,1)',
    xrp: 'rgba(75,75,75,1)',
    xlm: 'rgba(192,192,192,1)',
    litecoin: 'rgba(255,255,192,1)',
    ethereum: 'rgba(0,0,255,1)',
    eos: 'rgba(255,0,0,1)',
    bitcoin: 'rgba(255,0,255,1)',
    neo: 'rgba(0,192,192,1)',
};

export class CryptosCharts extends React.Component<RouteComponentProps<{}>, CryptosChartsState> {
    constructor() {
        super();
        this.state = { data: [], loading: true };

        fetch('api/Cryptos/TweetsAvg')
            .then(response => response.json() as Promise<any>)
            .then(result => {
                this.setState({ data: result, loading: false });
            });
    }

    public render() {
        let contents = this.state.loading
            ? <p><img src="loading.gif" /></p>
            : CryptosCharts.renderChart(this.state.data);

        return <div>
            <h1>Crypto charts</h1>
            <p>Avgerage sentiment for cryptos</p>
            { contents }
        </div>;
    }

    private static renderChart(data: any) {
        const chartData = {
            labels: _.uniq(data.map((x: any) => x.date)) as string[],
            datasets: []
        };

        const dict: any = {};

        data.forEach((row: any) => {
            if (!dict[row.crypto]) {
                dict[row.crypto] = {};
            }
            dict[row.crypto][row.date] = row.sentiment;
        });

        for(let crypto in dict) {
            const dataset = {
                label: crypto,
                fill: false,
                lineTension: 0.1,
                backgroundColor: cryptoColors[crypto],
                borderColor: cryptoColors[crypto],
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: cryptoColors[crypto],
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: cryptoColors[crypto],
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: []
            };

            for(let date of chartData.labels) {
                dataset.data.push(dict[crypto][date] as never);
            }           

            chartData.datasets.push(dataset as never);
        }

        chartData.labels = chartData.labels.map((label: string) => label.substring(5,5).replace('-','/'));

        return <Line data={chartData} />;
    }
}
