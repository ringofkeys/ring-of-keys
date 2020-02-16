require('dotenv').config({
    path: `.env.${process.env.NODE_ENV}`,
  })
const SiteClient = require('datocms-client').SiteClient
const client = new SiteClient(process.env.DATO_CONTENT_TOKEN)

exports.handler = async (event) => {
    console.log('function is called!', event.body)

    const data = JSON.parse(event.body)
    data.itemType = '194216'

    console.log('data = ', data)

    try {        
        const newViewerRes = await client.items.create(data).catch(err => {
            console.log('the issue is the Viewer Upload!', data)
            return err
        })

        console.log('newViewer = ', newViewerRes)


        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(newViewerRes),
        }
    } catch (err) {
        console.log('An error was found!', err)

        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(err),
        }
    }
}