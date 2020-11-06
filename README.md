# webrtc-demo

![Demo Image](/example.png)
A simple project to demo a 1:1 video call with WebRTC.
Consisting of:

- Frontend with React
  Losely following the steps described here: https://webrtc.org/getting-started/overview
- A barebones signalling server in node using socket.io
  Implementing the flow described in this MDN doc: https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling#Signaling_transaction_flow

Considerations:

- The app only allows 1:1 communication between two peers, and will ignore any further client connections.
- When the first two clients connect, they are assigned a role, client1 or client2.
- In the frontend, the connection logic is different for client1 and client2 (client1 makes the offer, client2 responds etc)
- The signalling server has no persistence or retry logic for the offers, it just passes the message to the other client
- This demo does not handle any reconnection, disconnection or other real world cal logic

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
