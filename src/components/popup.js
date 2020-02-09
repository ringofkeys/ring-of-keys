import React from 'react'
import './popup.css'

const Popup = ({ isOpen, onClose, children }) => {
    
    return (
    <div className={`popup ${(isOpen) ? 'open' : ''}`}>
        <div className='popup__card'>
            { children }
            <button className='btn_close' onClick={(e) => onClose(e)}><span className='visually-hidden'>Close</span>
                <svg viewBox='0 0 5 5'>
                    <path d='M 1 1 l 3 3' stroke='black' />
                    <path d='M 1 4 l 3 -3' stroke='black' />
                </svg>
            </button>
        </div>
    </div>)
}
export default Popup