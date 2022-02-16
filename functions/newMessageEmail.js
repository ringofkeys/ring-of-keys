require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})
const SiteClient = require("datocms-client").SiteClient
const client = new SiteClient(process.env.DATO_CONTENT_TOKEN)
const sgMail = require("@sendgrid/mail")
sgMail.setApiKey(process.env.SENDGRID_KEY)

exports.handler = async event => {
  event.body = event.body.replace(/\r\n|\n|\r/gm, " ")

  const data = JSON.parse(event.body)

  try {
    const datoUser = await client.items.find(parseInt(data.toArtist))

    const msg = {
      to: datoUser.email,
      from: "info@ringofkeys.org",
      templateId: 'd-22d616ebfb2347cabb4a2bbb5936f4ba',
      text: 'You have a new message through Ring of Keys',
      dynamicTemplateData: {
        fromName: data.fromName,
      },
    }

    const emailRes = await sgMail.send(msg)

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(emailRes),
    }
  } catch (err) {
    console.error(err)

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: err.message,
    }
  }
}