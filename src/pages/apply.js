import React from 'react'
import SidebarLayout from "../components/sidebarlayout"
import ApplyForm from '../components/applyform'
import './apply.css'

const ApplyPage = () => {
    return (
        <SidebarLayout>
            <div className='apply__intro'>
                <h1>Apply to be a Key</h1>
                <p>
                    Ring of Keys is a network of industry professionals who identify as queer women, trans, and/or gender non-conforming. 
                    If you aren't a professional musical theatremaker, but you still love Ring of Keys, be an ally! Check out our resources 
                    page, sign up for our newsletter, and stay connected to us on social media. You can email info@ringofkeys.org if you’d 
                    like to volunteer or stay involved in other ways.
                </p>
            </div>
            <ApplyForm />
        </SidebarLayout>
    )
}
export default ApplyPage