import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { openSocket } from "./signalling";
import { start } from "./webrtc";

var mountNode = document.getElementById("app");
ReactDOM.render(<App />, mountNode);

start(openSocket());
