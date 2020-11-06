import io from 'socket.io-client';
const host = document.location.href.split('://')[1].split('/')[0];
const protocol =
  typeof SOCKET_PROTOCOL === 'undefined' ? 'https' : SOCKET_PROTOCOL;
const url = `${protocol}://${host}`;
export const openSocket = () => {
  const socket = io(url, {
    path: '/signalling',
    reconnectionDelayMax: 10000,
    secure: true,
  });
  return socket;
};
