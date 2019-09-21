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
 
     //Slack Event Subscription Verification
     if (params.type !== undefined && params.type === 'url_verification') {
         return({ challenge: params.challenge });
     }
     
     // You can insert your Language Translator Service Credentials here below
     // const url = '<YOUR-EVENT-STREAMS-SERVICE-URL>';
     // const apikey = '<YOUR-EVENT-STREAMS-SERVICE-APIKEY>'
     // let token = '<YOUR-IBM-CLOUD-IAM-OAUTH-TOKEN>';
     
     let payload = params;
     
     // Check if text is received instead of image and other type of files
     if (payload.event.type === "message" && payload.event.subtype != "bot_message" && typeof payload.event.files === "undefined") {
         
         let text = payload.event.text;
         
         let headers = {
           'Content-Type':'text/plain',
           'Authorization':'Bearer ' + token
         };
         try{
         const res = await fetch(url + '/topics/language/records', {
           method: 'POST',
           body: text,
           headers: headers
         });
         // Getting new access token if expired
         if(res.status === 403){
           const newHeaders= {'Content-Type': 'application/x-www-form-urlencoded'};
           const newUrl = 'https://iam.cloud.ibm.com/identity/token?grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=' + apikey ;
           console.log('newUrl: ',newUrl);
           
           try{
               const newRes = await fetch(newUrl, {
               method: 'POST',
               headers: newHeaders,
             });
             const jsonRes=await newRes.json();
             console.log(jsonRes);
             token = jsonRes.access_token;
             headers['Authorization'] = 'Bearer ' + token;
                 try{
                     const otherRes = await fetch(url + '/topics/language/records', {
                       method: 'POST',
                       body: text,
                       headers: headers
                     });
                 }catch(err){
                 console.log(err); 
                 }finally{
                     console.log('finally of making last call after receiving access token');
                 }
             
             }catch(err){
                 console.log(err); 
             }finally{
                 console.log('finally of 403 error correction');
             }
           
         }
         }catch(err){
             console.log(err); 
         }finally{
             console.log('finally');
         }
     }
     return params;
 }
 
 
 