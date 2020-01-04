require('dotenv').config({
    path: `.env.${process.env.NODE_ENV}`,
  })
const SiteClient = require('datocms-client').SiteClient
const client = new SiteClient(process.env.DATO_CONTENT_TOKEN)

exports.handler = async (event) => {
    const data = JSON.parse(event.body)
    console.log('data = ', data)

    try {
        const upload = await client.uploads.create({
            path:   data.headshot,
            author: 'New author!',
            copyright: 'New copyright',
            defaultFieldMetadata: {
                en: {
                    alt: data.name,
                    title: data.name+' '+Date.now(),
                    customData: {
                        watermark: false,
                    }
                }
            }
        });

        const newUser = await client.items.create({
            name: data.name,
            email: data.email,
            pronouns: data.pronouns,
            headshot: upload,
            isemailpublic: data.isemailpublic,
            slug: data.slug,
            itemType: '177050',
        })


        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(upload)
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