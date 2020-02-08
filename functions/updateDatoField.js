const { SiteClient, buildModularBlock } = require('datocms-client')
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

        if (data.socialMedia) {
            data.socialMedia = data.socialMedia.map(link => buildModularBlock({
                socialMediaLink: link,
                itemType: '181488',
            }))

            console.log('data.socialMedia = ', data)
        }

        const updateRes = await client.items.update(id, data).catch(err => console.error(err))

        console.log('updateRes = ', updateRes)

        const publishRes = await client.items.publish(id).catch(err => console.error(err))

        console.log('publishRes = ', publishRes)

        // const deployEnvironmentId = '6240'
        // const deployRes = await client.deploymentEnvironments.trigger(deployEnvironmentId)
        // console.log('deployRes = ', deployRes) 

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