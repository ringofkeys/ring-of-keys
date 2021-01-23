const products = [
    { 
        label: '✊ Solidarity',
        annual: {
            text: '$20/yr',
            keyship_id: 'price_1HVR3JFPVymKtzoPgialwcKs',
            sponsorship_id: 'price_1Hp5siFPVymKtzoPrmY19L3e',
        },
        monthly: {
            text: '$2/mo',
            keyship_id: 'price_1HVR3JFPVymKtzoPANbOx4VJ',
            sponsorship_id: 'price_1Hp5siFPVymKtzoPy3bAYAbk',
        },
    },
    { 
        label: '🤝 Multiplicity',
        annual: {
            text: '$50/yr',
            keyship_id: 'price_1Hp3LSFPVymKtzoPv39X72RP',
            sponsorship_id: 'price_1Hp5siFPVymKtzoPoAwH6w22',
        },
        monthly: {
            text: '$5/mo',
            keyship_id: 'price_1Hp3LSFPVymKtzoPU9SxOnE5',
            sponsorship_id: 'price_1Hp5siFPVymKtzoP18x5Y75z',
        },
    },
    { 
        label: '🔑 Possibility',
        annual: {
            text: '$100/yr',
            keyship_id: 'price_1Hp3LSFPVymKtzoPmtGWhnjo',
            sponsorship_id: 'price_1Hp5shFPVymKtzoPLTTEveO3',
        },
        monthly: {
            text: '$10/mo',
            keyship_id: 'price_1Hp3LRFPVymKtzoPIsbrtCJ5',
            sponsorship_id: 'price_1Hp5shFPVymKtzoPbz6HC2OB',
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