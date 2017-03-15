var amqp = require('amqplib/callback_api');

module.exports.testConnection = (cb) => {
  amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    if(err){
      return cb(err);
    }
    return cb(null, conn);
  });
});
};