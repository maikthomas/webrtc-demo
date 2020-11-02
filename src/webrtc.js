const initLocalVideo = async () => {
  const localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  const localVideo = document.getElementById("localVideo");

  localVideo.srcObject = localStream;
  localVideo.addEventListener("loadedmetadata", function () {
    localVideo.play();
  });

  return {
    localVideo,
    localStream,
  };
};

const initRemoteVideo = () => {
  const remoteStream = new MediaStream();
  const remoteVideo = document.querySelector("#remoteVideo");
  remoteVideo.srcObject = remoteStream;
  return { remoteStream, remoteVideo };
};

export const start = async (socket) => {
  const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };
  const { localStream } = await initLocalVideo();

  const peerConnection = new RTCPeerConnection(configuration);

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  socket.on("new-ice-candidate", (candidate) => {
    if (candidate) {
      peerConnection.addIceCandidate(candidate).catch((e) => {
        console.error("Error adding received ice candidate", e);
      });
    }
  });

  const startCallAsClient1 = async () => {
    const { remoteVideo } = initRemoteVideo();
    peerConnection.addEventListener("track", async (event) => {
      // remoteStream.addTrack(event.track, remoteStream);
      remoteVideo.srcObject = event.streams[0];
      remoteVideo.play();
    });

    peerConnection.addEventListener("icecandidate", (event) => {
      if (event.candidate) {
        socket.emit("new-ice-candidate", event.candidate);
      }
    });
    socket.on("video-answer", (answer) => {
      const remoteDesc = new RTCSessionDescription(answer);
      peerConnection.setRemoteDescription(remoteDesc).then(() => {
        console.log("set remote");
      });
    });

    peerConnection.createOffer().then((offer) => {
      peerConnection.setLocalDescription(offer).then(() => {
        socket.emit("video-offer", offer);
        console.log("set local");
      });
    });
  };

  const startCallAsClient2 = async () => {
    const { remoteVideo } = initRemoteVideo();
    peerConnection.addEventListener("track", async (event) => {
      console.log("adding remote track", event.track);
      // remoteStream.addTrack(event.track, remoteStream);
      remoteVideo.srcObject = event.streams[0];
      remoteVideo.play();
    });

    peerConnection.addEventListener("icecandidate", (event) => {
      if (event.candidate) {
        socket.emit("new-ice-candidate", event.candidate);
      }
    });
    socket.on("video-answer", (answer) => {
      const remoteDesc = new RTCSessionDescription(answer);
      peerConnection.setRemoteDescription(remoteDesc).then(() => {
        console.log("set remote");
      });
    });

    socket.on("video-offer", (offer) => {
      peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      console.log("set remote");
      peerConnection.createAnswer().then((answer) => {
        peerConnection.setLocalDescription(answer).then(() => {
          console.log("set local");
          socket.emit("video-answer", answer);
        });
      });
    });
  };

  socket.on("clientsReady", (client) => {
    if (client === "client1") {
      startCallAsClient1();
    } else if (client === "client2") {
      startCallAsClient2();
    }
  });
};
