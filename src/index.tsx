import React, { VFC } from "react";
import ReactDOM from "react-dom";
import './styles/index.scss';
import Clock from "src/components/organisms/Clock";
import Weather from "src/components/organisms/Weather";
import TrainTimeTable from "./components/organisms/TraionTimeTable";

const Index: VFC = () => (
  <div className="text-white">
    <div className="flex items-top justify-between">
      <div>
        <Clock />
        <TrainTimeTable />
      </div>
      <Weather />
    </div>
  </div>
);

ReactDOM.render(<Index />, document.getElementById("index"));
