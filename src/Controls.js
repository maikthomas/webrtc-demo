import React from 'react';
import { hot } from 'react-hot-loader/root';
import { IconButton } from '@material-ui/core';
import MicOffIcon from '@material-ui/icons/MicOff';
import MicIcon from '@material-ui/icons/Mic';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  control: {
    position: 'absolute',
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '400px',
    height: '110px',
    left: '50%',
    margin: '0 0 0 -150px',
  },
  icon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 65,
    width: 65,
    borderRadius: 30,
    backgroundColor: 'white',
    margin: '0 10px',
    border: '1px solid grey',
  },
});

const Controls = ({ isMuted, toggleMute, isVideoEnabled, toggleVideo }) => {
  const classes = useStyles();
  return (
    <div className={classes.control}>
      <div className={classes.icon}>
        <IconButton
          color={isMuted ? 'secondary' : 'primary'}
          aria-label="toggle-mic"
          onClick={toggleMute}
        >
          {isMuted ? (
            <MicOffIcon fontSize="large" />
          ) : (
            <MicIcon fontSize="large" />
          )}
        </IconButton>
      </div>
      <div className={classes.icon}>
        <IconButton
          color={isVideoEnabled ? 'primary' : 'secondary'}
          aria-label="toggle-mic"
          onClick={toggleVideo}
        >
          {isVideoEnabled ? (
            <VideocamIcon fontSize="large" />
          ) : (
            <VideocamOffIcon fontSize="large" />
          )}
        </IconButton>
      </div>
    </div>
  );
};

export default hot(Controls);
