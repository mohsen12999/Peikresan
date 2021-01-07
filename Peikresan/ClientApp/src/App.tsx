import * as React from 'react';
import { Route } from 'react-router';
import Layout from './_component/Layout';
import Home from './_component/Home';
import Counter from './_component/Counter';
import FetchData from './_component/FetchData';

import './custom.css'

export default () => (
    <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/counter' component={Counter} />
        <Route path='/fetch-data/:startDateIndex?' component={FetchData} />
    </Layout>
);
