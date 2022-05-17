const { SiteClient, buildModularBlock } = require("datocms-client")
const client = new SiteClient(process.env.DATO_CONTENT_TOKEN)

async function handler(req, res) {
    const { id, ...fields } = JSON.parse(req.body)
    console.log({ id, fields })

    if (fields.socialMedia) {
        fields.socialMedia = fields.socialMedia.map(({ socialMediaLink }) =>
            buildModularBlock({
                socialMediaLink,
                itemType: "181488",
            })
        )
    }

    await client.items.update(id, fields)
    const item = await client.item.publish(id)

    res.status(200).json(item)
}

export default handler