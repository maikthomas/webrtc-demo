import io from "socket.io-client";

export const openSocket = () => {
  const socket = io("ws://localhost:8000", {
    reconnectionDelayMax: 10000,
    query: {
      auth: "123",
    },
  });
  return socket;
};
