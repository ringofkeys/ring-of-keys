require('dotenv').config({
    path: `.env.${process.env.NODE_ENV}`
})
const SiteClient = require('datocms-client').SiteClient
const client = new SiteClient(process.env.DATO_CONTENT_TOKEN)


exports.handler = async () => {
    const res = await client.items.create({
    "name": "Test Upload",
    "headshot": {
        "uploadId": "1235",
        "alt": "Alt text",
        "title": "Image title",
    },
    "pronouns": "They/Them/Theirs",
    "slug": "test-upload",
    "itemType": "177050"
    })
    
    console.log(res)

    return {
        statusCode: 200,
        body: res
    }

}