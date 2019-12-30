require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
})
const rp = require("request-promise");

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
exports.handler = async (event, context) => {
  try {
    if (event.headers.datocms_agent !== process.env.DATOCMS_AGENT) {
      return {
        statusCode: 403,
        body: 'Forbidden'
      }
    }

    // console.log('Name within message is = ', JSON.parse(event.body).name)    

    const authToken = JSON.parse(await getAuth0Token())

    const apiResponse = JSON.parse(await createUser(authToken, JSON.parse(event.body)))
    console.log('apiResponse = ', apiResponse)
    
    return {
      statusCode: 200,
      body: JSON.stringify(apiResponse),
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
    body: '{"client_id":"HcN6E0t9NZxTygw0rFkpsotfMlSx6AmJ","client_secret":"1qbtAZwNmAl1-oCHtR2hNGPigxxGPXOi7V6_4yRSHbJUn_rfIfXrqbnNnGYzt7f_","audience":"https://ringofkeys.auth0.com/api/v2/","grant_type":"client_credentials"}',
  }

  return rp(options)
}

function createUser(auth, userInfo) {
  const options = {
    method: 'POST',
    url: 'https://ringofkeys.auth0.com/api/v2/users',
    headers: {
      authorization: `${auth['token_type']} ${auth['access_token']}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: userInfo.email,
      name: userInfo.name,
      password: Math.random().toString(36).slice(-12),
      user_metadata: {
        'entity_id': userInfo.entity_id.toString(),
      },
      connection: "Username-Password-Authentication",
    })
  }

  console.log('body = ', options.body)

  return rp(options)
}