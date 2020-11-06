import React from "react";
import { hot } from "react-hot-loader/root";
import MicOffIcon from "@material-ui/icons/MicOff";
import MicIcon from "@material-ui/icons/Mic";
import CallIcon from "@material-ui/icons/Call";
import CallEndIcon from "@material-ui/icons/CallEnd";

const controlStyle = {
  position: "absolute",
  bottom: 0,
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  width: "400px",
  height: "110px",
  left: "50%",
  margin: "0 0 0 -150px",
};

const iconStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: 65,
  width: 65,
  borderRadius: 30,
  backgroundColor: "white",
  margin: "0 10px",
  border: "1px solid grey",
};

const Controls = () => {
  return (
    <div style={controlStyle}>
      <div style={iconStyle}>
        <MicOffIcon fontSize="large" />
      </div>
      <div style={iconStyle}>
        <MicIcon fontSize="large" />
      </div>
      <div style={iconStyle}>
        <CallIcon fontSize="large" />
      </div>
      <div style={iconStyle}>
        <CallEndIcon fontSize="large" />
      </div>
    </div>
  );
};

export default hot(Controls);
