const acceptedOrigins = ["https://ringofkeys.org", "http://localhost:8888"]
const stripe = require("stripe")(process.env.GATSBY_STRIPE_SECRET_KEY)

async function handler(req, res) {
    console.log("before all the things", req.body)
    const { customer } = req.body

    try {
        // Create Stripe Checkout session
        const session = await stripe.billingPortal.sessions.create({
            customer,
            return_url: req.headers.origin + "/dashboard",
        })

        console.log("session", session)

        res.status(200)
            .json(session)
    } catch (err) {
        res.status(500)
            .json(err)
    }
}

export default handler