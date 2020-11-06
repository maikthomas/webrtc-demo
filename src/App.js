import React from 'react';
import { hot } from 'react-hot-loader/root';
import Controls from './Controls';

const localVideoStyle = {
  position: 'absolute',
  top: '40px',
  left: '40px',
  width: 213,
  height: 160,
  borderRadius: 10,
  boxShadow: '0 2px 5px 3px rgba(0,0,0,0.6)',
  backgroundColor: 'black',
  zIndex: 100,
};

const remoteVideoStyle = {
  position: 'absolute',
  height: '100%',
  width: '100%',
};

const App = ({ eventEmitter }) => {
  const [isMuted, setIsMuted] = React.useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = React.useState(true);

  React.useEffect(() => {
    eventEmitter.on('micToggled', ({ isEnabled }) => {
      setIsMuted(!isEnabled);
    });
  }, [eventEmitter]);
  React.useEffect(() => {
    eventEmitter.on('videoToggled', ({ isEnabled }) => {
      setIsVideoEnabled(isEnabled);
    });
  }, [eventEmitter]);

  const toggleVideo = () => eventEmitter.emit('toggleVideo');
  const toggleMute = () => eventEmitter.emit('toggleMic');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100vh',
        width: '100%',
        position: 'relative',
      }}
    >
      <video id="localVideo" style={localVideoStyle} />
      <video id="remoteVideo" style={remoteVideoStyle} />
      <Controls
        toggleMute={toggleMute}
        isMuted={isMuted}
        toggleVideo={toggleVideo}
        isVideoEnabled={isVideoEnabled}
      />
    </div>
  );
};

export default hot(App);
