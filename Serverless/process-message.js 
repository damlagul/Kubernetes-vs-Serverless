const fetch = require('node-fetch');

function main(params) {
  return new Promise(async (resolve, reject) => {
      
    if (!params.messages || !params.messages[0] || !params.messages[0].value) {
      reject("Invalid arguments. Must include 'messages' JSON array with 'value' field");
    }
    
    const msgs = params.messages;
    const text = msgs[0].value;
    const alteredText=text.replace(new RegExp('\"', 'g'), '');
    const encodedText=encodeURI(alteredText);
    //const url = '<YOUR-SEQUENCE-WEB-ACTION-ENDPOINT>?text=' + encodedText;
    
    try{
        const res = await fetch(url);
        console.log(res);
        }catch(err){
            console.log(err); 
        }finally{
            console.log('finally');
        }

    resolve({
      text:encodedText,
    });
  });
}

exports.main = main;
