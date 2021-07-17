import React from 'react'

const InfoIcon = ({ infoText }) => (
    <div tabIndex='0' className='info-icon'>
        i
        <span className='tooltip'>{ infoText }</span>
    </div>
)
export default InfoIcon