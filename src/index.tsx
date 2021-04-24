import React, { VFC } from "react";
import ReactDOM from "react-dom";

const Index: VFC = () => (
  <div className="">
    <p className="">Hello React!👋</p>
  </div>
);

ReactDOM.render(<Index />, document.getElementById("index"));
