require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})
const rp = require("request-promise");

exports.handler = async (event) => {
  try {
    if (event.headers.datocms_agent !== process.env.DATOCMS_AGENT) {
      return {
        statusCode: 403,
        body: 'Forbidden'
      }
    }
    
    const userData = JSON.parse(event.body)
    
    const authToken = JSON.parse(await getAuth0Token().catch(err => JSON.stringify(err)))
    console.log('authToken = ', authToken)

    const createUserResponse = JSON.parse(await createUser(authToken, userData).catch(err => JSON.stringify(err)))
    console.log('User Created: ', createUserResponse)
    
    const resetPasswordResponse = JSON.parse(await resetPassword(authToken, userData.email).catch(err => JSON.stringify(err)))
    console.log('Password Reset: ', resetPasswordResponse)
    
    return {
      statusCode: 200,
      body: JSON.stringify(resetPasswordResponse),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}

function getAuth0Token() {
  const options = { 
    method: 'POST',
    url: `https://${ process.env.AUTH0_DOMAIN }/oauth/token`, 
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      client_id: `${process.env.AUTH0_CLIENTID}`,
      client_secret: `${process.env.AUTH_SECRET}`,
      audience: `https://${ process.env.AUTH0_DOMAIN }/api/v2/`,
      grant_type: "client_credentials",
      scope: 'create:users',
    }),
  }

  return rp(options)
}

function createUser(auth, userInfo) {
  const options = {
    method: 'POST',
    url: `https://${ process.env.AUTH0_DOMAIN }/api/v2/users`,
    headers: {
      authorization: `${auth['token_type']} ${auth['access_token']}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: userInfo.email,
      name: userInfo.name,
      password: Math.random().toString(36).slice(-12),
      user_metadata: {
        entity_id: userInfo.entity_id.toString(),
      },
      connection: "Username-Password-Authentication",
    })
  }

  return rp(options)
}

function resetPassword(auth, email) {
  const options = {
    method: 'POST',
    url: `https://${ process.env.AUTH0_DOMAIN }/api/v2/tickets/password-change`,
    headers: {
      authorization: `${auth['token_type']} ${auth['access_token']}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      result_url: `"${ process.env.AUTH0_CALLBACK }"`,
      connection_id: "Username-Password-Authentication",
      email: email,
      ttl_sec: 0,
      mark_email_as_verified: true,
    })
  }

  console.log('resetPassword body = ', options)

  return rp(options)
}