const { SiteClient } = require("datocms-client")
const client = new SiteClient(process.env.DATO_CONTENT_TOKEN)

exports.handler = async (event, context, callback) => {
  if (event.httpMethod === "OPTIONS") {
    callback(null, {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": ["Content-Type"],
      },
    })
  } else {
    try {
      const { id } = JSON.parse(event.body)

      const publishRes = await client.items
        .publish(id)
        .catch(err => console.error(err))

      const buildTriggerId = "8003"
      client.buildTriggers
        .trigger(buildTriggerId)
        .then(() => {
          console.log("Done!")
        })
        .catch(error => {
          console.error(error)
        })

      callback(null, {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(publishRes),
      })
    } catch (err) {
      callback({
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(err),
      })
    }
  }
}
