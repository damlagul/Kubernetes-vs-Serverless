#!/usr/bin/env node
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var RabbitMQProducer = require ('./rabbitmq-connection');

app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.status(200).send("Hello world2");
});

app.post("/", function (req, res) {

  let payload = req.body;

  if (typeof payload.challenge !== 'undefined') {
    res.status(200).send(req.body.challenge);
    return;
  }

  console.log("payload.event.files: ", typeof payload.event.files);
  if (payload.event.type === "message" && payload.event.subtype != "bot_message" && typeof payload.event.files === "undefined") {
    console.log("HEREEE");

    let text = payload.event.text;
    let currentChannel=payload.event.channel;

    console.log("text inside  payload: ", text);
    console.log("channel inside payload:  ", currentChannel);

    RabbitMQProducer(text,payload.event.channel);
  
  }
  res.status(200).send("Job Done");
});

app.listen(process.env.PORT || 80, function () {
  console.log("Server is running on PORT:", process.env.PORT || 80);
});