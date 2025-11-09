import { buildClient } from "@datocms/cma-client"
const client = buildClient({ apiToken: process.env.DATO_CONTENT_TOKEN })

async function handler(req, res) {
  const filenames = JSON.parse(req.body)
  console.log({ filenames })

  const responses = filenames.map(([_, filename]) =>
    client.uploadRequest.create({ filename })
  )

  const data = (await Promise.all(responses)).map((d, i) => [
    filenames[i][0],
    d,
  ])

  res.status(200).json(data)
}

export default handler
