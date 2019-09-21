import pika
import ast
import prometheus_client as prom
import random
import time
from threading import Thread
import pika
import os

from flask import Flask, request
from flask_prometheus import monitor


# Prometheus metric initializations
req_summary = prom.Summary('python_my_req_example', 'Time spent processing a request')

anger_counter = prom.Counter('anger_results', 'Analysis of the emotion: anger')
disgust_counter = prom.Counter('disgust_results', 'Analysis of the emotion: disgust')
fear_counter = prom.Counter('fear_results', 'Analysis of the emotion: fear')
joy_counter = prom.Counter('joy_results', 'Analysis of the emotion: joy')
sadness_counter = prom.Counter('sadness_results', 'Analysis of the emotion: sadness')
#general_mood = prom.Gauge('general_mood_results', 'Analysis of the general emotion')


# App related initializations
@req_summary.time()
def process_request(t):
    time.sleep(t)


app = Flask("pyProm")

@app.route('/', methods=["GET", "POST"])
def hi():
    if request.method == "GET":
        return "IT WORKS!", 200, None

    return "Bad Request", 400, None


def metricAnalysis(result):
    if(result == 'anger'):
        anger_counter.inc(1)
    elif(result == 'disgust'):
        disgust_counter.inc(1)
    elif(result == 'fear'):
        fear_counter.inc(1)
    elif(result == 'joy'):
        joy_counter.inc(1)
    elif(result == 'sadness'):
        sadness_counter.inc(1)
  


def queue_reading():
    # Queue connection
    connection = pika.BlockingConnection(pika.ConnectionParameters(host=os.environ["RABBITMQ_CONNECTION"], port='5672'))
    channel = connection.channel()

    channel.queue_declare(queue='prom_queue', durable=True)

    def callback(ch, method, properties, body):
        print(" [x] Received %r" % body)
        #print(type(ast.literal_eval(body.decode('utf-8'))))
        print("bodyconverted ---- %s",body)
        bodyConverted = ast.literal_eval(body.decode('utf-8'))
        result = list(bodyConverted.keys())[0]
        print("result ---- %s",result)
        metricAnalysis(result)

    channel.basic_consume(queue='prom_queue', on_message_callback=callback, auto_ack=True)

    print(' [*] Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()


Thread(target=queue_reading).start()

monitor(app, port=8080)
app.run(host="0.0.0.0", port=80)


