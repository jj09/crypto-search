import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';
import * as AzSearch from 'azsearch.js';

interface CryptosExampleState {
    cryptos: Crypto[];
    loading: boolean;
}

export class CryptosAzs extends React.Component<RouteComponentProps<{}>, CryptosExampleState> {
    constructor() {
        super();
        this.state = { cryptos: [], loading: true };        
    }

    public render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : CryptosAzs.renderCryptosTable(this.state.cryptos);

        return <div>
            <h1>Crypto tweets</h1>
            <p>This component demonstrates fetching data from search index.</p>
            { contents }
        </div>;
    }

    private static renderCryptosTable(cryptos: Crypto[]) {
        return <div id="app">
            <div className="container-fluid">
                <div className="row">
                    <div id="searchBox" className="col-mid-8 col-sm-8 col-xs-6 col-sm-offset-4"></div>
                </div>
                <div className="row">
                    <div id="facetPanel" className="col-sm-3 col-md-3 sidebar collapse">
                        <ul className="nav nav-sidebar">
                            <div className="panel panel-primary behclick-panel">
                                
                                <li>
                                    <div id="CryptoFacet">
                                    </div>
                                </li>

                                <li>
                                    <div id="SentimentFacet">
                                    </div>
                                </li>
                            </div>
                        </ul>
                    </div>
                    <div className="col-sm-9 col-sm-offset-3 col-md-9 col-md-offset-3 results_section">
                        <div id="results" className="row placeholders">
                        </div>
                        <div id="pager" className="row">
                        </div>
                    </div>
                </div>            
            </div>
        </div>;
    }

    public componentDidMount() {
        fetch('api/Cryptos/Tweets')
            .then(response => response.json() as Promise<Crypto[]>)
            .then(data => {
                this.setState({ cryptos: data, loading: false });
            })
            .then(() => {
                var automagic = new AzSearch.Automagic({ index: "azuresql-index4", queryKey: "5CB4F66981AE3365107F0D665FC063F0", service: "cryptosearch" });
                automagic.addResults("results", { count: true });
                automagic.addPager("pager");
                
                automagic.addSearchBox("searchBox",
                    {
                        highlightPreTag: "<b>",
                        highlightPostTag: "</b>",
                        suggesterName: "sg"
                    });
                automagic.addCheckboxFacet("SentimentFacet", "Sentiment", "string");
                automagic.addCheckboxFacet("CryptoFacet", "Crypto", "string");
            });
    }
}