require('dotenv').config({
    path: `.env.${process.env.NODE_ENV}`,
  })
const SiteClient = require('datocms-client').SiteClient
const client = new SiteClient(process.env.DATO_CONTENT_TOKEN)

exports.handler = async (event) => {
    const data = JSON.parse(event.body)

    console.log('data = ', data)
    data.itemType = '185201'

    try {
        const newMessage = await client.items.create(data)
            .catch(err => console.error(err))

        console.log('newMessage = ', newMessage)
        
        return {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(newMessage),
        }
    } catch(err) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: err.message,
        }
    }
}