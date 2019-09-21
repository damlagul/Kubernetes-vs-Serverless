/**
  *
  * main() will be run when you invoke this action
  *
  * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
  *
  * @return The output of this action, which must be a JSON object.
  *
  */
 const fetch = require('node-fetch');
 async function main(params) {
     //Get the emotion with the highest value
     let emotions = params.emotion.document.emotion;
     let highestEmotionCount = 0.0;
     let highestEmotion = '';
     for (emotion in emotions) {
         let temp = parseFloat(emotions[emotion]);
         if (temp > highestEmotionCount) {
             highestEmotionCount = temp;
             highestEmotion = emotion;
         }
     }
     console.log('Highest Emotion: %s Highest Emotion Value: %s', highestEmotion, highestEmotionCount.toString());
     let result = {};
     result[highestEmotion] = highestEmotionCount;
 
         try{
             const otherRes = await fetch('<YOUR-PROMETHEUS-CF-APP-URL>?emotion='+highestEmotion);
         }catch(err){
         console.log(err); 
         }finally{
             console.log('finally of making last call after receiving access token');
         }
 
 http://prom-writer-bold-bonobo.eu-gb.mybluemix.net
 
 
     return result;
 }
 