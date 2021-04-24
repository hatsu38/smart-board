import React, { VFC } from "react";
import ReactDOM from "react-dom";
import './styles/index.scss';
import Clock from "src/components/organisms/Clock";

const Index: VFC = () => (
  <div className="text-white">
    <Clock />
  </div>
);

ReactDOM.render(<Index />, document.getElementById("index"));
