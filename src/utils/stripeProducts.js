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
            keyship_id: 'price_1IGELyFPVymKtzoPv8fyhaYd',
            sponsorship_id: 'price_1IGEPSFPVymKtzoPOih7H2WK',
        },
        monthly: {
            text: '$5/mo',
            keyship_id: 'price_1IGELyFPVymKtzoPhq0ak1SM',
            sponsorship_id: 'price_1IGEPSFPVymKtzoPA9aze6rn',
        },
    },
    { 
        label: '🔑 Possibility',
        annual: {
            text: '$100/yr',
            keyship_id: 'price_1IGELyFPVymKtzoPhyXTm3Ix',
            sponsorship_id: 'price_1IGEPSFPVymKtzoP4Kx0gvh8',
        },
        monthly: {
            text: '$10/mo',
            keyship_id: 'price_1IGELyFPVymKtzoPUbJPzvs7',
            sponsorship_id: 'price_1IGEPSFPVymKtzoPSUyFPunw',
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