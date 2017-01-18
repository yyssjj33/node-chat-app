var socket = io();
var params = $.deparam(window.location.search);
function scrollToButtom() {
  var messages = $('#messages');
  var scrollHeight = messages.prop('scrollHeight');
  messages.scrollTop(scrollHeight);
}
socket.on('connect', () => {
  console.log('connected to server');
  socket.emit('join', params, (err) => {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No Err');
    }
  });
});

socket.on('disconnect', () => {
  console.log('disconnected from server');
});

socket.on('updateUserList', (usersInfo) => {
  var users = usersInfo.userList;
  var room = usersInfo.room;
  console.log('Users List:', users, room);
  var ol = $('<ol></ol>');
  users.forEach(user => {
    ol.append($('<li></li>').text(user));
  })
  $('#room-name').text(room);
  $('#users').html(ol);
})

socket.on('newMessage', (message) => {
  console.log('got new message:', message);
  var formattedTime = moment(message.createdAt).format('h:mm A');
  var template = $('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });
  $('#messages').append(html);
  scrollToButtom();
});

socket.on('newLocationMessage', (message) => {
  console.log('got new location message:', message);
  var formattedTime = moment(message.createdAt).format('h:mm A');
  var template = $('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });
  $('#messages').append(html);
  scrollToButtom();
});
  
$('#message-form').on('submit', e => e.preventDefault());
$('#send-message').on('click', (e) => {
  var input = $('[name=message]');
  if (input.val().trim().length === 0) return ;
  socket.emit('createMessage', {
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
  locationButton.attr('disabled', 'disabled').text('Sending ...');

  navigator.geolocation.getCurrentPosition((position) => {

    socket.emit('createLocationMessage', {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    })
    locationButton.removeAttr('disabled').text('Send location');
  }, (e) => {
    locationButton.removeAttr('disabled').text('Send location');
    console.log('e', e);
    return alert('Unable to fetch location');
  })
})
