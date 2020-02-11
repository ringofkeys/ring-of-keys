require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})
const SiteClient = require('datocms-client').SiteClient
const client = new SiteClient(process.env.DATO_CONTENT_TOKEN)
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

    console.log('userData = ', userData)

    if (!userData.hasLoginAccess) {
        return {
            statusCode: 200,
            body: `Not running Auth0 function because "Has Login Access" is set to false on user's profile.`,
        }
    }
    
    const authToken = JSON.parse(await getAuth0Token().catch(err => JSON.stringify(err)))
    // console.log('authToken = ', authToken)

    const userExistsRes = JSON.parse(await checkUserExists(authToken, userData.name).catch(err => JSON.stringify(err)))
    console.log('doesUserExist = ', userExistsRes)
    if (userExistsRes.length > 0) {
      return {
        statusCode: 200,
        body: `User with name ${ userData.name } already exists!`,
      }
    }

    const createUserResponse = JSON.parse(await createUser(authToken, userData).catch(err => JSON.stringify(err)))
    console.log('User Created: ', createUserResponse)
    if (createUserResponse.status > 299) {
        console.log('User creation failed!')
        return {
            statusCode: 409,
            body: `User with email ${ userData.email } already exists!`,
        }
    }

    const deployEnvironmentId = '6240'
    await client.deploymentEnvironments.trigger(deployEnvironmentId)
    
    const resetPasswordResponse = JSON.parse(await resetPassword(authToken, userData.email).catch(err => JSON.stringify(err)))
    console.log('Password Reset: ', resetPasswordResponse)

    if (!resetPasswordResponse.ticket) return {
        statusCode: 500,
        body: 'ticket creation unsuccessful, email not sent'
    }

    const emailSendResponse = await sendWelcomeEmail(userData.email, userData.name, resetPasswordResponse.ticket).catch(err => JSON.stringify(err))
    console.log('Email Sent: ', emailSendResponse) 
    
    return {
      statusCode: 201,
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
      scope: 'create:users read:users',
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

const randChars = ['!','-','L', 'A','c','o','W', 'era','Georg3', 'C99', 'asdg', '2aa']
let pwd = Math.random().toString(36).slice(-12)
const splitPt = Math.floor(Math.random()*pwd.length)
pwd = pwd.substr(0, splitPt) + randChars[Math.floor(Math.random()*randChars.length)] + pwd.substr(splitPt)

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
      password: pwd,
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
      result_url: process.env.AUTH0_CALLBACK,
      connection_id: process.env.AUTH0_CONNECTIONID,
      email: email,
      ttl_sec: 0,
      mark_email_as_verified: true,
    })
  }

  console.log('resetPassword body = ', options)

  return rp(options)
}

