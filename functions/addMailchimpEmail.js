

exports.handler = async (event) => {
    try {
        

        return {
            statusCode: 200,
            body: JSON.stringify(emailSendResponse),
        }
    } catch (err) {
        return { statusCode: 500, body: err.toString() }
    }
}