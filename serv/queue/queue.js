var amqp = require('amqplib/callback_api');
let messageModel = require('../models/messages');

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var messageQueue = 'db-message';
    var responseQueue = 'response-message';

    ch.assertQueue(messageQueue, {durable: false});
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", messageQueue);
    ch.consume(messageQueue, function(msg) {
      let message = JSON.parse(msg.content.toString());
      if(message.requestType === 'POST'){
        //save the data to the db
        let saveData = new messageModel({ value : message.num });
        saveData.save(function(err, returnMessage){
          if(err){
            ch.sendToQueue(responseQueue, new Buffer(err.toString()));
          }else{
            ch.sendToQueue(responseQueue, new Buffer(returnMessage.toString()));
          }
        });
      }else if(message.requestType === 'GET'){
        //get the data from the db
        let dbOp = {};
        if(message.opType === 'greater_than'){
            dbOp.$gt = message.num;
          }else if(message.opType === 'less_than'){
            dbOp.$lt = message.num;
          }else{
            dbOp.$eq = message.num;
          }
        messageModel.find({ value: dbOp }, function(err, messages){
          if(err){
            console.log(err);
            ch.sendToQueue(responseQueue, new Buffer(err.toString()));
          }else{
            console.log(messages);
            ch.sendToQueue(responseQueue, new Buffer(messages.toString()));
          }
        });

      }else{
        //wrong requestType
        let errMessage = 'Wrong requestType';
        ch.sendToQueue(responseQueue, new Buffer(errMessage));
      }
      console.log(" [x] Received %s", msg.content.toString());
    }, {noAck: true});
    ch.assertQueue(responseQueue, { durable: false });
  });
});
