var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let client1;
let client2;

const getOtherSessionId = (id) => {
  return id === client1?.id ? client2?.id : client1?.id;
}

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);
  if (!client1) {
    client1 = socket;
    setTimeout(() => socket.emit('makeCallWithOffer'), 2000);
  } else if (!client2) {
    client2 = socket;
    setTimeout(() => socket.emit('makeCallWithoutOffer'), 2000);
  } else {
    return;
  }

  socket.on('video-offer', (message) => {
    console.log(message);
    io.to(getOtherSessionId(socket.id)).emit('video-offer', message)
  })
  socket.on('video-answer', (message) => {
    console.log(message);
    io.to(getOtherSessionId(socket.id)).emit('video-answer', message)
  })
  socket.on('new-ice-candidate', (message) => {
    console.log(message);
    io.to(getOtherSessionId(socket.id)).emit('new-ice-candidate', message)
  })

  socket.on('disconnect', () => {
    if (client1 && socket.id === client1.id) {
      client1 = undefined;
    } else if (client2 && socket.id === client2.id) {
      client2 = undefined;
    }
  });

  // socket.on('')
});

http.listen(8000, () => {
  console.log('listening on *:8000');
});
