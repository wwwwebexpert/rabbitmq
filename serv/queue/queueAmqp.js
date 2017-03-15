var amqp = require('amqp');
let messageModel = require('../models/messages');
var connection = amqp.createConnection();

connection.on('error', function(e){
  console.log('Error from amqp: ', e);
});

connection.on('ready', function(){
  var messageQueue = 'db-message';
  var responseQueue = 'response-message';
  var ex = 'test-exchange';
  connection.exchange(ex,{ type: 'direct'},function(exchange){
    connection.queue(messageQueue, function (queue) {
    queue.bind(ex, messageQueue);
    q.bind('#');
    q.subscribe(function (message) {
      message = JSON.parse(msg.content.toString());
      if(message.requestType === 'POST'){
        //save the data to the db
        let saveData = new messageModel({ value : message.num });
        saveData.save(function(err, returnMessage){
          if(err){
            exchange.publish(responseQueue, new Buffer(err.toString()));
          }else{
            exchange.publish(responseQueue, new Buffer(returnMessage.toString()));
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
            exchange.publish(responseQueue, new Buffer(err.toString()));
          }else{
            console.log(messages);
            exchange.publish(responseQueue, new Buffer(messages.toString()));
          }
        });
      }else{
        //wrong requestType
        let errMessage = 'Wrong requestType';
        exchange.publish(responseQueue, new Buffer(errMessage));
      }
    });
  });
  });
});
