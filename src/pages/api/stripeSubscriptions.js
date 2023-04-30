async function handler(req, res) {
    try {
        const { customerId } = req.body
        
        const customer = await fetch(
            `https://api.stripe.com/v1/customers/${customerId}?expand[]=subscriptions`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.GATSBY_STRIPE_SECRET_KEY}`,
                },
            }
        ).then((res) => res.json())

        res.status(200)
            .json(customer)
    } catch(err) {
        res.status(500)
            .json(err)
    }
}

export default handler