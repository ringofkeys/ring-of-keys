import React, { useState } from 'react'
import Popup from './popup'
import EmailSignupBar from './emailsignupbar'
import { hasEmailSignup, isAuthenticated } from '../utils/auth'

const EmailPopup = () => {
    const [popupState, setPopupState] = useState(hasEmailSignup() || isAuthenticated())

    return (
        <Popup isOpen={ popupState === false } canClose={ false }>
            <h2>Get Access</h2>
            <p>To Key Profiles Now</p>
            <div className='divider' style={{margin: '2vh 0'}}></div>
            <EmailSignupBar labelText='Email Address' afterSubmit={ () => setTimeout(() => {
                localStorage.setItem("hasEmailSignup", "true")
                setPopupState(true)

            }, 500) }/>
            <p style={{marginBlockStart: '3vh'}}>You'll receive our newsletter, but you can subscribe at any time.</p>
        </Popup>
    )
}

export default EmailPopup