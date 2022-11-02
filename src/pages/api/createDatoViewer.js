const { SiteClient } = require("datocms-client")
const client = new SiteClient(process.env.DATO_CONTENT_TOKEN)

async function handler(req, res) {
    const data = JSON.parse(req.body)
    data.itemType = "194216"

    try {
        const newViewerRes = await client.items.create(data).catch((err) => {
            console.log("the issue is the Viewer Upload!", data)
            return err
        })

        res.status(200).json(newViewerRes)
    } catch (err) {
        console.log("An error was found!", err)

        res.status(500).json(err)
    }
}

export default handler
