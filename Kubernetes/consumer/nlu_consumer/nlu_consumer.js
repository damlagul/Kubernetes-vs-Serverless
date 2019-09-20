const amqp = require('amqplib/callback_api');
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');

const nlu_credentials = {
  "apikey": `${process.env.WATSON_NLU_APIKEY}`,
  "url": `${process.env.WATSON_NLU_URL}`
};

async function analyzeText(textToAnalyze) {

  const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    version: '2019-07-12',
    iam_apikey: nlu_credentials.apikey,
    url: nlu_credentials.url,
  });

  const analyzeParams = {
    'text': textToAnalyze,
    'language': 'en',
    'features': {
      'concepts': {
        'limit': 2,
      },
      'emotion': {
        'limit': 2
      },
      'entities': {
        'limit': 2,
      },
      'keywords': {
        'limit': 2,
      },
    },
  };

  try {
    const result = await naturalLanguageUnderstanding.analyze(analyzeParams)
    console.log('Successfully analyzed');
    return JSON.stringify(result, null, 2);
  } catch(e) {
    console.log('error:', e);
    return 'error occurred';
  }
}

amqp.connect(`amqp://${process.env.RABBITMQ_CONNECTION || 'localhost:5672'}`, function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    const queue = 'sent_queue';

    channel.assertQueue(queue, {
      durable: true
    }, function(err, ok) {
      if (err) console.log(err);
      console.log(ok);
    });
    channel.prefetch(1);
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
    channel.consume(queue, async function (msg) {
      if (msg !== null) {
        console.log('msg is: ', msg);
        console.log(" [x] Received %s", msg.content.toString());
        const convertedMessage = JSON.parse(msg.content.toString());
        const result = await analyzeText(convertedMessage.textMessage);
        console.log("Result returned from NLU: %s", result);
        const resultObj = JSON.parse(result);
        const emotions = resultObj.emotion.document.emotion;
        let highestEmotionCount = 0.0;
        let highestEmotion = '';
        for (emotion in emotions) {
          console.log('emotion: %s ,emotion value: %f', emotion, emotions[emotion]);
          const temp = parseFloat(emotions[emotion]);
          if (temp > highestEmotionCount) {
            highestEmotionCount = temp;
            highestEmotion = emotion;
            console.log('highest emotion is changed to: %s', highestEmotion);
          }
        }
        console.log('Highest Emotion: %s Highest Emotion Value: %s', highestEmotion, highestEmotionCount.toString());
        let finalObj = {};
        finalObj[highestEmotion] = highestEmotionCount;

        //SEND IT TO PROMETHEUS_QUEUE

        connection.createChannel(function (error, prom_channel) {
          if (error) {
            throw error;
          }

          const prometheusQueue = 'prom_queue';

          prom_channel.assertQueue(prometheusQueue, {
            durable: true
          }, function(err, ok) {
            if (err) console.log(err);
            console.log(ok);
          });
          console.log('finalObj key: %s , value: %s', Object.keys(finalObj)[0], finalObj[Object.keys(finalObj)[0]]);
          prom_channel.sendToQueue(prometheusQueue, Buffer.from(JSON.stringify(finalObj)), {
            persistent: true
          });
        });
        channel.ack(msg);
      }
    }, {
      // manual acknowledgment mode,
      // see https://www.rabbitmq.com/confirms.html for details
      noAck: false
    });
  });
});