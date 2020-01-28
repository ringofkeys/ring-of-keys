import React, { useState } from 'react'
import Layout from "../components/layout"
import './contact.css'

const Contact = () => {
    const [formStatus, setFormStatus] = useState('unsent')
    const formLabels = {
        sending: 'Loading...',
        unsent: 'Submit',
        success: 'Sent!',
        failure: 'Please Try Again Later',
    }

    async function handleFormSubmit(e) {
        setFormStatus('sending')
        e.preventDefault()
        e.persist()

        const formEls = [].slice.call(e.target.elements)

        const formData = {
            email: formEls.find(el => el.name === 'email').value,
            subject: formEls.find(el => el.name === 'subject').value,
            message: formEls.find(el => el.name === 'message').value,
        }

        console.log('formData = ', formData)

        const emailRes = await sendAdminEmail(formData)

        if (emailRes.status === 200) {
            setFormStatus('success')
        } else {
            setFormStatus('failure')
            e.target.reset()
        }
    }

    return (
        <Layout>
            <section className='contact_page'>
                <div className='contact_header'>
                    <h1>Contact Us</h1>
                    <p>Let's queer the state.</p>
                </div>
                <form className='contact_form' onSubmit={handleFormSubmit} method='POST'>
                    <div className='input__group email'>
                        <label htmlFor='email'>Email</label>
                        <input id='field-email' name='email' type='email' required />
                    </div>
                    <div className='input__group select'></div>
                    <label htmlFor='subject'>Subject</label>
                    <select id='field-subject' name='subject' required>
                        <option value='general'>General inquiries</option>
                        <option value='hiring'>Hire Ring of Keys</option>
                        <option value='job submission'>Submit a casting notice for Keys</option>
                        <option value='volunteer'>Request to volunteer with Ring of Keys</option>
                    </select>
                    <div className='input__group email'>
                        <label htmlFor='message'>Message</label>
                        <textarea id='field-message' name='message' required/>
                    </div>
                    <button type='submit' className={`btn bg_slate has-arrow ${ formStatus }`} disabled={ formStatus === 'sending' || formStatus === 'success'}>
                        { formLabels[formStatus] }
                    </button>
                </form>
            </section>
        </Layout>
    )
}
export default Contact


async function sendAdminEmail(data) {
    return await fetch('/.netlify/functions/sendAdminEmail', {
        method: 'POST',
        body: JSON.stringify(data)
    })
}