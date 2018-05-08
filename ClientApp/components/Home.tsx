import * as React from 'react';
import { RouteComponentProps } from 'react-router';

export class Home extends React.Component<RouteComponentProps<{}>, {}> {
    private _repoLink: string;

    constructor() {
        super();
        this._repoLink = "https://github.com/jj09/crypto-search";
    }

    public render() {
        return <h1>
            <a href={this._repoLink} width="800">{this._repoLink}</a>
        </h1>;
    }
}
