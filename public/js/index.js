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

socket.on('newLocationMessage', (message) => {
  console.log('got new location message:', message);
  var li = $('<li></li>');
  li.html(`${message.from}: <a href='${message.url}' target='_blank'> My Location </a>`);
  $('#messages').append(li);
});
  
  
$('#message-form').on('submit', e => e.preventDefault());
$('#send-message').on('click', (e) => {
  var input = $('[name=message]');
  if (input.val().trim().length === 0) return alert('Message cannot be empty');
  socket.emit('createMessage', {
    from: 'User',
    text: input.val()
  }, (data) => {
    console.log('Got it', data);
    input.val('');
  });
});

var locationButton = $('#send-location');
locationButton.on('click', (e) => {
  if(!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }
  locationButton.attr('disabled', 'disabled').text('Sending location ...');
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('createLocationMessage', {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    })
    locationButton.removeAttr('disabled').text('Sending location');
  }, () => {
    return alert('Unable to fetch location');
  })
})
