import prometheus_client as prom
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from werkzeug.serving import run_simple

from flask_prometheus_metrics import register_metrics
from flask import Flask, request, abort

anger_counter = prom.Counter('anger_results', 'Analysis of the emotion: anger')
disgust_counter = prom.Counter('disgust_results', 'Analysis of the emotion: disgust')
fear_counter = prom.Counter('fear_results', 'Analysis of the emotion: fear')
joy_counter = prom.Counter('joy_results', 'Analysis of the emotion: joy')
sadness_counter = prom.Counter('sadness_results', 'Analysis of the emotion: sadness')
#general_mood = prom.Gauge('general_mood_results', 'Analysis of the general emotion')

app = Flask(__name__, static_url_path='')

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
  
@app.route('/')
def hello():
    if request.method == 'GET':
        emotion = request.args.get('emotion') #if key doesn't exist, returns None
        if emotion == None:
            return 'Hello!'
        metricAnalysis(emotion)
        return emotion
    else:
        abort(400)

if __name__ == '__main__':
    # provide app's version and deploy environment/config name to set a gauge metric
    register_metrics(app, app_version="v0.1.2", app_config="staging")

    # Plug metrics WSGI app to your main app with dispatcher
    dispatcher = DispatcherMiddleware(app, {"/metrics": prom.make_wsgi_app()})

    run_simple(hostname="0.0.0.0", port=8080, application=dispatcher)
