import { buildClient } from "@datocms/cma-client-node"
import { DEMOGRAPHIC_FIELDS } from "lib/constants"

const client = buildClient({ apiToken: process.env.DATO_CONTENT_TOKEN })


// This function gets all the fields relevant to demographic reporting
// from all the member entries in DatoCMS using the site client.
async function handler(_, res) {
    console.log('DEMOGRAPHIC_FIELDS', DEMOGRAPHIC_FIELDS)

    try {
        const results = []

        const iterator = await client.items.listPagedIterator({
            filter: {
                type: '177050',
            },
        })

        for await (const item of iterator) {
            results.push(
                Object.fromEntries(
                    DEMOGRAPHIC_FIELDS.map(field => [field, item[field]])
                )
            )
        }
    
        res.status(200).json(results)
    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    }
}

export default handler