exports.handler = async event => {
    cosnt subject = event.queryStringParameters.name || 'World'
    return {
        statusCode: 200,
        body: `Hello ${subject}!`
    }
}