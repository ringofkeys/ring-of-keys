import { getEvents } from "lib/eventbrite"
import { NextApiHandler } from "next"

const handler: NextApiHandler = async (_, res) => {
    if (!process.env.EVENTBRITE_KEY) {
        return res.status(500).json({ error: "EVENTBRITE_KEY not set in Netlify" })
    }
    try {
        const events = await getEvents(process.env.EVENTBRITE_KEY)

        res.status(200).json(events)
    } catch (err) {
        console.error(err)
        res.status(500).json(err)
    }
}

export default handler
