import React from "react";
import { hot } from "react-hot-loader/root";

class App extends React.Component {
  render() {
    return (
      <>
        <video id="remoteVideo"></video>
        <video id="localVideo"></video>
      </>
    );
  }
}

export default hot(App);
