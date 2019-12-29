require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
})
// var request = require("request");

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
exports.handler = async (event, context) => {
  try {
    if (event.headers.datocms_agent !== 'LGQ6!T8h83tWVAp') {
      return {
        statusCode: 403,
        body: 'Forbidden'
      }
    }

    console.log(event.body)    
    // const authToken = getAuth0Token()

    // // const apiResponse = createUser(JSON.parse(authToken))
    
    
    // console.log(authToken.body)
    
    return {
      statusCode: 200,
      body: JSON.stringify(event.body)
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}

function getAuth0Token() {
  const options = { 
    method: 'POST',
    url: 'https://ringofkeys.auth0.com/oauth/token',
    headers: { 'content-type': 'application/json' },
    body: '{"client_id":"h5QzF4LKgQEL91ZYElXQ50Lw56i79uox","client_secret":"tjY4OVGf_q4sFT4moX3iDLQJH7lwLmladup6luTgOjlyzmxGiqnTlwi75dBRYHAV","audience":"https://ringofkeys.auth0.com/api/v2/","grant_type":"client_credentials"}'
  }
  
  return request(options, function(err, res, body) {
    return {
      err, res, body
    }
  })
}

function createUser({ token_type, access_token }) {
  const options = {
    method: 'GET',
    url: 'http://path_to_your_api/',
    headers: { authorization: `${token_type} ${access_token}` }
  }


  request(options, function (error, response, body) {
    if (error) throw new Error(error);
  
    return body
  });
}