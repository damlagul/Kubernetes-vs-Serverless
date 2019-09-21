#!/usr/bin/env node

const translator_credentials = {
  "apikey": `${process.env.WATSONLANG_APIKEY}`,
  "url": `${process.env.WATSONLANG_URL}`
};

const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');

async function identifyLanguage(textToIdentify) {

  let result = "";
  const languageTranslator = new LanguageTranslatorV3({
    version: '2018-05-01',
    iam_apikey: translator_credentials.apikey,
    url: translator_credentials.url,
  });
  const identifyParams = {
    text: textToIdentify
  };

  await languageTranslator.identify(identifyParams)
    .then(identifiedLanguages => {
      //console.log(JSON.stringify(identifiedLanguages, null, 2));
      result = JSON.stringify(identifiedLanguages, null, 2);
    })
    .catch(err => {
      console.log('error:', err);
      result = "error occurred";
    });

  return result;
}
async function translateLanguage(textToTranslate, language) {

  let result = "";
  const languageTranslator = new LanguageTranslatorV3({
    version: '2018-05-01',
    iam_apikey: translator_credentials.apikey,
    url: translator_credentials.url,
  });

  const translateParams = {
    text: textToTranslate,
    model_id: language + '-' + 'en',
  };

  await languageTranslator.translate(translateParams)
    .then(translationResult => {
      //console.log(JSON.stringify(translationResult, null, 2));
      result = JSON.stringify(translationResult, null, 2);
    })
    .catch(err => {
      console.log('error:', err);
      result = "error occurred"
    });
  return result;
}

var amqp = require('amqplib/callback_api');

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
    }, function(err, ok) {
      if (err) console.log(err);
      console.log(ok);
    });
    channel.prefetch(1);
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
    channel.consume(queue, async function (msg) {
      console.log('msg is: ', msg);
      try {
        console.log(" [x] Received %s", msg.content.toString());
        let convertedMessage = JSON.parse(msg.content.toString());

        let result = await identifyLanguage(convertedMessage.textMessage);
        //console.log("Result returned from Watson: %s", result);
        resultObj = JSON.parse(result);
        let language = resultObj.languages[0].language;
        console.log("lANGUAGE: %s", language);

        if (language != "en") {
          console.log("Language is not English! Sending it to translator for translation...");
          let translateResult = await translateLanguage(convertedMessage.textMessage, language);
          let translateResultObj = JSON.parse(translateResult);
          let translatedText = translateResultObj.translations[0].translation;
          //console.log("Translated text: %s",translatedText);
          result = translatedText;
        }
        else {
          console.log("Language is English! No need to make translation. Sending it to NLU...");
          result = convertedMessage.textMessage;
          console.log("result: ", result);
        }

        connection.createChannel(function (error11, nlu_channel) {
          if (error11) {
            throw error11;
          }

          var sentimentQueue = 'sent_queue';

          nlu_channel.assertQueue(sentimentQueue, {
            durable: true
          }, function(err, ok) {
            if (err) console.log(err);
            console.log(ok);
          });
          console.log("result inside channel: ", result);
          objToSend = { "textMessage": result, "channelNum": convertedMessage.channelNum }

          nlu_channel.sendToQueue(sentimentQueue, Buffer.from(JSON.stringify(objToSend)), {
            persistent: true
          });

          //console.log(" [x] Message %s is sent from and slack channel id is %s", result, convertedMessage.channelNum);
        });
      } catch (e) {
        console.log('ERROR: ', e);
      } finally {
        channel.ack(msg);
      }

    }, {
      // manual acknowledgment mode,
      // see https://www.rabbitmq.com/confirms.html for details
      noAck: false
    });
  });
});
