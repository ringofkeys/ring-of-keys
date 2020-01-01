require('dotenv').config({
    path: `.env.${process.env.NODE_ENV}`,
})
const SiteClient = require('datocms-client').SiteClient
console.log('process.env.DATO_CONTENT_TOKEN = ', process.env.DATO_CONTENT_TOKEN)
const client = new SiteClient(process.env.DATO_CONTENT_TOKEN)

exports.handler = async (event) => {
    const { name,
            headshot,
            email,
            pronouns,
            isemailpublic,
            slug,
            fileType        
        } = JSON.parse(event.body)
    try {
        const uploadObj = {
            name,
            headshot,
            pronouns,
            ail: email,
            isemailpublic: isemailpublic === 'on',
            slug: slug,
            itemType: "177050",
        }

        console.log('got inside the function!', uploadObj)
            const response = await client.uploadImage('./static/Charlie_Baker.png')
            .then(image => {
                uploadObj.headshot = image,
                console.log('uploaded image!')
                return client.items.create(uploadObj)
            })
        

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(response),
        }
    } catch (err) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: err.toString()
        }
    }
}