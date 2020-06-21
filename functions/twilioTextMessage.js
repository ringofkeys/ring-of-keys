const toPhoneNum = process.env.TWILIO_TO_PHONE
const fromPhoneNum = process.env.TWILIO_FROM_PHONE
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


exports.handler = async (event) => {
    const data = JSON.parse(event.body)

    console.log('sending to', toPhoneNum, data.msg)

    try {
        const txtMsgRes = await client.messages
            .create({
                body: data.msg,
                from: fromPhoneNum,
                to: toPhoneNum,
            }).catch(err => console.error(err))


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