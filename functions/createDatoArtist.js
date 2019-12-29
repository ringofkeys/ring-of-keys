require('dotenv').config({
    path: `.env.${process.env.NODE_ENV}`
})
const SiteClient = require('datocms-client').SiteClient
const client = new SiteClient(process.env.DATO_CONTENT_TOKEN)

exports.handler = async () => {
    const res = await client.uploadImage('https://image.shutterstock.com/image-photo/cute-american-shorthair-cat-kitten-260nw-352176329.jpg')
        .then(image => {
            return client.items.create({
                "name": "Test Upload",
                "headshot": image,
                "pronouns": "They/Them/Theirs",
                "slug": "test-upload",
                "itemType": "177050",
        })
    })
    
    console.log(res)

    return {
        statusCode: 200,
        body: res,
    }

}