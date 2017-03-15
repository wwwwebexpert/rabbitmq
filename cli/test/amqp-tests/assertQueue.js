var amqp = require('amqplib/callback_api');

module.exports.testQueue = (cb) => {
  amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    if(err){
      return cb(err);
    }
    var messageQueue = 'db-message';
    ch.assertQueue(messageQueue, {durable: false});
    ch.checkQueue(messageQueue, function(err,ok){
      if(err){
        return cb(err);
      }else{
        return cb(null, ok);
      }
    });
  });
});
};