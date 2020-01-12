import React, { useState, useEffect } from 'react'
import { useForm } from '../hooks/useForm'
import './popup.css'

const Popup = (props) => {
    const initState = {
        newState: {...props}
    };

    const [state, setState] = useState(initState)

    useEffect (() => { 
        setState({ ...state, newState: {...props} }) 
    }, [])
    
    return (
    <div className={`popup ${state.closed ? 'closed' : ''}`}>
        <div className='popup__card'>
            <h2>Closed = {JSON.stringify(state)}</h2>
            <h2>Get Access</h2>
            <p>to artists' profiles now</p>
            <label className='label_input-text'>Email Address<br/>
                <input type='email' />
            </label>
            <label><input type='checkbox' />
                I have read and accepted the Terms and Conditions and Privacy Policy.
            </label>
            <label><input type='checkbox' />
                I would like to receive news and updates from Ring of Keys.
            </label>
            <button className='btn has-arrow' style={{ width: '100%' }}>Continue</button>
            <button className='btn_close' onClick={() => props = {closed: true}}><span className='visually-hidden'>Close</span>
                <svg viewBox='0 0 5 5'>
                    <path d='M 1 1 l 3 3' />
                    <path d='M 1 4 l 3 -3' />
                </svg>
            </button>
        </div>
    </div>)
}
export default Popup