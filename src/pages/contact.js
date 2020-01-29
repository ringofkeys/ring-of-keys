import React, { useState } from 'react'
import Layout from "../components/layout"
import ContactForm from '../components/contactform'
import './contact.css'

const Contact = () => {
    return (
        <Layout>
            <section className='contact_page'>
                <div className='contact_header'>
                    <h1>Contact Us</h1>
                    <p>Let's queer the stage.</p>
                </div>
                <ContactForm />
            </section>
        </Layout>
    )
}
export default Contact