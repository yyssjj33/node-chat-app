const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http'); 

const {generateMessage, generateLocationMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat App'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

  socket.on('createMessage', (message, cb) => {
    console.log('createMessage:', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    cb('This is from server');
  });

  socket.on('createLocationMessage', (coords, cb) => {
    console.log('createLocationMessage:', coords);
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.lat, coords.lng));
  })

  socket.on('disconnect', () => {
    console.log('disconnected from server');
  });


});

server.listen(PORT, () => {
  console.log(`server run on port ${PORT}`);
});