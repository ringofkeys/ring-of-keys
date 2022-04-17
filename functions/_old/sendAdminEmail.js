const sgMail = require("@sendgrid/mail")
sgMail.setApiKey(process.env.SENDGRID_KEY)

exports.handler = async (event) => {
    const {
        subject,
        text,
        to,
        from,
        data = { error: "no data provided" },
        // default message html
        html = `
            <h1>Ring of Keys Contact</h1>
            <table>
                <tbody>
                    ${Object.keys(data).map(
                        (key) =>
                            `<tr>
                            <th>${key}</th>
                            <td>${data[key]}</td>
                        </tr>`
                    )}
                </tbody>
            </table>
        `,
    } = JSON.parse(event.body)

    console.log("sent data = ", data)

    try {
        const msg = {
            to,
            from,
            subject,
            text,
            html,
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
