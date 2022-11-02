const acceptedOrigins = ["https://ringofkeys.org", "http://localhost:8888"]
const stripe = require("stripe")(process.env.GATSBY_STRIPE_SECRET_KEY)

exports.handler = async (event, context, callback) => {
    console.log("before all the things", event.body)
    if (event.httpMethod === "OPTIONS") {
        console.log("options", event.body)
        if (acceptedOrigins.some((origin) => origin === event.headers.origin)) {
            callback(null, {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": event.headers.origin,
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
        console.log("post", event.body)
        const { customer } = JSON.parse(event.body)

        try {
            // Create Stripe Checkout session
            const session = await stripe.billingPortal.sessions.create({
                customer,
                return_url: event.headers.origin + "/dashboard",
            })

            console.log("session", session)

            callback(null, {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(session),
            })
        } catch (err) {
            callback(err, {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: err.message,
            })
        }
    }
}
