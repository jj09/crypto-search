import * as React from 'react';
import { RouteComponentProps } from 'react-router';

export class Home extends React.Component<RouteComponentProps<{}>, {}> {
    private _qrCodeLink: string;

    constructor() {
        super();
        this._qrCodeLink = "cs-github-qrcode.png";
    }

    public render() {
        return <div>
            <img src={this._qrCodeLink} width="800" />
        </div>;
    }
}
