const express = require('express');
const path = require('path');
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http, {
  path: '/signalling',
  origins: '*:*',
});

app.use('/public', express.static(path.join(__dirname, 'dist/public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});

const clients = {
  client1: {
    ready: false,
    socket: null,
  },
  client2: {
    ready: false,
    socket: null,
  },
};

const getOtherClientSocket = (id) => {
  if (clients.client1.socket?.id === id) {
    return clients.client2.socket;
  }
  return clients.client1.socket;
};

const getOtherSessionId = (id) => {
  const otherId = getOtherClientSocket(id)?.id;
  console.log('otherId', otherId);
  return otherId;
};

const sendClientsReadyEvent = () => {
  console.log('sending clientsReady');
  io.to(clients.client1.socket.id).emit('clientsReady', 'client1');
  io.to(clients.client2.socket.id).emit('clientsReady', 'client2');
};

io.on('connection', (socket) => {
  let clientId = '';
  console.log('a user connected:', socket.id);
  if (!clients.client1.socket) {
    console.log('client 1 connected');
    clientId = 'client1';
    clients[clientId].socket = socket;
  } else if (!clients.client2.socket) {
    console.log('client 2 connected');
    clientId = 'client2';
    clients[clientId].socket = socket;
    // setTimeout(() => sendClientsReadyEvent(), 3000);
  } else {
    return;
  }

  socket.on('client-ready', () => {
    console.log('received client ready');
    clients[clientId].ready = true;
    if (
      clients.client1.ready &&
      clients.client2.ready &&
      getOtherClientSocket(socket.id)
    ) {
      sendClientsReadyEvent();
    }
  });

  socket.on('video-offer', (message) => {
    console.log('received video offer');
    io.to(getOtherSessionId(socket.id)).emit('video-offer', message);
  });
  socket.on('video-answer', (message) => {
    console.log(message);
    io.to(getOtherSessionId(socket.id)).emit('video-answer', message);
  });
  socket.on('new-ice-candidate', (message) => {
    console.log(message);
    io.to(getOtherSessionId(socket.id)).emit('new-ice-candidate', message);
  });

  socket.on('disconnect', () => {
    clients[clientId] = {
      socket: null,
      ready: false,
    };
  });
});

const port = process.env.PORT || 8000;
http.listen(port, () => {
  console.log(`listening on *:${port}`);
});
