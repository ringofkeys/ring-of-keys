export default async function sendTxtMsg(msg) {
    const txtMsgRes = await fetch('/.netlify/functions/twilioTextMessage', {
        method: 'POST',
        body: JSON.stringify({
            msg
        }),
    }).catch(err => console.error(err))

    console.log('Twilio response: ', txtMsgRes)
}