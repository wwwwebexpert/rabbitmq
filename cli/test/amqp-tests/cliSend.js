var amqp = require('amqplib/callback_api');
var fakeAmqp = require('exp-fake-amqplib');
var proxyquire = require('proxyquire');
proxyquire("exp-amqp-connection", {
  "amqplib/callback_api": fakeAmqp
});

var servReceive = require('./servReceive');

let operationType = ['greater_than', 'less_than', 'equals'];
let type = ['GET','POST'];

module.exports.testSendReceive = (cb) => {
  amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    if(err){
      return cb(err);
    }
    var messageQueue = 'db-message';
    var responseQueue = 'response-message';
    ch.assertQueue(messageQueue, {durable: false});
    ch.assertQueue(responseQueue, { durable: false });

    let num = 10;
    var requestType = 'POST';
    let message = JSON.stringify({num, requestType});
    console.log("SendReceive : message : ", message);
    ch.sendToQueue(messageQueue, new Buffer(message));

    ch.consume(responseQueue, function(msg) {
    console.log("SendReceive : Inside Consume");
    let message = JSON.parse(msg.content.toString());
    if(message.value === 10){
      cb(null,message);
    }else{
      cb("Sent and Received Values do not match");
    }
    }, {noAck: true});
  });
});
};