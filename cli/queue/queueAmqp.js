var amqp = require('amqp');
var connection = amqp.createConnection();

let operationType = ['greater_than', 'less_than', 'equals'];
let type = ['GET','POST'];

connection.on('error', function(e){
  console.log('Error from amqp: ', e);
});

connection.on('ready', function(){
  var messageQueue = 'db-message';
  var responseQueue = 'response-message';
  var exchange = connection.exchange('test-exchange' ,{ type: 'direct' });
  
  exchange.on('open', function(){
    console.log('lets do this');
  });
  //   connection.queue(messageQueue,{}, function (queue) {
  //     console.log('inside messageQueue');
  //     queue.bind(ex, messageQueue);
  //   setInterval(() => {
  //     let message = generateNewMessage();
  //     // ch.sendToQueue(messageQueue, new Buffer(message));
  //     exchange.publish('',new Buffer(message));
  //     }, 5000);
  //     q.bind('#');

  //     // Receive messages
  //     q.subscribe(function (message) {
  //       // Print messages to stdout
  //       console.log(message);
  //     });
  // });
});

function generateNewMessage(){
  let num = Math.floor(Math.random() * 100) + 1;
  var requestType = type[Math.floor(Math.random() * type.length)];

  if(requestType == 'GET'){
    var opType = operationType[Math.floor(Math.random() * operationType.length)];
    console.log(" [x] Sent", num, requestType, opType);
    return JSON.stringify({num, requestType, opType});
  }else{
    console.log(" [x] Sent", num, requestType);
    return JSON.stringify({num, requestType});
  }
}