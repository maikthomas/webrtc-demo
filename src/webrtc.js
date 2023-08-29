import {
  BlurRadius,
  createVonageMediaProcessor,
} from '@vonage/ml-transformers';

const toggleAudio = (stream, eventEmitter) => () => {
  if (!stream) {
    console.error('stream not available');
    return;
  }
  const newEnabledState = !stream.getAudioTracks()[0].enabled;
  stream.getAudioTracks()[0].enabled = newEnabledState;

  eventEmitter.emit('micToggled', {
    isEnabled: newEnabledState,
  });
};

const toggleVideo = (stream, eventEmitter) => () => {
  if (!stream) {
    console.error('stream not available');
    return;
  }
  const newEnabledState = !stream.getVideoTracks()[0].enabled;
  stream.getVideoTracks()[0].enabled = newEnabledState;

  eventEmitter.emit('videoToggled', {
    isEnabled: newEnabledState,
  });
};

const initLocalVideo = async () => {
  const localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  const localVideo = document.getElementById('localVideo');
  localVideo.autoplay = true;
  localVideo.muted = true;
  localVideo.srcObject = localStream;

  return {
    localVideo,
    localStream,
  };
};

const initRemoteVideo = () => {
  const remoteStream = new MediaStream();
  const remoteVideo = document.querySelector('#remoteVideo');
  remoteVideo.srcObject = remoteStream;
  return { remoteStream, remoteVideo };
};

export const start = async (socket, eventEmitter) => {
  const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };
  const { localStream } = await initLocalVideo();
  eventEmitter.on('toggleMic', toggleAudio(localStream, eventEmitter));
  eventEmitter.on('toggleVideo', toggleVideo(localStream, eventEmitter));

  const peerConnection = new RTCPeerConnection(configuration);
  const config = {
    transformerType: 'BackgroundBlur',
    radius: BlurRadius.High,
  };
  const processor = await createVonageMediaProcessor(config);
  const connector = processor.getConnector();

  const [videoTrack] = localStream.getVideoTracks();
  // const [audioTrack] = localStream.getAudioTracks();

  const newVideoTrack = await connector.setTrack(videoTrack);
  localStream.removeTrack(videoTrack);
  localStream.addTrack(newVideoTrack);

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
    // peerConnection.addTrack(audioTrack, localStream);
    // peerConnection.addTrack(newVideoTrack, localStream);
  });

  socket.on('new-ice-candidate', (candidate) => {
    if (candidate) {
      peerConnection.addIceCandidate(candidate).catch((e) => {
        console.error('Error adding received ice candidate', e);
      });
    }
  });

  const startCallAsClient1 = async () => {
    console.log('starting call as 1');
    const { remoteVideo } = initRemoteVideo();
    peerConnection.addEventListener('track', async (event) => {
      // remoteStream.addTrack(event.track, remoteStream);
      remoteVideo.srcObject = event.streams[0];
      remoteVideo.autoplay = true;
    });

    peerConnection.addEventListener('icecandidate', (event) => {
      if (event.candidate) {
        socket.emit('new-ice-candidate', event.candidate);
      }
    });
    socket.on('video-answer', (answer) => {
      const remoteDesc = new RTCSessionDescription(answer);
      peerConnection.setRemoteDescription(remoteDesc).then(() => {
        console.log('set remote');
      });
    });

    peerConnection.createOffer().then((offer) => {
      peerConnection.setLocalDescription(offer).then(() => {
        socket.emit('video-offer', offer);
        console.log('set local');
      });
    });
  };

  const startCallAsClient2 = async () => {
    const { remoteVideo } = initRemoteVideo();
    peerConnection.addEventListener('track', async (event) => {
      console.log('adding remote track', event.track);
      // remoteStream.addTrack(event.track, remoteStream);
      remoteVideo.srcObject = event.streams[0];
      remoteVideo.autoplay = true;
    });

    peerConnection.addEventListener('icecandidate', (event) => {
      if (event.candidate) {
        socket.emit('new-ice-candidate', event.candidate);
      }
    });
    socket.on('video-answer', (answer) => {
      const remoteDesc = new RTCSessionDescription(answer);
      peerConnection.setRemoteDescription(remoteDesc).then(() => {
        console.log('set remote');
      });
    });

    socket.on('video-offer', (offer) => {
      peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      console.log('set remote');
      peerConnection.createAnswer().then((answer) => {
        peerConnection.setLocalDescription(answer).then(() => {
          console.log('set local');
          socket.emit('video-answer', answer);
        });
      });
    });
  };

  console.log('add clients ready event');

  socket.on('clientsReady', (client) => {
    console.log('receive clients ready event');
    if (client === 'client1') {
      startCallAsClient1();
    } else if (client === 'client2') {
      startCallAsClient2();
    }
  });

  setTimeout(() => {
    console.log('send client ready');
    socket.emit('client-ready', 'empty');
  }, 5000);
};
