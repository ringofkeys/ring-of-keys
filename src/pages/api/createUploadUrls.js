import { SiteClient } from "datocms-client"

const client = new SiteClient(process.env.NEXT_DATO_API_TOKEN);

async function handler(req, res) {
    const filenames = JSON.parse(req.body)
    console.log({ filenames })

    const responses = filenames.map(([_, filename]) =>
        client.uploadRequest.create({ filename })
    )

    const data = (await Promise.all(responses)).map((d, i) => ([filenames[i][0], d]))

    res.status(200).json(data)
}

export default handler
