var amqp = require("amqplib/callback_api");

function RabbitMQProducer(textMessage,channelNum) {
  amqp.connect(`amqp://${process.env.RABBITMQ_CONNECTION || 'localhost:5672'}`, function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      var queue = 'lang_queue';

      channel.assertQueue(queue, {
        durable: true
      });

      objToSend =  {"textMessage": textMessage, "channelNum":channelNum}

      //Buffer.from();

      channel.sendToQueue(queue, Buffer.from(JSON.stringify(objToSend)), {
        persistent: true
      });

      console.log(" [x] Message %s is sent and slack channel id is %s", textMessage,channelNum);
    });
    
    setTimeout(function () {
      connection.close();
    }, 500);
  });
}

module.exports = RabbitMQProducer;
