import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Cryptos } from './components/Cryptos';
import { Counter } from './components/Counter';
import { CryptosAzs } from './components/CryptosAzs';
import { CryptosCharts } from './components/CryptosCharts';

export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route path='/counter' component={ Counter } />
    <Route path='/cryptos' component={ Cryptos } />
    <Route path='/cryptoscharts' component={ CryptosCharts } />
    <Route path='/cryptosazs' component={ CryptosAzs } />
</Layout>;
