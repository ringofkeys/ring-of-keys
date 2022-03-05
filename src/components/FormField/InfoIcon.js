import React from 'react'

export default function InfoIcon({ infoText }) {
    return (
        <div tabIndex="0" className="info-icon">
            i<span className="tooltip">{infoText}</span>
        </div>
    )
}