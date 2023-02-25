const { getEvents } = require("lib/eventbrite");

async function handler(req, res) {
    try {
        const eventResponse = await getEvents(process.env.EVENTBRITE_KEY)

        res.status(200).json(eventResponse)
    } catch(err) {
        console.error(err)
        res.status(500).json(err)
    }
}

export default handler