import io from 'socket.io-client';

const socket = io("ws://localhost:8000", {
  reconnectionDelayMax: 10000,
  query: {
    auth: "123"
  }
});


const constraints = {
  'video': true,
  'audio': true
}


navigator.mediaDevices.getUserMedia(constraints)
  .then(stream => {
      console.log('Got MediaStream:', stream);
  })
  .catch(error => {
      console.error('Error accessing media devices.', error);
  });


  const makeCall = (withOffer) => {
    const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
    const peerConnection = new RTCPeerConnection(configuration);

    peerConnection.addEventListener('icecandidate', event => {
      console.log(event);
    });

    peerConnection.addEventListener('icecandidate', event => {
      console.log('sending ice candidate', event.candidate);
      if (event.candidate) {
        socket.emit('new-ice-candidate', event.candidate);
      }
    });
    socket.on('video-answer', (answer) => {
      const remoteDesc = new RTCSessionDescription(answer);
      peerConnection.setRemoteDescription(remoteDesc).then(() => {
        console.log('set remote');
      })
    });

    socket.on('video-offer', (offer) => {
      console.log('received offer');
      peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      console.log('set remote');
      peerConnection.createAnswer().then(answer => {
        if (!withOffer) {
          peerConnection.setLocalDescription(answer).then(() => {
            console.log('set local');
            socket.emit('video-answer', answer);
          });
        }
      })

    });

    if (withOffer) {
      peerConnection.createOffer().then(offer => {
      peerConnection.setLocalDescription(offer).then(() => {
        socket.emit('video-offer', offer);
        console.log('set local');
      });
      });
    }



    socket.on('new-ice-candidate', candidate => {
      if (candidate) {
        peerConnection.addIceCandidate(candidate).catch((e) => {
          console.error('Error adding received ice candidate', e);
        })
      }
    });

    peerConnection.addEventListener('connectionstatechange', () => {
      if (peerConnection.connectionState === 'connected') {
        console.log('peers connected');
      }
  });

  }


  socket.on('makeCallWithOffer', () => {
    console.log('client1');
    makeCall(true)
  });
  socket.on('makeCallWithoutOffer', () => {
    console.log('client2');
    makeCall(false);
  })
