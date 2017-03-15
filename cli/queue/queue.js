var amqp = require('amqplib/callback_api');

let operationType = ['greater_than', 'less_than', 'equals'];
let type = ['GET','POST'];

amqp.connect('amqp://localhost', function(err, conn) {
  if(err){
    console.log("Error in amqplib :",err);
  }
  conn.createChannel(function(err, ch) {
    var messageQueue = 'db-message';
    var responseQueue = 'response-message';

    ch.assertQueue(messageQueue, {durable: false});
    setInterval(() => {
      //generate a random number between 1 and 100
      let num = Math.floor(Math.random() * 100) + 1;
      //get the random type
      var requestType = type[Math.floor(Math.random() * type.length)];

      if(requestType == 'GET'){
        var opType = operationType[Math.floor(Math.random() * operationType.length)];
        let message = JSON.stringify({num, requestType, opType});
        ch.sendToQueue(messageQueue, new Buffer(message));
        console.log(" [x] Sent", num, requestType, opType);
      }else{
        let message = JSON.stringify({num, requestType});
        ch.sendToQueue(messageQueue, new Buffer(message));
        console.log(" [x] Sent", num, requestType);
      }
    }, 5000);

    ch.assertQueue(responseQueue, { durable: false });

    ch.consume(responseQueue, function(msg) {
      let message = msg.content.toString();
      if(message){
        console.log(" [x] Received the response data from Serv %s", msg.content.toString());
      }else{
        console.log(" [x] Received empty response data from Serv");
      }

    }, {noAck: true});
  });
  // setTimeout(function() { conn.close(); process.exit(0) }, 500);
});
