require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})
const SiteClient = require('datocms-client').SiteClient
const client = new SiteClient(process.env.DATO_CONTENT_TOKEN)


exports.handler = async (event) => {
  
  try {
    file = JSON.parse(event.body)

    const uploadRequest = await client.uploadRequest.create({
      "filename": file.fileName
    })

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(uploadRequest)
    }
  } catch (err) {
      return {
          statusCode: 500,
          headers: {
              'Access-Control-Allow-Origin': '*'
          },
          body: err.message
      }
  }
}