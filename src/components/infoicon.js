import React from 'react'

const InfoIcon = ({ infoText }) => (
    <div aria-role='region' tabIndex='0' className='info-icon'>
        i
        <span class='tooltip'>{ infoText }</span>
    </div>
)
export default InfoIcon