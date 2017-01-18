const expect = require('expect');

var {generateMessage, generateLocationMessage} = require ('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var from = 'Jen';
    var text = 'hello';
    var message = generateMessage(from, text);
    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({from, text});
  })

  it('should generate correct location message object', () => {
    var from = 'Jen';
    var lat = 34.0194775;
    var lng = -118.288977;
    var url = `https://www.google.com/maps?q=${lat},${lng}`;
    var message = generateLocationMessage(from, lat, lng);
    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({from, url});
  })
})