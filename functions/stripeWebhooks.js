const acceptedOrigins = ['https://ringofkeys.org', 'http://localhost:8888', 'https://stripe.com']
const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY)
const fetch = require('node-fetch')
const { URL } = process.env

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
        let e;

        try {
            e = JSON.parse(event.body);

            // Handle the events differently: currently we just send an admin email regardless.
            // switch (event.type) {
            //     case 'payment_intent.succeeded':
            //     const paymentIntent = event.data.object;
            //     // Then define and call a method to handle the successful payment intent.
            //     // handlePaymentIntentSucceeded(paymentIntent);
            //     break;
            //     case 'payment_method.attached':
            //     const paymentMethod = event.data.object;
            //     // Then define and call a method to handle the successful attachment of a PaymentMethod.
            //     // handlePaymentMethodAttached(paymentMethod);
            //     break;
            //     // ... handle other event types
            //     default:
            //     console.log(`Unhandled event type ${event.type}`);
            // }

            if (e.type) {
                await fetch(`${ URL }/.netlify/functions/sendAdminEmail`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        subject: `Stripe event fired: ${ e.type }`,
                        text: `new webhook event from Stripe for Ring of Keys`,
                        to: 'frank.ringofkeys@gmail.com',
                        from: 'info@ringofkeys.org',
                        html: `
                            <h1>Ring of Keys Stripe Event</h1>
                            <p>${ JSON.stringify(e.data.object, null, 2) }</p>
                        `
                    }),
                })
            }

            callback(null, {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({received: true}),
            })
        } catch (err) {
            callback(err, {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: `Webhook Error: ${err.message}`,
            })
        }
    }
}