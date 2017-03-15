var amqp = require('amqplib/callback_api');
var fakeAmqp = require('exp-fake-amqplib');
var proxyquire = require('proxyquire');
var mocha = require('mocha');
var chai = require('chai').should();
var createChannel = require('./amqp-tests/createChannel');
var assertQueue = require('./amqp-tests/assertQueue');
var sendReceive = require('./amqp-tests/sendReceive');

proxyquire("exp-amqp-connection", {
  "amqplib/callback_api": fakeAmqp
});

// amqp.connect = fakeAmqpLib.connect;
describe('testing the amqplib',function(){

  it('should connect to amqp',function(done){
    amqp.connect('amqp://localhost', done);
  });

  it('should create a connection', function(done){
    createChannel.testConnection(done);
  });

  it('should create a queue', function(done){
    assertQueue.testQueue(done);
  });

  it('should send a value and receive the saved data', function(done){
    this.timeout(10000);
    sendReceive.testSendReceive(done);
  });
});