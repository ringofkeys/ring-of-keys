import React from 'react'
import SidebarLayout from "../components/sidebarlayout"
import './apply.css'

const Donate = () => {
    return (
        <SidebarLayout title='Donate' description={`Your tax-deductible donation supports Ring of Key's mission to promote the hiring of self-identifying 
        queer women and TGNC artists in the musical theatre industry.`}>
            <h1>Donate</h1>
            <blockquote class='quote_graphic-bar'>
                Help us change the landscape of <br/>musical theatre.
            </blockquote>
            <p>
                Your tax-deductible donation supports our mission to promote the hiring of self-identifying 
                queer women and TGNC artists in the musical theatre industry.
            </p>
            <a href='carousel_card hover_scale' target='_blank' rel='noopener noreferrer' className='btn bg_slate' style={{padding: '.9em 2.6em'}}>
                Click Here to Donate
            </a>
            <div className='divider'></div>
            <p>
                “Throughout my professional career (a lot of which has been in big Broadway musicals) I’ve been dismayed and 
                discouraged at how straight-white-cis-male centric my projects have been. When I’ve brought it up with my 
                cis/white/straight friends it often is something that has never occurred to them. I want to join the cause 
                towards inclusivity, diversity, intersectional feminism, the whole shebang. I’m endeavoring to do that in 
                the kinds of projects I say yes to, the hard conversations I have with my friends to raise awareness and 
                also evolve in my own thinking, and financially supporting organizations like yours.” 
            </p>
            <p>&ndash; Anonymous</p>
        </SidebarLayout>
    )
}
export default Donate