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
                        alt: 'editor-uploaded image',
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

        const publishRes = await client.items.publish(id)

        console.log('publishRes = ', publishRes)

        const deploymentEnvirons = await client.deploymentEnvironments.all()
        console.log('deploymentEnvironments = ', deploymentEnvirons)

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