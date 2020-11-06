# webrtc-demo

A simple project to demo a 1:1 video call with WebRTC.
Consisting of:

- Frontend with React
  Losely following the steps described here: https://webrtc.org/getting-started/overview
- A barebones signalling server in node using socket.io
  Implementing the flow described in this MDN doc: https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling#Signaling_transaction_flow

## Building and running on localhost

Install dependencies

```sh
yarn
```

run locally:

```sh
# In one terminal start the web app on :8080
yarn dev
```

```sh
# In another start the signalling server on :8000
yarn start
```

## Credits

Made with [createapp.dev](https://createapp.dev/)
