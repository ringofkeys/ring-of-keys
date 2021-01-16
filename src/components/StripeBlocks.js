import React, { useState, useReducer, useEffect } from 'react'
import stripeProducts, { flattenedStripeProducts } from '../utils/stripeProducts'
import './StripeBlocks.css'

const keyshipReducer = (state, action) => {
    switch (action.type) {
        case 'UNSENT':
            return { ...state, btnText: 'Sign Up Now', btnClass: 'unsent', }
        case 'SENDING':
            return { ...state, btnText: 'Loading...', btnClass: 'sending' }
        case 'SUCCESS':
            return { ...state, btnText: 'Redirecting...', btnClass: 'success' }
        case 'FAILURE':
            return { ...state, btnText: 'Something Went Wrong', btnClass: 'failure' }
        case 'TOGGLE_SPONSORSHIP':
            return { ...state, showSponsorship: !state.showSponsorship }
        case 'UPDATE_DURATION':
            return { ...state, duration: action.duration }
        default:
            return state
    }
}

const KeyShipOption = ({ type, duration, tier, text, pId }) => (
    <label class={`keyship-popup__option ${duration} ${type}`}>
        <input type='radio' name={type} id={`${type}-${duration}-${tier}`} value={pId} defaultChecked={ tier == 1 && duration == 'annual' }  required />
        <span>{ text }</span>
    </label>
)

const KeyshipForm = () => {
    const [state, dispatch] = useReducer(keyshipReducer, {
        btnText: 'Sign Up Now',
        btnClass: 'unsent',
        showSponsorship: false,
        duration: 'annual',
    })

    async function handleSubmit(e) {
        e.preventDefault()
        e.persist()
        dispatch({ type: 'SENDING' })

        const serializeForm = function (form) {
            var obj = {};
            var formData = new FormData(form);
            for (var key of formData.keys()) {
                obj[key] = formData.get(key);
            }
            return obj;
        };
        
        const formData = serializeForm(e.target)
        const prices = (!formData.sponsorship) ? [formData.keyship] : [formData.keyship, formData.sponsorship]

        createCheckoutSession(prices)
            .then(({ sessionId }) => {
                const stripe = window.Stripe(process.env.GATSBY_STRIPE_PUBLIC_KEY)
                stripe.redirectToCheckout({ sessionId })
            })
            //.then(handleResult)

        // if (sendRes.status === 201) {
        //     dispatch({ type: 'SUCCESS' })
        // } else {
        //     dispatch({ type: 'FAILURE' })        }
    }

    return (
        <form onSubmit={ handleSubmit }>
            <section>
                <label>
                    <input type='radio' name='duration' onChange={(e) => dispatch({ type: 'UPDATE_DURATION', duration: 'annual'})} defaultChecked={ state.duration === 'annual' }/>
                    <span>Annually</span>    
                </label> 
                <label>
                    <input type='radio' name='duration' onChange={(e) => dispatch({ type: 'UPDATE_DURATION', duration: 'monthly'})} defaultChecked={ state.duration === 'monthly' }/>
                    <span>Monthly</span>    
                </label> 
            </section>
            <fieldset id='keyship-options'>
                {stripeProducts && stripeProducts.length && stripeProducts.map((product, i) => (<>
                    <KeyShipOption type='keyship' duration={state.duration} tier={i+1} text={ product.label +' - '+ product[state.duration].text } pId={ product[state.duration].keyship_id }/>
                </>))}
            </fieldset>
            <label>
                <input type='checkbox' onChange={() => dispatch({ type: 'TOGGLE_SPONSORSHIP'})}/>
                <span>I'd like to sponsor someone else too</span>
            </label>
            {state.showSponsorship &&
                <fieldset id='sponsorship-options'>
                    {stripeProducts && stripeProducts.length && stripeProducts.map((product, i) => (<>
                        <KeyShipOption type='sponsorship' duration={state.duration} tier={i+1} text={ product.label +' - '+ product[state.duration].text } pId={ product[state.duration].sponsorship_id }/>
                    </>))}
                </fieldset>
            }
            <button type='submit' className={`btn ${ state.btnClass }`} style={{ background: 'var(--rok-gold-1_hex', marginTop: '1rem' }}>
                { state.btnText }
            </button>
        </form>
    )
}

export const StripeSubscribed = ({ stripeId }) => {
    const [status, setStatus] = useState(false)

    useEffect(() => {
        getCustomer(stripeId).then(customerData => {
            const tier = flattenedStripeProducts.findIndex(p => p.some(el => el === customerData.subscriptions.data[0].items.data[0].plan.id))
            const lastPaid = new Date(customerData.subscriptions.data[0].current_period_start * 1000) // Stripe stores timestamps in seconds since epoch, not milliseconds
            const shortDate = (num) => num.toString().padStart(2, '0')

            console.log({ tier, lastPaid })
            setStatus(<p>✨ Thank you for being a <strong>`{ (tier >= 0) && stripeProducts[tier].label }</strong> paying member!
            Your last payment was on <strong>{ shortDate(lastPaid.getMonth()+1) }/{ shortDate(lastPaid.getDate()+1) }/{ lastPaid.getFullYear().toString().substr(-2) }</strong>.</p>)
        })
    }, [])

    return (!status) ? <>loading</>
        : status
}

export const StripeUnsubscribed = () => {
    return <section className='block block_stripe'>
                <h2>Keyship</h2>
                <p>Ring of Keys runs on the generosity of industry professionals like you! To help us keep the lights on and ceilings shattering, please consider becoming a paying member, and even sponsoring another Key.</p>
                <KeyshipForm />
            </section>
}



function createCheckoutSession(priceId) {
    return fetch('/.netlify/functions/stripeCheckout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            priceId: priceId,
        })
    }).then((result) => {
        return result.json()
    })
}

async function getCustomer(id) {
    console.log('stripeId = ', id)
    const customer = fetch(`https://api.stripe.com/v1/customers/${ id }?expand[]=subscriptions`, {
        headers: {
            Authorization: `Bearer ${ process.env.GATSBY_STRIPE_SECRET_KEY }`,
        }
    }).then(res => res.json())
    // .then(customer => console.log(customer))
    return customer
}