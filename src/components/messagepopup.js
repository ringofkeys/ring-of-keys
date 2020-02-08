import React, { useState } from 'react'
import { Link } from 'gatsby'
import { Field } from './formfields'
import Popup from './popup'
import './popup.css'

const messageStatusText = {
    unsent: 'Send Message',
    loading: 'Loading...',
    success: 'Sent!',
    failure: 'Something Went Wrong',
}

const MessagePopup = ({ isOpen, artistId, onClose }) => {
    const [messageStatus, setMessageStatus] = useState('unsent')

    async function handleSubmit(e) {
        e.preventDefault()
        e.persist()
        setMessageStatus('sending')

        const formVals = ([]).slice.call(e.target.elements)
        const values = {}

        formVals.forEach(el => {
            values[el.name] = el.value
        })

        console.log('values = ', values)

        const sendRes = await sendMessage(values)

        if (sendRes.status === 200) {
            setMessageStatus('success')

            setTimeout(() => onClose(), 1250)
        } else {
            setMessageStatus('failure')
        }
    }

    return (
    <Popup isOpen={isOpen} onClose={onClose}>
        <h2>Send a message</h2>
        <p>Get connected with this talented artist.</p>
        <form onSubmit={ handleSubmit }>
            <Field type='text' name='fromName' label='Your Name' required={true}/>
            <Field type='email' name='fromEmail' label='Your Email Address' required={true} />
            <Field type='textarea' name='message' label='Your Message' required={true} />
            <label className='checkbox is-required'>
                <input type='checkbox' required />
                I have read and accepted the <Link to='/privacy'>Terms and Conditions and Privacy Policy.</Link>
            </label>
            <label className='checkbox is-required'>
                <input type='checkbox' required />
                I have read the Ring of Keys Community Guidelines. I promise my message is supportive.
            </label>
            <button type='submit' className={`btn ${ messageStatus === 'unsent' ? 'has-arrow' : '' } ${ messageStatus }`}
                style={{ width: '100%' }}>
                { messageStatusText[messageStatus] }
            </button>
        </form>
    </Popup>)
}
export default MessagePopup

async function sendMessage(data) {
    console.log('about to fetch!', data)

    let messageRes = 'no message returned'

    try {
        messageRes = await fetch('/.netlify/functions/createDatoMessage', {
            method: 'POST',
            body: JSON.stringify(data)
        })
    } catch(err) {
        console.error('fetching error, ', err)
    }

    console.log('messageRes = ', await messageRes.json())

    return messageRes
}