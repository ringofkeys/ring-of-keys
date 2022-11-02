require("dotenv").config({
    path: `.env.${process.env.NODE_ENV}`,
})
const SiteClient = require("datocms-client").SiteClient
const client = new SiteClient(process.env.DATO_CONTENT_TOKEN)

exports.handler = async (event, context, callback) => {
    console.log("from within createDatoImgUrl!", event)
    console.log("event.body = ", event.body)

    try {
        const uploadRequest = await client.uploadRequest.create({
            filename: event.body,
        })

        callback(null, {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST",
            },
            body: JSON.stringify(uploadRequest),
        })
    } catch (err) {
        console.error(err)
        callback({
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST",
            },
            body: JSON.stringify(err),
        })
    }
}
