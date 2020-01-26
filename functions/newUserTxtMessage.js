const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


exports.handler = async (event) => {
    const data = JSON.parse(event.body)

    try {
        const txtMsgRes = await client.messages
            .create({
                body: `A new RoK user is ready for approval: ${data.name}`,
                from: '+12065696912',
                to: '+13308586940'
            })


        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(txtMsgRes),
        }
    } catch (err) {
        console.log('An error was found!', err)

        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(err),
        }
    }
}