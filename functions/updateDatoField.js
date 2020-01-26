const SiteClient = require('datocms-client').SiteClient
const client = new SiteClient(process.env.DATO_CONTENT_TOKEN)

exports.handler = async (event) => {
    try {
        const { id, data } = JSON.parse(event.body)

        const updateRes = client.items.update(id, data)

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(updateRes),
        }
    } catch (err) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(err),
        }
    }
}