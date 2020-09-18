import React, { useState } from 'react'
import { Link } from 'gatsby'
import addToMailchimp from 'gatsby-plugin-mailchimp'
import './emailsignupbar.css'

const EmailSignupForm = ({ labelText = 'Receive news and updates from Ring of Keys', optIn = false,
    onSubmit = (val) => addToMailchimp(val),
    afterSubmit = () => {} }) => {
    const [submitStatus, setSubmitStatus] = useState('unsent')

    async function handleSignup(e) {
        e.preventDefault()
        e.persist()
        setSubmitStatus('sending')

        const sendRes = (!optIn) ? await onSubmit(e.target.elements[0].value) : onSubmit(e.target.elements[0].value, e.target.elements[2].checked)

        if (optIn) {
            addToMailchimp(e.target.elements[0].value)
        }

        console.log('sendRes = ', sendRes)

        if (sendRes.result === 'success' || sendRes.status === 200) {
            setSubmitStatus('sent')
            e.target.disabled = true
            afterSubmit(sendRes)
        } else {
            setSubmitStatus('failed')
            e.target.reset()
        }
    }

    return (
        <form className={'email-signup-bar' + (optIn ? ' opt-in' : '')} method='POST' onSubmit={ handleSignup }>
            <label className='email-input'>
                <span>{ labelText }</span>
                <input type='email' placeholder='Email Address' required />
            </label>
            <label className='privacy-consent input__group checkbox'>
                <input type='checkbox' required />
                <span>
                    I agree with the&nbsp;<Link to='/privacy' target='_blank' rel='noopener noreferrer'>Privacy Policy</Link> and <Link to='/terms-e-communications' target='_blank' rel='noopener noreferrer'>Terms of Use</Link>.</span>
            </label>
            { optIn &&
            <label className='privacy-consent input__group checkbox'>
                <input type='checkbox' />
                <span>I would like to receive news and updates from Ring of Keys.</span>
            </label>
            }
            <button className={`btn ${ submitStatus }`} type='submit' disabled={ submitStatus === 'sending' || submitStatus === 'sent' }>
                <svg viewBox='0 0 5 7'>
                    <path stroke='white' strokeLinecap='round'
                        d='M 1 1 l 3 2.5 l -3 2.5' />
                </svg>
            </button>
        </form>
    )
}
export default EmailSignupForm