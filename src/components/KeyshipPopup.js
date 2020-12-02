import React, { useState, useReducer } from 'react'
import { Link } from 'gatsby'
import Popup from './popup'
import stripeProducts from '../utils/stripeProducts'
import './popup.css'
import './KeyshipPopup.css'
import { Helmet } from 'react-helmet'

const statusReducer = (state, action) => {
    switch (action.type) {
        case 'UNSENT':
            return { ...state, btnText: 'Begin Checkout', btnClass: 'unsent', }
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
        <input type='radio' name={type} id={`${type}-${duration}-${tier}`} data-productid={pId} defaultChecked={ tier == 1 && duration == 'annual' }  required />
        { text }
    </label>
)

const KeyshipPopup = ({ isOpen, onClose }) => {
    const [state, dispatch] = useReducer(statusReducer, {
        btnText: 'Begin Checkout',
        btnClass: 'unsent',
        showSponsorship: false,
        duration: 'annual',
    })

    async function handleSubmit(e) {
        e.preventDefault()
        e.persist()
        dispatch({ type: 'SENDING' })

        console.log(e)

        // if (sendRes.status === 201) {
        //     dispatch({ type: 'SUCCESS' })
        // } else {
        //     dispatch({ type: 'FAILURE' })        }
    } 

    return (<>
    <Helmet>
        <script src="https://js.stripe.com/v3/"></script>
    </Helmet>
    <Popup isOpen={isOpen} onClose={onClose}>
        <h2>Pick a Keyship Level</h2>
        <p>You can optionally also provide a sponsorship for another Key with financial need.</p>
        <form onSubmit={ handleSubmit }>
            <section>
                I'd like billed:
                <label>
                    <input type='radio' name='duration' onInput={(e) => dispatch({ type: 'UPDATE_DURATION', duration: 'annual'})}/>
                    Annually    
                </label> 
                <label>
                    <input type='radio' name='duration' onInput={(e) => dispatch({ type: 'UPDATE_DURATION', duration: 'monthly'})}/>
                    Monthly    
                </label> 
            </section>
            <fieldset id='keyship-options'>
                {stripeProducts && stripeProducts.length && stripeProducts.map((product, i) => (<>
                    <KeyShipOption type='keyship' duration={state.duration} tier={i+1} text={ product.label +' - '+ product[state.duration].text } pId={ product[state.duration].keyship_id }/>
                </>))}
            </fieldset>
            <label>
                <input type='checkbox' onChange={() => dispatch({ action: 'TOGGLE_SPONSORSHIP'})}/>
                I'd like to sponsor another Key!
            </label>
            {state.showSponsorship &&
                <fieldset id='sponsorship-options'>
                    {stripeProducts && stripeProducts.length && stripeProducts.map((product, i) => (<>
                        <KeyShipOption type='sponsorship' duration={state.duration} tier={i+1} text={ product.label +' - '+ product[state.duration].text } pId={ product[state.duration].sponsorship_id }/>
                    </>))}
                </fieldset>
            }
            <button type='submit' className={`btn ${ state.btnClass === 'unsent' ? 'has-arrow' : '' } ${ state.btnClass }`}
                style={{ width: '100%', padding: '1em 0' }}>
                { state.btnText }
            </button>
        </form>
    </Popup></>)
}
export default KeyshipPopup