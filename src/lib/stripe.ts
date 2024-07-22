import Stripe from "stripe"

export const stripeProducts = [
    {
        label: "✊ Solidarity",
        annual: {
            text: "$20/yr",
            keyship_id: "price_1IGELyFPVymKtzoP9VCGg5L0",
            sponsorship_id: "price_1IGEPSFPVymKtzoPFUR1eVeL",
        },
        monthly: {
            text: "$2/mo",
            keyship_id: "price_1IGELyFPVymKtzoPSGHgGkY7",
            sponsorship_id: "price_1IGEPSFPVymKtzoPWC8SUOQy",
        },
    },
    {
        label: "🤝 Multiplicity",
        annual: {
            text: "$50/yr",
            keyship_id: "price_1IGG64FPVymKtzoPnxuzwmmP",
            sponsorship_id: "price_1IGG0mFPVymKtzoPwYxiXFqC",
        },
        monthly: {
            text: "$5/mo",
            keyship_id: "price_1IGG64FPVymKtzoP1XwriwkQ",
            sponsorship_id: "price_1IGG0mFPVymKtzoP6SsOpcER",
        },
    },
    {
        label: "🔑 Possibility",
        annual: {
            text: "$100/yr",
            keyship_id: "price_1IGG7vFPVymKtzoPRYHAjlqC",
            sponsorship_id: "price_1IGG94FPVymKtzoP1MKCEOyx",
        },
        monthly: {
            text: "$10/mo",
            keyship_id: "price_1IGG7vFPVymKtzoPf95kWru4",
            sponsorship_id: "price_1IGG94FPVymKtzoP4of1VP6o",
        },
    },
]

export const flattenedStripeProducts = stripeProducts.map((p) => {
    return [
        p.label,
        p.annual.keyship_id,
        p.annual.sponsorship_id,
        p.monthly.keyship_id,
        p.monthly.sponsorship_id,
    ]
})

export function createPortalSession(customer: string) {
    return fetch("/api/stripePortal", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            customer,
        }),
    })
        .then((result) => {
            return result.json()
        })
        .then((session) => {
            window.location = session.url
        })
}

export function createCheckoutSession(userId: string, priceId: string): Promise<Stripe.Checkout.Session | null> {
    console.log("creating checkout session", { user: userId, priceId })
    return fetch("/api/stripeCheckout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user: userId,
            priceId,
        }),
    }).then((result) => {
        return result.json()
    })
}

export async function getCustomer(customerId: string): Promise<Stripe.Customer | null> {
    console.log("stripeId = ", customerId)
    const customer = fetch("/api/stripeSubscriptions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            customerId,
        }),
    }).then((res) => res.json()).catch(() => null)
    // .then(customer => console.log(customer))
    return customer
}

export function accountNeedsReview(customerData: Stripe.Customer) {
    return (
        customerData.delinquent ||
        !customerData.subscriptions ||
        ('total_count' in customerData.subscriptions && customerData.subscriptions.total_count === 0)
    )
}

export function getCurrentSubscription(customerData: Stripe.Customer) {
    return flattenedStripeProducts.findIndex((p) =>
        p.some(
            (el) =>
                el === customerData.subscriptions?.data[0].items.data[0].plan.id
        )
    )
}

export function getLastPayment(customerData: Stripe.Customer) {
    const startDateInMs = customerData.subscriptions?.data[0].current_period_start
    if (!startDateInMs) {
        return null
    }

    return new Date(
        startDateInMs * 1000
    )
}
