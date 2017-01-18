  var socket = io();
  socket.on('connect', () => {
    console.log('connected to server');
  });

  socket.on('disconnect', () => {
    console.log('disconnected from server');
  });
 
  socket.on('newMessage', (message) => {
    console.log('got new message:', message);
    var li = $('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    $('#messages').append(li);
  });
  
  

  $('#message-form').on('submit', (e) => {
    e.preventDefault();
    socket.emit('createMessage', {
      from: 'User',
      text: $('[name=message]').val()
    }, (data) => {
      console.log('Got it', data);
    });
  })

