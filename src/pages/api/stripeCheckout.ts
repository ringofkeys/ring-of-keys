import { NextApiRequest, NextApiResponse } from "next"

const acceptedOrigins = [
    "https://ringofkeys.org",
    "http://localhost:8888",
    "http://localhost:3000",
]
import Stripe from "stripe"
const stripe = new Stripe(process.env.GATSBY_STRIPE_SECRET_KEY || '', {
    apiVersion: "2022-11-15",
})

interface CheckoutSessionAPIRequest extends NextApiRequest {
    body: {
        user: string
        priceId: string[]
    }
}

const handler = async (
    req: CheckoutSessionAPIRequest,
    res: NextApiResponse
) => {
    console.log(process.env.GATSBY_STRIPE_SECRET_KEY)
    // console.log("before all the things", req)
    if (req.method === "OPTIONS") {
        console.log("options", req.body)
        if (
            req.headers.origin &&
            acceptedOrigins.some((origin) => origin === req.headers.origin)
        ) {
            res.status(200)
                .setHeader("Access-Control-Allow-Origin", req.headers.origin)
                .setHeader("Access-Control-Allow-Headers", ["Content-Type"])
        } else {
            res.status(403)
                .setHeader("Access-Control-Allow-Origin", acceptedOrigins[0])
                .setHeader("Access-Control-Allow-Headers", ["Content-Type"])
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
