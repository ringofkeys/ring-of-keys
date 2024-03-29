require("dotenv").config({
    path: `.env.${process.env.NODE_ENV}`,
})
const SiteClient = require("datocms-client").SiteClient
const client = new SiteClient(process.env.DATO_CONTENT_TOKEN)
const rp = require("request-promise")
const sgMail = require("@sendgrid/mail")
sgMail.setApiKey(process.env.SENDGRID_KEY)

exports.handler = async (event) => {
    try {
        // Don't run if the requester doesn't have the secret code
        if (event.headers.datocms_agent !== process.env.DATOCMS_AGENT) {
            return {
                statusCode: 403,
                body: "Forbidden",
            }
        }

        const userData = JSON.parse(event.body)
        if (userData.name) {
            userData.name = userData.name.trim()
        }
        if (userData.email) {
            userData.email = userData.email.trim()
        }

        // Do nothing else if the user isn't supposed to have login access (which is set on their profile in DatoCMS)
        if (!userData.hasLoginAccess) {
            return {
                statusCode: 200,
                body: `Not running Auth0 function because "Has Login Access" is set to false on user's profile.`,
            }
        }

        const authToken = JSON.parse(
            await getAuth0Token().catch((err) => JSON.stringify(err))
        )
        // Check if an Auth0 account already exists for the user.
        const userExistsRes = JSON.parse(
            await checkUserExists(authToken, userData.name).catch((err) =>
                JSON.stringify(err)
            )
        )

        if (userExistsRes.length > 0) {
            return {
                statusCode: 200,
                body: `Not creating new Auth0 login for user because a user with name ${userData.name} already exists.
          This likely means that the user is updating their profile.`,
            }
        }

        // create an Auth0 account for the user
        const createUserResponse = JSON.parse(
            await createUser(authToken, userData).catch((err) =>
                JSON.stringify(err)
            )
        )

        if (createUserResponse.status > 299) {
            console.log(`User creation failed! Something seems to be going wrong on the Auth0 side of things: we received a 299 error.
          Check the Netlify Function logs for createAuth0User to see the full error details.`)
            if (createUserResponse.status === 409) {
                return {
                    statusCode: 409,
                    body: `User with email ${userData.email} already exists! This is likely an issue, as we checked to see if the user existed in Auth0 already and none was found.`,
                }
            }

            return {
                statusCode: 501,
                body:
                    "Auth0 service failure: " +
                    JSON.parse(createUserResponse.body),
            }
        }

        // console.log('testing we get to just before the deploy trigger is fired')

        const buildTriggerId = "8003"

        const displayTime = (date) =>
            `currentTime is ${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`

        console.log(displayTime(new Date()))
        await client.buildTriggers
            .trigger(buildTriggerId)
            .then(() => {
                console.log("Done! Build Triggered.", displayTime(new Date()))
            })
            .catch((error) => {
                console.error(error, displayTime(new Date()))
            })

        // Create a reset password ticket on the newly created Auth0 account.
        const resetPasswordResponse = JSON.parse(
            await resetPassword(authToken, userData.email.toLowerCase()).catch(
                (err) => JSON.stringify(err)
            )
        )

        if (!resetPasswordResponse.ticket)
            return {
                statusCode: 500,
                body: "Unable to create a reset password ticket in Auth0. Email not sent.",
            }

        console.log("got past the password reset ticket")

        if (userData.email) {
            // Add user's email to the MailChimp Newsletter list then Members list
            const mailchimpResOne = await addToMailchimpNode(
                userData.email,
                {
                    /* list fields, optional MailChimp data */
                },
                "https://ringofkeys.us17.list-manage.com/subscribe/post?u=8f1dc9a8a5caac3214e2997fe&amp;id=b8eb5db676"
            )
            const mailchimpResTwo = await addToMailchimpNode(
                userData.email,
                {
                    /* list fields, optional MailChimp data */
                },
                "https://ringofkeys.us17.list-manage.com/subscribe/post?u=8f1dc9a8a5caac3214e2997fe&amp;id=0c90bf5c11"
            )
            console.log("mailchimp = ", [mailchimpResOne, mailchimpResTwo])
        }

        // Send welcome email to user via SendGrid
        const emailSendResponse = await sendWelcomeEmail(
            userData.email,
            userData.name,
            resetPasswordResponse.ticket
        ).catch((err) => JSON.stringify(err))

        console.log("got past the welcome email send")

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
        method: "POST",
        url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
            client_id: `${process.env.AUTH0_CLIENTID}`,
            client_secret: `${process.env.AUTH_SECRET}`,
            audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
            grant_type: "client_credentials",
            scope: "create:users read:users",
        }),
    }

    return rp(options)
}

