import React from 'react'
import { useFormik } from 'formik'
import { Field } from './formfields'
import Popup from './popup'
import './popup.css'

const MessagePopup = ({ isOpen, artistId, onClose }) => {
    const formik = useFormik({
        initialValues: {
            toArtist: (/-(\d+)-/).exec(artistId)[1],
            fromName: '',
            fromEmail: '',
            message: '',
        },
        onSubmit: values => {
            console.log(values)

            sendMessage(values)
        },
    })
    
    return (
    <Popup isOpen={isOpen} onClose={onClose}>
        <h2>Send a message</h2>
        <p>Get connected with this talented artist.</p>
        <form onSubmit={formik.handleSubmit}>
            <Field type='text' name='fromName' label='Your Name'
                change={formik.handleChange} value={formik.values.fromName} required={true}/>
            <Field type='email' name='fromEmail' label='Your Email Address'
                change={formik.handleChange} value={formik.values.fromEmail} required={true} />
            <Field type='textarea' name='message' label='Your Message'
                change={formik.handleChange} value={formik.values.message} required={true} />
            <label className='checkbox is-required'><input type='checkbox' required />
                I have read and accepted the Terms and Conditions and Privacy Policy.
            </label>
            <label className='checkbox is-required'><input type='checkbox' required />
                I have read the Ring of Keys Community Guidelines. I promise my message is supportive.
            </label>
            <button type='submit' className='btn has-arrow' style={{ width: '100%' }}>
                Send Message
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
}