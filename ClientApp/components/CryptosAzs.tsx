import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';
import * as AzSearch from 'azsearch.js';

export class CryptosAzs extends React.Component<RouteComponentProps<{}>, any> {
    public render() {
        let contents = CryptosAzs.renderSearchContainer();

        return <div>
            <h1>Crypto tweets</h1>
            <p>This component demonstrates fetching data from search index.</p>
            { contents }
        </div>;
    }

    private static renderSearchContainer() {
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
        const automagic = new AzSearch.Automagic({ index: "azuresql-index4", queryKey: "5CB4F66981AE3365107F0D665FC063F0", service: "cryptosearch" });
        // const resultTemplate =
        //     `<div>
        //         <h4>{{{Crypto}}}: {{{Sentiment}}}</h4>
        //         <div class="resultDescription">
        //             {{{Text}}}
        //         </div>
        //     </div>`;

        automagic.addResults("results", 
                            { 
                                count: true,
                                // highlight: "Crypto,Text",
                                // highlightPreTag: "<span style=\"background-color: yellow\">",
                                // highlightPostTag: "</span>"
                            },
                            // resultTemplate
                        );

        // const resultsProcessor = (results: any) => {
        //     return results.map((result: any) => {
        //         const highlights = result['@search.highlights'];
        //         result.HighlightedCrypto = (highlights && highlights.Crypto) ? highlights.Crypto.join(' ') : result.Crypto;
        //         result.HighlightedText = (highlights && highlights.Text) ? highlights.Text.join(' ') : result.Text;
        //         return result;
        //     });
        // };
        
        // automagic.store.setResultsProcessor(resultsProcessor);

        automagic.addPager("pager");
        
        // const suggestionsProcessor = (suggestions: any[]) => {
        //     return suggestions.map(suggestion => {
        //         suggestion.searchText = suggestion["@search.text"];
        //         return suggestion;
        //     });
        // };
        // automagic.store.setSuggestionsProcessor(suggestionsProcessor);
        // const suggestionsTemplate = "{{{searchText}}}";
        automagic.addSearchBox("searchBox",
            {
                highlightPreTag: "<b>",
                highlightPostTag: "</b>",
                suggesterName: "sg",
                top: 10
            },
            //"searchText",
            // suggestionsTemplate
        );

        automagic.addCheckboxFacet("SentimentFacet", "Sentiment", "string");
        automagic.addCheckboxFacet("CryptoFacet", "Crypto", "string");
    }
}
