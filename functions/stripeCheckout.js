const acceptedOrigins = ['https://ringofkeys.org', 'http://localhost:8888']
const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY)

exports.handler = async (event, context, callback) => {
    console.log('before all the things', event.body)
    if (event.httpMethod === 'OPTIONS') {
        console.log('options', event.body)
        if (acceptedOrigins.some(origin => origin === event.headers.origin)) {
            callback(null, {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': event.headers.origin,
                    'Access-Control-Allow-Headers': ['Content-Type'],
                },
            })
        } else {
            callback(new Error('Unauthorized origin: called from ', event.headers.origin), {
                statusCode: 403,
                headers: {
                    'Access-Control-Allow-Origin': acceptedOrigins[0],
                    'Access-Control-Allow-Headers': ['Content-Type'],
                },
            })
        }
    } else {
        console.log('post', event.body)
        const { user, priceId } = JSON.parse(event.body)

        try {
            // Create Stripe Checkout session
            const session = await stripe.checkout.sessions.create({
                mode: 'subscription',
                payment_method_types: ['card'],
                line_items: priceId.map(pId => ({ price: pId, quantity: 1 })),
                success_url: event.headers.origin + '/keyship?session_id={CHECKOUT_SESSION_ID}',
                cancel_url: event.headers.origin + '/keyship',
                metadata: {
                    dato_user: user,
                },
                subscription_data: {
                    metadata: {
                        "dato_user": user,
                    },
                },
            })

            console.log('session', session)

            callback(null, {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ sessionId: session.id}),
            })
        } catch (err) {
            callback(err, {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: err.message,
            })
        }
    }
}