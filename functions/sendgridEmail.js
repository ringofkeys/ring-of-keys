require('dotenv').config({
    path: `.env.${process.env.NODE_ENV}`,
  })
const SiteClient = require('datocms-client').SiteClient
const client = new SiteClient(process.env.DATO_CONTENT_TOKEN)
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_KEY)


exports.handler = async (event) => {
    const data = event.body

    try {
        const datoUser = await client.items.find(parseInt(data.toArtist))

        const msg = {
            to: datoUser.email,
            from: 'info@ringofkeys.org',
            subject: `New RoK Message from ${data.fromName}`,
            text: 'You have a new message through Ring of Keys',
            html:  `
                <h1>There's a new message for you on Ring of Keys</h1>
                <p>From ${ data.fromName } (${ data.fromEmail })</p>
                <p>${ data.message }</p>
            `,
        }
        
        const emailRes = await sgMail.send(msg)

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(emailRes),
        }
    } catch(err) {
        console.error(err)

        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: err.message,
        }
    }
}