const products = [
    { 
        label: '✊ Solidarity',
        annual: {
            text: '$20/yr',
            keyship_id: 'price_1IGELyFPVymKtzoP9VCGg5L0',
            sponsorship_id: 'price_1IGEPSFPVymKtzoPFUR1eVeL',
        },
        monthly: {
            text: '$2/mo',
            keyship_id: 'price_1IGELyFPVymKtzoPSGHgGkY7',
            sponsorship_id: 'price_1IGEPSFPVymKtzoPWC8SUOQy',
        },
    },
    { 
        label: '🤝 Multiplicity',
        annual: {
            text: '$50/yr',
            keyship_id: 'price_1IGG64FPVymKtzoPnxuzwmmP',
            sponsorship_id: 'price_1IGG0mFPVymKtzoPwYxiXFqC',
        },
        monthly: {
            text: '$5/mo',
            keyship_id: 'price_1IGG64FPVymKtzoP1XwriwkQ',
            sponsorship_id: 'price_1IGG0mFPVymKtzoP6SsOpcER',
        },
    },
    { 
        label: '🔑 Possibility',
        annual: {
            text: '$100/yr',
            keyship_id: 'price_1IGG7vFPVymKtzoPRYHAjlqC',
            sponsorship_id: 'price_1IGG94FPVymKtzoP1MKCEOyx',
        },
        monthly: {
            text: '$10/mo',
            keyship_id: 'price_1IGG7vFPVymKtzoPf95kWru4',
            sponsorship_id: 'price_1IGG94FPVymKtzoP4of1VP6o',
        },
    },
]

export const flattenedStripeProducts = products.map(p => {
    return [
        p.label,
        p.annual.keyship_id,
        p.annual.sponsorship_id,
        p.monthly.keyship_id,
        p.monthly.sponsorship_id,
    ]
})

export default products