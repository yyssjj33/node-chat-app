const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http'); 

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/Users');
const publicPath = path.join(__dirname, '../public');
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (params, cb) => {
    var room = params.room;
    if (!isRealString(params.name) || !isRealString(room)) {
      return cb('Name and room name are required');
    }
    socket.join(room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, room);
    var userList = users.getUserList(room);
    io.to(room).emit('updateUserList', {userList, room});
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat App'));
    socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
    cb();
  });

  socket.on('createMessage', (message, cb) => {
    console.log('createMessage:', message);
    var user = users.getUser(socket.id);
    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    cb('This is from server');
  });

  socket.on('createLocationMessage', (coords, cb) => {
    console.log('createLocationMessage:', coords);
    var user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.lat, coords.lng));
    }
  })

  socket.on('disconnect', () => {
    console.log('disconnected from server');
    var user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
    }
  });


});

server.listen(PORT, () => {
  console.log(`server run on port ${PORT}`);
});