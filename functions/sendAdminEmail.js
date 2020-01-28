const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_KEY)


exports.handler = async (event) => {
    const data = JSON.parse(event.body)

    console.log('sent data = ', data)

    try {
        const msg = {
            to: 'frankjohnson1993@gmail.com',
            from: 'info@ringofkeys.org',
            subject: `New Contact Submission from ${data.email}`,
            text: 'A new Contact form submission through Ring of Keys',
            html:  `
                <h1>Ring of Keys Contact</h1>
                <table>
                    <tbody>
                        <tr>
                            <th>From Email:</th>
                            <td>${ data.email }</td>
                        </tr>
                        <tr>
                            <th>Subject:</th>
                            <td>${ data.subject }</td>
                        </tr>
                        <tr>
                            <th>Message:</th>
                            <td>${ data.message }</td>
                        </tr>
                    </tbody>
                </table>
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