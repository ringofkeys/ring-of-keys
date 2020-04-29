const { SiteClient, buildModularBlock } = require('datocms-client')
const client = new SiteClient(process.env.DATO_CONTENT_TOKEN)

exports.handler = async (event) => {
    try {
        const { id }= JSON.parse(event.body)

        const publishRes = await client.items.publish(id).catch(err => console.error(err))
        console.log('publishRes = ', publishRes)

        const buildTriggerId = '8003'
        client.buildTriggers.trigger(buildTriggerId)
            .then(() => {
                console.log('Done!');
            })
            .catch((error) => {
                console.error(error);
            });

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(publishRes),
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