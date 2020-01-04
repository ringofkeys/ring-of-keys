require('dotenv').config({
    path: `.env.${process.env.NODE_ENV}`,
  })
const SiteClient = require('datocms-client').SiteClient
const client = new SiteClient(process.env.DATO_CONTENT_TOKEN)

exports.handler = async (event) => {
    const data = JSON.parse(event.body) //CONFIRMED THAT YOU NEED TO PARSE BODY

    console.log('isemailpublic', data.isemailpublic)
    try {
        const upload = await client.uploads.create({
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
        })

        const newUser = await client.items.create({
            name: data.name,
            email: data.email,
            pronouns: data.pronouns,
            headshot: {
                uploadId: upload.id,
            },
            isemailpublic: (data.isemailpublic === 'on') ? true : false,
            slug: data.slug,
            itemType: '177050',
        }).catch(err => err)

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(newUser),
        }
    } catch (err) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: err.message,
        }
    }
}