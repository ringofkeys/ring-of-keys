const SiteClient = require("datocms-client").SiteClient
const client = new SiteClient(process.env.DATO_CONTENT_TOKEN)

async function handler(req, res) {
    const {data, moderateMessages} = JSON.parse(req.body)
    data.itemType = "185201"

    try {
        const newMessage = await client.items.create(data)

        if (moderateMessages === false) {
            await client.item.publish(newMessage.id)
        }

        res.status(201).json(newMessage)
    } catch (err) {
        console.log("An error was found!", err)

        res.status(500).json(err)
    }
}

export default handler
