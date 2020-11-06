import React from "react";
import { hot } from "react-hot-loader/root";
import Controls from "./Controls";

const localVideoStyle = {
  position: "absolute",
  top: "40px",
  left: "40px",
  width: 213,
  height: 160,
  borderRadius: 10,
  boxShadow: "0 2px 5px 3px rgba(0,0,0,0.6)",
  backgroundColor: "black",
  zIndex: 100,
};

const remoteVideoStyle = {
  position: "absolute",
  height: "100%",
  width: "100%",
};

class App extends React.Component {
  render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100vh",
          width: "100%",
          position: "relative",
        }}
      >
        <video id="localVideo" style={localVideoStyle} />
        <video id="remoteVideo" style={remoteVideoStyle} />
        <Controls />
      </div>
    );
  }
}

export default hot(App);
