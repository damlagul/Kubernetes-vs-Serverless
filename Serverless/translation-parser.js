/**
  *
  * main() will be run when you invoke this action
  *
  * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
  *
  * @return The output of this action, which must be a JSON object.
  *
  */
 function main(params) {
    let text = '';
    
    if(params.englishLanguage){
        text = params.text;
    }
    else{
        text=params.translations[0].translation;
    }
    
    /*
        //You can insert your NLU Service Credentials here below
        const url = '<YOUR-NLU-SERVICE-URL>';
        const version = '<YOUR-NLU-VERSION>';
        const iam_apikey = '<YOUR-NLU-IAM-APIKEY>';
    */
    
    const features = {'emotion': {'limit': 2}};
    
    params = {
            url:url,
            iam_apikey:iam_apikey,
            version:version,
            text:text,
            features:features
        };
	
	return params;
}
