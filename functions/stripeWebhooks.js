const acceptedOrigins = ['https://ringofkeys.org', 'http://localhost:8888', 'https://stripe.com']
const stripe = require('stripe')(process.env.GATSBY_STRIPE_SECRET_KEY)
const { SiteClient } = require('datocms-client')
const client = new SiteClient(process.env.DATO_CONTENT_TOKEN)
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

            console.log('from within the try/catch', { stripeEvent: e, type: e.type })

            let stripeId, datoId

            // Handle the events differently: currently we just send an admin email regardless.
            switch (e.type) {
                case 'customer.subscription.created':
                    console.log("Customer Subscription created!")
                    stripeId = e.data.object.customer
                    datoId = e.data.object.metadata.dato_user
                    
                    await updateDato(datoId, { stripeId })
                    break;
                case 'customer.subscription.updated':
                    console.log("Customer Subscription updated!")
                    datoId = e.data.object.metadata.dato_user
                    
                    if (e.data.object.cancel_at_period_end && e.data.object.canceled_at !== null) {
                        await updateDato(datoId, { stripeId: '' })
                    }
                    break;
            //     case 'payment_method.attached':
            //     const paymentMethod = event.data.object;
            //     // Then define and call a method to handle the successful attachment of a PaymentMethod.
            //     // handlePaymentMethodAttached(paymentMethod);
            //     break;
            //     // ... handle other event types
                default:
                    break;
            }

            await fetch(`${ URL }/.netlify/functions/sendAdminEmail`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({
                    subject: `Stripe event fired: ${ e.type }`,
                    text: `new webhook event from Stripe for Ring of Keys`,
                    to: 'andreaprestinario@gmail.com',
                    from: 'info@ringofkeys.org',
                    html: `
                        <h1>Ring of Keys Stripe Event</h1>
                        <pre>${ JSON.stringify(e.data.object, null, 2) }</pre>
                    `
                }),
            })

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

async function updateDato(id, data) {
    return Promise.all([
        client.items.update(id, data)
            .then(updateRes => console.log({ updateRes }))
            .catch(err => console.error(err)),
        client.items.publish(id)
            .then(publishRes => console.log({ publishRes }))
            .catch(err => console.error(err))
    ])
}