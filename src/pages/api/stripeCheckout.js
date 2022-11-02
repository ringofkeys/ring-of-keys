const acceptedOrigins = ["https://ringofkeys.org", "http://localhost:8888", "http://localhost:3000"]
const stripe = require("stripe")(process.env.GATSBY_STRIPE_SECRET_KEY)

async function handler(req, res) {
    console.log(process.env.GATSBY_STRIPE_SECRET_KEY)
    // console.log("before all the things", req)
    if (req.httpMethod === "OPTIONS") {
        console.log("options", req.body)
        if (acceptedOrigins.some((origin) => origin === req.headers.origin)) {
            callback(null, {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": req.headers.origin,
                    "Access-Control-Allow-Headers": ["Content-Type"],
                },
            })
        } else {
            callback(
                new Error(
                    "Unauthorized origin: called from ",
                    event.headers.origin
                ),
                {
                    statusCode: 403,
                    headers: {
                        "Access-Control-Allow-Origin": acceptedOrigins[0],
                        "Access-Control-Allow-Headers": ["Content-Type"],
                    },
                }
            )
        }
    } else {
        // console.log("post", req.body)
        const { user, priceId } = req.body

        try {
            // Create Stripe Checkout session
            const session = await stripe.checkout.sessions.create({
                mode: "subscription",
                payment_method_types: ["card"],
                line_items: priceId.map((pId) => ({ price: pId, quantity: 1 })),
                success_url:
                    req.headers.origin +
                    "/keyship?session_id={CHECKOUT_SESSION_ID}",
                cancel_url: req.headers.origin + "/keyship",
                metadata: {
                    dato_user: user,
                },
                subscription_data: {
                    metadata: {
                        dato_user: user,
                    },
                },
            })

            console.log("session", session)

            res.status(200).json({ sessionId: session.id })
        } catch (err) {
            res.status(400).json(err)
        }
    }
}

export default handler