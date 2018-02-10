import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';

interface CryptosExampleState {
    cryptos: Crypto[];
    loading: boolean;
}

export class Cryptos extends React.Component<RouteComponentProps<{}>, CryptosExampleState> {
    constructor() {
        super();
        this.state = { cryptos: [], loading: true };

        fetch('api/Cryptos/Tweets')
            .then(response => response.json() as Promise<Crypto[]>)
            .then(data => {
                this.setState({ cryptos: data, loading: false });
            });
    }

    public render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : Cryptos.renderCryptosTable(this.state.cryptos);

        return <div>
            <h1>Crypto tweets</h1>
            <p>This component demonstrates fetching data from the server.</p>
            { contents }
        </div>;
    }

    private static renderCryptosTable(cryptos: Crypto[]) {
        return <table className='table'>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Tweet</th>
                    <th>Sentiment</th>
                    <th>Crypto</th>
                </tr>
            </thead>
            <tbody>
            {cryptos.map(crypto =>
                <tr key={ crypto.id }>
                    <td>{ crypto.date }</td>
                    <td>{ crypto.text }</td>
                    <td>{ crypto.sentiment }</td>
                    <td>{ crypto.crypto }</td>
                </tr>
            )}
            </tbody>
        </table>;
    }
}

interface Crypto {
    id: number;
    date: string;
    text: number;
    sentiment: number;
    crypto: string;
}