function checkUserExists(auth, name) {
    const options = {
        method: "GET",
        url: "https://ringofkeys.auth0.com/api/v2/users",
        qs: { q: `name:"${name}"`, search_engine: "v3" },
        headers: {
            authorization: `${auth["token_type"]} ${auth["access_token"]}`,
        },
    }

    return rp(options)
}

let pwd = Math.random().toString(36).slice(-14)

function createUser(auth, userInfo) {
    const options = {
        method: "POST",
        url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users`,
        headers: {
            authorization: `${auth["token_type"]} ${auth["access_token"]}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: userInfo.email,
            name: userInfo.name,
            password: pwd,
            user_metadata: {
                entity_id: userInfo.entity_id.toString(),
            },
            connection: "Username-Password-Authentication",
        }),
    }

    return rp(options)
}

function resetPassword(auth, email) {
    const options = {
        method: "POST",
        url: `https://${process.env.AUTH0_DOMAIN}/api/v2/tickets/password-change`,
        headers: {
            authorization: `${auth["token_type"]} ${auth["access_token"]}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            result_url: process.env.AUTH0_CALLBACK,
            connection_id: process.env.AUTH0_CONNECTIONID,
            email: email,
            ttl_sec: 1209600,
            mark_email_as_verified: true,
        }),
    }

    console.log("resetPassword body = ", options)

    return rp(options)
}

//Mailchimp email subscribe

function validateEmail(email) {
    var tester =
        /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/

    // taken from email-validator npm package
    if (!email) return false

    if (email.length > 256) return false

    if (!tester.test(email)) return false

    // Further checking of some things regex can't handle
    var [account, address] = email.split("@")
    if (account.length > 64) return false

    var domainParts = address.split(".")
    if (
        domainParts.some(function (part) {
            return part.length > 63
        })
    )
        return false

    return true
}

function subscribeEmailToMailchimp(url) {
    const options = {
        method: "GET",
        url,
    }

    return rp(options)
}

function convertListFields(fields) {
    let queryParams = ""
    for (const field in fields) {
        if (Object.prototype.hasOwnProperty.call(fields, field)) {
            // If this is a list group, not user field then keep lowercase, as per MC reqs
            // https://github.com/benjaminhoffman/gatsby-plugin-mailchimp/blob/master/README.md#groups
            const fieldTransformed =
                field.substring(0, 6) === "group[" ? field : field.toUpperCase()
            queryParams = queryParams.concat(
                `&${fieldTransformed}=${fields[field]}`
            )
        }
    }
    return queryParams
}

function addToMailchimpNode(email, fields, endpoint) {
    const isEmailValid = validateEmail(email)
    const emailEncoded = encodeURIComponent(email)
    if (!isEmailValid) {
        return Promise.resolve({
            result: "error",
            msg: "The email you entered is not valid.",
        })
    }

    // The following tests for whether you passed in a `fields` object. If
    // there are only two params and the second is a string, then we can safely
    // assume the second param is a MC mailing list, and not a fields object.
    if (arguments.length < 3 && typeof fields === "string") {
        endpoint = fields
    }

    // Generates MC endpoint for our jsonp request. We have to
    // change `/post` to `/post-json` otherwise, MC returns an error
    endpoint = endpoint.replace(/\/post/g, "/post-json")
    const queryParams = `&EMAIL=${emailEncoded}${convertListFields(fields)}`
    const url = `${endpoint}${queryParams}`

    return subscribeEmailToMailchimp(url)
}

async function sendWelcomeEmail(email, name, pwdResetUrl) {
    const msg = {
        to: email,
        from: "info@ringofkeys.org",
        bcc: [{ email: "royerbockus.ringofkeys@gmail.com" }],
        subject: "Welcome to Ring of Keys",
        text: "You can set up your password at " + pwdResetUrl,
        html: `<table border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer" style="border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;border: 0;max-width: 600px !important;">
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
                                  <a class="mcnButton " title="Complete your Key Profile" href="${pwdResetUrl}" target="_blank" style="font-weight: normal;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;">Complete your Key Profile</a>
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
                          
                              <p style="text-align: left;margin: 10px 0;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #202020;font-family: Helvetica;font-size: 16px;line-height: 150%;"><font color="#263e64"><strong>${name}, Good News!&nbsp;</strong></font><br>
  <font face="lato, helvetica neue, helvetica, arial, sans-serif">We have reviewed your application and are happy to say that your account is now verified and you are officially a Key!<br>
  &nbsp;<br>
  We’re so ecstatic to have you as a member of our <strong>RING OF KEYS</strong> network. We look forward to building a community together, elevating our narratives, and creating a more inclusive musical theatre landscape together.<br>
  <br>
  <strong>Please click or tap the button below to confirm your email address and set up your password. From here you will be able to complete your Key Profile. (PLEASE NOTE, THIS AUTHENTICATION EMAIL WILL EXPIRE TWO WEEKS FROM TODAY):</strong></font></p>
  
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
                                  <a class="mcnButton " title="Complete your Key Profile" href="${pwdResetUrl}" target="_blank" style="font-weight: normal;letter-spacing: normal;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;display: block;">Complete your Key Profile</a>
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
                          
                              <p style="text-align: left;margin: 10px 0;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #202020;font-family: Helvetica;font-size: 16px;line-height: 150%;"><font face="lato, helvetica neue, helvetica, arial, sans-serif">In our Members Only Dashboard, you will find access to Members Only content like a Keys Badge for your website or resumé. And don't forget to check out our Directory, which is a great place to start meeting other Members - you can directly message Keys with our messaging service!<br>
  &nbsp;<br>
  You’ll also find our Keyship program, which we hope you’ll consider investing in to help us offset our web and administrative costs.<br>
  &nbsp;<br>
  Our priority as an organization is to provide <strong>visibility</strong> for our Members to our theatre industry at large. Therefore, this Keyship is only suggestive and <strong>will not</strong> prohibit any Key from remaining visible within our Directory.<br>
  &nbsp;<br>
  Another priority as an organization is <strong>asserting our value</strong>. There is a long tradition in the arts of being expected to do things for free or our time being undervalued. RoK was built with the purpose of asserting the value of queer and trans artists. We hope to assert the value of our Leadership Team, our Keys, and Ring of Keys at large by working in opposition of these toxic traditions to model that our time and labor as artists has value.<br>
  &nbsp;<br>
  Please add <strong>info@ringofkeys.org</strong> to your contacts so you don't miss our Monthly Newsletters and Monthly Meetup and Workshop announcements.<br>
  <br>
  Feel free to reach out with any questions. We also welcome your ideas to grow our community! &nbsp;<br>
  &nbsp;&nbsp;<br>
  With love,<br>
  <a href="https://www.ringofkeys.org/keys/andrea-prestinario">Andrea Prestinario</a><br>
  &nbsp;<br>
  Executive Director, Co-Founder
  &nbsp;<br>
  Ring of Keys
  </font></p>
  
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
  <em><span style="font-family:lato,helvetica neue,helvetica,arial,sans-serif">Copyright © 2021 Ring of Keys Coalition, Inc., All rights reserved.</span></em><br>
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
