require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})
const rp = require("request-promise")
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_KEY)

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

    const userExistsRes = JSON.parse(await checkUserExists(auth, userData.name).catch(err => JSON.stringify(err)))
    console.log('doesUserExist = ', userExistsRes)
    if (userExistsRes.length > 0) {
      return {
        statusCode: 200,
        body: `User with name ${ userData.name } already exists!`,
      }
    }

    const createUserResponse = JSON.parse(await createUser(authToken, userData).catch(err => JSON.stringify(err)))
    console.log('User Created: ', createUserResponse)
    
    const resetPasswordResponse = JSON.parse(await resetPassword(authToken, userData.email).catch(err => JSON.stringify(err)))
    console.log('Password Reset: ', resetPasswordResponse)

    const emailSendResponse = await sendWelcomeEmail(userData.email, resetPasswordResponse.ticket).catch(err => JSON.stringify(err))
    console.log('Email Sent: ', emailSendResponse)
    
    return {
      statusCode: 200,
      body: JSON.stringify(emailSendResponse),
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

function checkUserExists(auth, name) {
  const options = {
    method: 'GET',
    url: 'https://ringofkeys.auth0.com/api/v2/users',
    qs: {q: `name:"${ name }"`, search_engine: 'v3'},
    headers: {authorization: `${auth['token_type']} ${auth['access_token']}`},
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
      connection_id: `${ process.env.AUTH0_CONNECTIONID }`,
      email: email,
      ttl_sec: 0,
      mark_email_as_verified: true,
    })
  }

  console.log('resetPassword body = ', options)

  return rp(options)
}

async function sendWelcomeEmail(email, pwdResetUrl) {
  const msg = {
    to: email,
    from: 'test@example.com',
    subject: 'Welcome to Ring of Keys',
    text: 'You can set up your password at '+ pwdResetUrl,
    html:  `<h1>Welcome to Ring of Keys!</h1><p>To confirm your email address and set up your password, visit <a href='${pwdResetUrl}' rel='noopener'>this link</a></p>`,
  }

  return sgMail.send(msg)
}