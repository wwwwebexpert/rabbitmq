var amqp = require('amqplib/callback_api');
var fakeAmqp = require('exp-fake-amqplib');
var proxyquire = require('proxyquire');
proxyquire("exp-amqp-connection", {
  "amqplib/callback_api": fakeAmqp
});


amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var messageQueue = 'db-message';
    var responseQueue = 'response-message';
    console.log('inside servReceive');
    ch.assertQueue(messageQueue, {durable: false});
    ch.assertQueue(responseQueue, { durable: false });
    ch.consume(messageQueue, function(msg) {
      let message = JSON.parse(msg.content.toString());
      if(message.requestType === 'POST'){
        let returnMessage = "{ value: 10 }";
        ch.sendToQueue(responseQueue, new Buffer(returnMessage.toString()));
      }
      console.log(" [x] Received %s", msg.content.toString());
    }, {noAck: true});
  });
});
