const SiteClient = require('datocms-client').SiteClient
const client = new SiteClient(process.env.DATO_CONTENT_TOKEN)

exports.handler = async (event) => {
    try {
        const { id, data, isFile } = JSON.parse(event.body)

        if (isFile) {
            const uploadRes = await client.uploads.create({
                path:   data[Object.keys(data)[0]],
                author: 'via profile editor',
                defaultFieldMetadata: {
                    en: {
                        alt: [],
                        title: id+' via Editor'+Date.now(),
                        customData: {
                            watermark: false,
                        }
                    }
                }
            }).catch(err => console.error(err))
            data[Object.keys(data)[0]] = { uploadId: uploadRes.id }
        }

        const updateRes = await client.items.update(id, data).catch(err => console.error(err))

        console.log('updateRes = ', updateRes)

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