const acceptedOrigins = ['https://ringofkeys.org', 'http://localhost:8000']
const stripe = require('stripe')('sk_test_51HVQvlFPVymKtzoP5V9ZxrDkceMALuuFjwElpawwZCuJt7xMAnD3ReabX8jEUPwZp5ReOEQj5la8txCuvbeJcavN00jwAnqRkZ')

exports.handler = async (event, context, callback) => {
    if (event.httpMethod === 'OPTIONS') {
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
        const { priceIdArray } = JSON.parse(event.body)

        try {
            // Create Stripe Checkout session
            const session = stripe.checkout.sessions.create({
                mode: 'subscription',
                payment_method_types: ['card'],
                line_items: priceIdArray.map(pId => ({ price: pId, quantity: 1 })),
                success_url: event.headers.origin + '/keyship/success?session_id={CHECKOUT_SESSION_ID}',
                cancel_url: event.headers.origin + '/keyship/cancelled',
            })


            callback(null, {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: session.id,
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