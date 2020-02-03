const SiteClient = require('datocms-client').SiteClient
const client = new SiteClient(process.env.DATO_CONTENT_TOKEN)

exports.handler = async (event) => {
    try {
        const { id, data, isFile } = JSON.parse(event.body)

        if (isFile) {
            const uploadRes = await client.uploads.create({
                path:   data.headshot,
                author: data.name,
                copyright: data.name +' '+ new Date().getFullYear(),
                defaultFieldMetadata: {
                    en: {
                        alt: data.name,
                        title: data.name+' '+Date.now(),
                        customData: {
                            watermark: false,
                        }
                    }
                }
            }).catch(err => err)
            data = { uploadId: headshotUpload.id }
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