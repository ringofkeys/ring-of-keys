import React from 'react'
import { Link } from 'gatsby'
import SidebarLayout from "../components/sidebarlayout"
import ApplyForm from '../components/applyform'
import './apply.css'

const ApplyPage = () => {
    return (
        <SidebarLayout classNames={['apply']}
        title='Apply to be a Key' description='As part of our mission and vision, Ring of Keys curates a Directory of "Keys:" artists who self-identify as queer women, trans, and/or gender 
        non-conforming.'
        footerQuoteAttribution='Kat Griffin, Key Member (they/them)' footerQuoteBgColor='var(--rok-pale-green-1_hex)'
        footerQuoteText={
            <blockquote>
                With the help of Ring of Keys, I went from feeling so isolated 
                to really becoming like, almost overwhelmingly immersed with like-identified theatre people.
            </blockquote>
        }>
            <div className='apply__intro'>
                <h1>Apply to be a Key</h1>
                <p>
                As part of our mission and vision, Ring of Keys curates a Directory of "Keys:" artists who self-identify as queer women, trans, and/or gender 
                non-conforming. If you aren't a professional musical theatremaker, but you still love Ring of Keys, 
                be an ally! Check out <Link to='/news'>our news page</Link>, <a href='#footer'>sign up for our newsletter</a>, and stay connected to us on social 
                media. If you’d like to volunteer or stay involved in other ways <Link to='/contact'>send a message here.</Link>
                </p>
            </div>
            <ApplyForm />
        </SidebarLayout>
    )
}
export default ApplyPage