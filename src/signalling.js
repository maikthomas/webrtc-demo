import io from 'socket.io-client';
const host = document.location.href.split('://')[1].split('/');
// const host = "localhost:8000";
export const openSocket = () => {
  const socket = io(`ws://${host}`, {
    path: '/signalling',
    reconnectionDelayMax: 10000,
    secure: true,
  });
  return socket;
};
