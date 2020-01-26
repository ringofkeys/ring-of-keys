require('dotenv').config({
    path: `.env.${process.env.NODE_ENV}`,
  })
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_KEY)


exports.handler = async (event) => {
    const data = event.body

    try {
        const msg = {
            to: 'frank.ringofkeys@gmail.com',
            from: 'info@ringofkeys.org',
            subject: `New RoK User: ${ data.name }`,
            text: 'There is a new RoK user pending approval',
            html:  `
                <h1>New Key Awaiting Approval</h1>
                <p>
                    You can approve or reject them them by logging in to the 
                    <a href='https://ringofkeys.admin.datocms.com/editor/item_types/177050/items'>DatoCMS Dashboard</a>.
                </p>
                <table>
                    <tbody>
                        <tr>
                            <th>Field</th>
                            <th>Value</th>
                        </tr>
                        ${ Object.keys(data).map(key => (
                            `<tr>
                                <td>${ key }</td>
                                <td>${ data[key] }</td>
                            </tr>`
                        )) }
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