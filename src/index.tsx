import React, { VFC } from "react";
import ReactDOM from "react-dom";
import store from "./store";
import { Provider } from "react-redux";
import "~/styles/index.scss";

import Clock from "~/components/organisms/Clock";
import Weather from "~/components/organisms/Weather";
import TrainTimeTable from "~/components/organisms/TrainTimeTable";

const Index: VFC = () => (
  <Provider store={store}>
    <div className="text-center sm:flex items-top justify-between mx-2 sm:mt-10 sm:mx-12">
      <div>
        <Clock />
        <TrainTimeTable />
      </div>
      <Weather />
    </div>
  </Provider>
);

ReactDOM.render(<Index />, document.getElementById("index"));
