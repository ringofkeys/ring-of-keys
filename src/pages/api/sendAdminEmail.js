import sgMail from "@sendgrid/mail"
sgMail.setApiKey(process.env.SENDGRID_KEY)

async function handler(req, res) {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body
    
    const {
        subject,
        text,
        to,
        from,
        data = { error: "no data provided" },
    

        // default message html
    html = `
        <h1>New submission to Ring of Keys contact form</h1>
        <p>The following submission was just placed in the <a href="https://ringofkeys.org/contact">RoK Contact Form</a>:</p>
        <table style="border-collapse: collapse;">
            <tbody>
                ${Object.keys(data)
                    .map(
                        (key) => `
                    <tr style="padding: .4rem 1rem;">
                        <th style="border: solid 1px #ddd; padding: .3rem .75rem; text-align: left; text-transform: capitalize">${key}</th>
                        <td style="border: solid 1px #ddd; padding: .3rem .75rem">${data[key]}</td>
                    </tr>`
                    )
                    .join("")}
            </tbody>
        </table>
    `,
    } = JSON.parse(req.body)
     const recipients = Array.isArray(to) ? to : [to]
    console.log("RECEIVED TO", to)
    console.log("SENT DATA = ", data) 
    try {
        const msg = {
            to: recipients,
            from,
            subject,
            text,
            html,
        }

        const emailRes = await sgMail.send(msg)

        res.status(200).json(emailRes)
    } catch (err) {
        console.error(err)

        res.status(500).json(err)
    }
}

export default handler
