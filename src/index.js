import io from "socket.io-client";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

var mountNode = document.getElementById("app");
ReactDOM.render(<App />, mountNode);

const socket = io("ws://localhost:8000", {
  reconnectionDelayMax: 10000,
  query: {
    auth: "123",
  },
});

const makeCall = async (withOffer) => {
  const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };
  const localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  const peerConnection = new RTCPeerConnection(configuration);
  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  const remoteStream = new MediaStream();
  const remoteVideo = document.querySelector("#remoteVideo");
  const localVideo = document.getElementById("localVideo");
  localVideo.addEventListener("loadedmetadata", function () {
    console.log(
      `Local video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`
    );
    localVideo.play();
  });
  localVideo.srcObject = localStream;

  remoteVideo.srcObject = remoteStream;

  peerConnection.addEventListener("track", async (event) => {
    console.log("adding remote track", event.track);
    // remoteStream.addTrack(event.track, remoteStream);
    remoteVideo.srcObject = event.streams[0];
    remoteVideo.play();
  });

  peerConnection.addEventListener("icecandidate", (event) => {
    // console.log("sending ice candidate", event.candidate);
    if (event.candidate) {
      socket.emit("new-ice-candidate", event.candidate);
    }
  });
  socket.on("video-answer", (answer) => {
    const remoteDesc = new RTCSessionDescription(answer);
    peerConnection.setRemoteDescription(remoteDesc).then(() => {
      console.log("set remote");
      // console.log(answer.sdp);
    });
  });

  socket.on("video-offer", (offer) => {
    // console.log("received offer", offer);
    peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    console.log("set remote");
    // console.log(offer.sdp);
    peerConnection.createAnswer().then((answer) => {
      if (!withOffer) {
        peerConnection.setLocalDescription(answer).then(() => {
          console.log("set local");
          // console.log(answer.sdp);
          socket.emit("video-answer", answer);
        });
      }
    });
  });

  if (withOffer) {
    peerConnection.createOffer().then((offer) => {
      peerConnection.setLocalDescription(offer).then(() => {
        socket.emit("video-offer", offer);
        console.log("set local");
        // console.log(offer.sdp);
      });
    });
  }

  socket.on("new-ice-candidate", (candidate) => {
    if (candidate) {
      peerConnection.addIceCandidate(candidate).catch((e) => {
        console.error("Error adding received ice candidate", e);
      });
    }
  });

  peerConnection.addEventListener("connectionstatechange", () => {
    if (peerConnection.connectionState === "connected") {
      console.log("peers connected");
    }
  });
};

socket.on("makeCallWithOffer", () => {
  console.log("client1");
  makeCall(true);
});
socket.on("makeCallWithoutOffer", () => {
  console.log("client2");
  makeCall(false);
});
