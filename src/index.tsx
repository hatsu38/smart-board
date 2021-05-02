import React, { VFC } from "react";
import ReactDOM from "react-dom";
import store from './store'
import { Provider } from 'react-redux'
import './styles/index.scss';

import Clock from "src/components/organisms/Clock";
import Weather from "src/components/organisms/Weather";
import TrainTimeTable from "./components/organisms/TrainTimeTable";

const Index: VFC = () => (
  <Provider store={store}>
    <div className="text-white sm:flex items-top justify-between">
      <div>
        <Clock />
        <TrainTimeTable />
      </div>
      <Weather />
    </div>
  </Provider>
);

ReactDOM.render(<Index />, document.getElementById("index"));
