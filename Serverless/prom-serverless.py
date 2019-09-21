#
#
# main() will be run when you invoke this action
#
# @param Cloud Functions actions accept a single parameter, which must be a JSON object.
#
# @return The output of this action, which must be a JSON object.
#
#
import sys
import prometheus_client as prom

def main(body):
        
    print(" [x] Received %r" %dict)
    result = list(dict.keys())[0]
    print("result ---- %f",result)    
    return { 'message': dict[result] }
    metricAnalysis(result)

    return { 'message': 'Hello world' }



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