async function sendWelcomeEmail(email, name, pwdResetUrl) {
  const msg = {
    to: email,
    from: 'info@ringofkeys.org',
    subject: 'Welcome to Ring of Keys',
    text: 'You can set up your password at '+ pwdResetUrl,
    html:  `<table border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer" style="border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;border: 0;max-width: 600px !important;">
                            <tbody><tr>
                                <td valign="top" id="templatePreheader" style="background:#FAFAFA none no-repeat center/cover;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;background-color: #FAFAFA;background-image: none;background-repeat: no-repeat;background-position: center;background-size: cover;border-top: 0;border-bottom: 0;padding-top: 9px;padding-bottom: 9px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
    <tbody class="mcnTextBlockOuter">
        <tr>
            <td valign="top" class="mcnTextBlockInner" style="padding-top: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
              	<!--[if mso]>
				<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
				<tr>
				<![endif]-->
			    
				<!--[if mso]>
				<td valign="top" width="600" style="width:600px;">
				<![endif]-->
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width: 100%;min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;" width="100%" class="mcnTextContentContainer">
                    <tbody><tr>
                        
                        <td valign="top" class="mcnTextContent" style="padding: 0px 18px 9px;text-align: center;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;word-break: break-word;color: #656565;font-family: Helvetica;font-size: 12px;line-height: 150%;">
                        
                            <a href="https://us4.campaign-archive.com/?e=[UNIQID]&amp;u=539a4242e28417ba21438bdae&amp;id=1cc05b9d0e" target="_blank" style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #656565;font-weight: normal;text-decoration: underline;">View this email in your browser</a>
                        </td>
                    </tr>
                </tbody></table>
				<!--[if mso]>
				</td>
				<![endif]-->
                
				<!--[if mso]>
				</tr>
				</table>
				<![endif]-->
            </td>
        </tr>
    </tbody>
</table></td>
                            </tr>
                            <tr>
                                <td valign="top" id="templateHeader" style="background:#FFFFFF none no-repeat center/cover;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;background-color: #FFFFFF;background-image: none;background-repeat: no-repeat;background-position: center;background-size: cover;border-top: 0;border-bottom: 0;padding-top: 9px;padding-bottom: 0;"></td>
                            </tr>
                            <tr>
                                <td valign="top" id="templateBody" style="background:#FFFFFF none no-repeat center/cover;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;background-color: #FFFFFF;background-image: none;background-repeat: no-repeat;background-position: center;background-size: cover;border-top: 0;border-bottom: 2px solid #EAEAEA;padding-top: 0;padding-bottom: 9px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock" style="min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
    <tbody class="mcnImageBlockOuter">
            <tr>
                <td valign="top" style="padding: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;" class="mcnImageBlockInner">
                    <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="mcnImageContentContainer" style="min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                        <tbody><tr>
                            <td class="mcnImageContent" valign="top" style="padding-right: 9px;padding-left: 9px;padding-top: 0;padding-bottom: 0;text-align: center;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                                
                                    
                                        <img align="center" alt="" src="https://mcusercontent.com/539a4242e28417ba21438bdae/images/f88aa153-700d-4a72-a0db-3b4edc107d25.png" width="564" style="max-width: 800px;padding-bottom: 0;display: inline !important;vertical-align: bottom;border: 0;height: auto;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;" class="mcnImage">
                                    
                                
                            </td>
                        </tr>
                    </tbody></table>
                </td>
            </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnButtonBlock" style="min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
    <tbody class="mcnButtonBlockOuter">
        <tr>
            <td style="padding-top: 0;padding-right: 18px;padding-bottom: 18px;padding-left: 18px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;" valign="top" align="center" class="mcnButtonBlockInner">
                <table border="0" cellpadding="0" cellspacing="0" class="mcnButtonContentContainer" style="border-collapse: separate !important;border-radius: 3px;background-color: #BF662F;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                    <tbody>
                        <tr>
                            <td align="center" valign="middle" class="mcnButtonContent" style="font-family: Lato, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;font-size: 14px;padding: 18px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                                <a class="mcnButton " title="Complete your Key Profile" href="${ pwdResetUrl }" target="_blank" style="font-weight: normal;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;">Complete your Key Profile</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock" style="min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;table-layout: fixed !important;">
    <tbody class="mcnDividerBlockOuter">
        <tr>
            <td class="mcnDividerBlockInner" style="min-width: 100%;padding: 0px 18px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-top: 2px solid #EAEAEA;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                    <tbody><tr>
                        <td style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                            <span></span>
                        </td>
                    </tr>
                </tbody></table>
<!--            
                <td class="mcnDividerBlockInner" style="padding: 18px;">
                <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
-->
            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
    <tbody class="mcnTextBlockOuter">
        <tr>
            <td valign="top" class="mcnTextBlockInner" style="padding-top: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
              	<!--[if mso]>
				<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
				<tr>
				<![endif]-->
			    
				<!--[if mso]>
				<td valign="top" width="600" style="width:600px;">
				<![endif]-->
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width: 100%;min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;" width="100%" class="mcnTextContentContainer">
                    <tbody><tr>
                        
                        <td valign="top" class="mcnTextContent" style="padding-top: 0;padding-right: 18px;padding-bottom: 9px;padding-left: 18px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;word-break: break-word;color: #202020;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left;">
                        
                            <p style="text-align: left;margin: 10px 0;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #202020;font-family: Helvetica;font-size: 16px;line-height: 150%;"><font color="#263e64"><strong>${ name }, Good News!&nbsp;</strong></font><br>
<font face="lato, helvetica neue, helvetica, arial, sans-serif">We have reviewed your application and are happy to say that your account is now verified and you are officially a Key!<br>
&nbsp;<br>
We’re so ecstatic to have you as a member of our <strong>RING OF KEYS</strong> network. We look forward to building a community together, elevating our narratives, and progressing the Musical Theatre landscape for the future.<br>
<br>
<strong>Please click or tap the button below to confirm your email address and set up your password. From here you will be able to complete your Key Profile:</strong></font></p>

                        </td>
                    </tr>
                </tbody></table>
				<!--[if mso]>
				</td>
				<![endif]-->
                
				<!--[if mso]>
				</tr>
				</table>
				<![endif]-->
            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnButtonBlock" style="min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
    <tbody class="mcnButtonBlockOuter">
        <tr>
            <td style="padding-top: 0;padding-right: 18px;padding-bottom: 18px;padding-left: 18px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;" valign="top" align="left" class="mcnButtonBlockInner">
                <table border="0" cellpadding="0" cellspacing="0" class="mcnButtonContentContainer" style="border-collapse: separate !important;border-radius: 3px;background-color: #BF662F;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                    <tbody>
                        <tr>
                            <td align="center" valign="middle" class="mcnButtonContent" style="font-family: Lato, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;font-size: 14px;padding: 18px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                                <a class="mcnButton " title="Complete your Key Profile" href="${ pwdResetUrl }" target="_blank" style="font-weight: normal;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;">Complete your Key Profile</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
    <tbody class="mcnTextBlockOuter">
        <tr>
            <td valign="top" class="mcnTextBlockInner" style="padding-top: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
              	<!--[if mso]>
				<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
				<tr>
				<![endif]-->
			    
				<!--[if mso]>
				<td valign="top" width="600" style="width:600px;">
				<![endif]-->
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width: 100%;min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;" width="100%" class="mcnTextContentContainer">
                    <tbody><tr>
                        
                        <td valign="top" class="mcnTextContent" style="padding-top: 0;padding-right: 18px;padding-bottom: 9px;padding-left: 18px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;word-break: break-word;color: #202020;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left;">
                        
                            <p style="text-align: left;margin: 10px 0;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #202020;font-family: Helvetica;font-size: 16px;line-height: 150%;"><font face="lato, helvetica neue, helvetica, arial, sans-serif">In our Members Only Dashboard, you can find access to Members Only content like a Keys Badge for your website or resumé and the link to our private Keys Facebook Group. And don't forget to check out our Directory, which is a great place to start meeting other Members.<br>
&nbsp;<br>
Please add <strong>info@ringofkeys.org</strong> to your contacts so you don't miss our Monthly Newsletters and Monthly Meetup and Workshop announcements.<br>
<br>
Feel free to reach out with any questions. We also welcome your ideas to grow our community! &nbsp;<br>
&nbsp;&nbsp;<br>
With love,<br>
Ring of Keys</font></p>

                        </td>
                    </tr>
                </tbody></table>
				<!--[if mso]>
				</td>
				<![endif]-->
                
				<!--[if mso]>
				</tr>
				</table>
				<![endif]-->
            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock" style="min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
    <tbody class="mcnImageBlockOuter">
            <tr>
                <td valign="top" style="padding: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;" class="mcnImageBlockInner">
                    <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="mcnImageContentContainer" style="min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                        <tbody><tr>
                            <td class="mcnImageContent" valign="top" style="padding-right: 0px;padding-left: 0px;padding-top: 0;padding-bottom: 0;text-align: center;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
                                
                                    
                                        <img align="center" alt="" src="https://mcusercontent.com/539a4242e28417ba21438bdae/images/90d41020-ac3e-40dd-9bab-8c365f177fa8.png" width="600" style="max-width: 1200px;padding-bottom: 0px;vertical-align: bottom;display: inline !important;border-radius: 0%;border: 0;height: auto;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;" class="mcnRetinaImage">
                                    
                                
                            </td>
                        </tr>
                    </tbody></table>
                </td>
            </tr>
    </tbody>
</table></td>
                            </tr>
                            <tr>
                                <td valign="top" id="templateFooter" style="background:#FAFAFA none no-repeat center/cover;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;background-color: #FAFAFA;background-image: none;background-repeat: no-repeat;background-position: center;background-size: cover;border-top: 0;border-bottom: 0;padding-top: 9px;padding-bottom: 9px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
    <tbody class="mcnTextBlockOuter">
        <tr>
            <td valign="top" class="mcnTextBlockInner" style="padding-top: 9px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
              	<!--[if mso]>
				<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
				<tr>
				<![endif]-->
			    
				<!--[if mso]>
				<td valign="top" width="600" style="width:600px;">
				<![endif]-->
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width: 100%;min-width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;" width="100%" class="mcnTextContentContainer">
                    <tbody><tr>
                        
                        <td valign="top" class="mcnTextContent" style="padding-top: 0;padding-right: 18px;padding-bottom: 9px;padding-left: 18px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;word-break: break-word;color: #656565;font-family: Helvetica;font-size: 12px;line-height: 150%;text-align: center;">
                        
                            <span style="font-size:18px"><span style="font-family:lato,helvetica neue,helvetica,arial,sans-serif"><strong>Let's Queer the Stage&nbsp;</strong></span></span><br>
<br>
<em><span style="font-family:lato,helvetica neue,helvetica,arial,sans-serif">Copyright © 2020 Ring of Keys, All rights reserved.</span></em><br>
<br>
<span style="font-family:lato,helvetica neue,helvetica,arial,sans-serif">Want to change how you receive these emails?<br>
You can <a href="https://ringofkeys.us4.list-manage.com/profile?u=539a4242e28417ba21438bdae&amp;id=f60441aafc&amp;e=[UNIQID]" style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #656565;font-weight: normal;text-decoration: underline;">update your preferences</a> or <a href="https://ringofkeys.us4.list-manage.com/unsubscribe?u=539a4242e28417ba21438bdae&amp;id=f60441aafc&amp;e=[UNIQID]&amp;c=1cc05b9d0e" style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #656565;font-weight: normal;text-decoration: underline;">unsubscribe from this list</a>.</span>
                        </td>
                    </tr>
                </tbody></table>
				<!--[if mso]>
				</td>
				<![endif]-->
                
				<!--[if mso]>
				</tr>
				</table>
				<![endif]-->
            </td>
        </tr>
    </tbody>
</table></td>
                            </tr>
                        </tbody></table>`,
  }

  return sgMail.send(msg)
}