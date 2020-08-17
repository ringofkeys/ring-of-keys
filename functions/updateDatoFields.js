const { SiteClient, buildModularBlock } = require('datocms-client')
const client = new SiteClient(process.env.DATO_CONTENT_TOKEN)
const fileFields = ['headshot', 'featuredImage']

exports.handler = async (event, context, callback) => {
    if (event.httpMethod === 'OPTIONS') {
        callback(null, {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': ['Content-Type'],
            },
        })
    } else {
        try {
            const { id, name, data } = JSON.parse(event.body)

            const fileFildePromises = await Promise.all(fileFields.map(async fileField => {
                if (!data[fileField]) return

                return await client.uploads.create({
                    path:   data[fileField],
                    author: `${ name ? name : id } via profile editor`,
                    defaultFieldMetadata: {
                        en: {
                            alt: `editor-uploaded image of ${ name ? name : id}`,
                            title: `${ name ? name : id }, ${ fileField } via Editor, ${ new Date().toLocaleTimeString() +' '+ new Date().toLocaleDateString() }`,
                            customData: {
                                watermark: false,
                            }
                        }
                    }
                }).then(uploadRes => {
                    console.log('uploadRes', uploadRes)
                    data[fileField] = { uploadId: uploadRes.id }
                }).catch(err => console.error(err))
            }))

            if (data.socialMedia) {
                data.socialMedia = data.socialMedia.map(link => buildModularBlock({
                    socialMediaLink: link,
                    itemType: '181488',
                }))
            }

            const updateRes = await client.items.update(id, data).catch(err => console.error(err))

            console.log('updateRes', JSON.stringify(updateRes, null, 2))

            callback(null, {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(updateRes),
            })
        } catch (err) {
            callback({
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(err),
            })
        }
    }
}