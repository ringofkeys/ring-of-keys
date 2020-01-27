import React, { useState } from 'react'
import addToMailchimp from 'gatsby-plugin-mailchimp'
import './emailsignupbar.css'

const EmailSignupForm = ({ handleHasSignedUp }) => {
    const [submitStatus, setSubmitStatus] = useState('unsent')

    async function handleSignup(e) {
        e.preventDefault()
        e.persist()
        setSubmitStatus('sending')

        const sendRes = await addToMailchimp(e.target.elements[0].value)

        console.log('sendRes = ', sendRes)

        if (sendRes.result === 'success') {
            setSubmitStatus('sent')
            e.target.disabled = true
        } else {
            setSubmitStatus('failed')
            e.target.reset()
        }
    }

    return (
        <form className='email-signup-bar' method='POST' onSubmit={handleSignup}>
            <label className='email-input'>
                <span>Receive news and updates from Ring of Keys</span>
                <input type='email' placeholder='Sign up for our newsletter' required />
            </label>
            <label className='privacy-consent'>
                <input type='checkbox' required />
                I agree with the Privacy Policy and Terms of Use
            </label>
            <button className={`btn ${ submitStatus }`} type='submit' disabled={ submitStatus === 'sending' }>
                <svg viewBox='0 0 5 7'>
                    <path stroke='white' strokeLinecap='round'
                        d='M 1 1 l 3 2.5 l -3 2.5' />
                </svg>
            </button>
        </form>
    )
}
export default EmailSignupForm