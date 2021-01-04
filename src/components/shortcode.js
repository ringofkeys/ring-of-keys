import React from 'react'
import ConsultantBios from './ConsultantBios'
import ConsultantForm from './consultantform'
const shortcodes = {
    'consultancy-form': <ConsultantForm />,
    'consultant-bios': <ConsultantBios />,
}

const Shortcode = (props) => {
    console.log('a shortcode!', props)
    if (!shortcodes[props.type]) return null
    return (typeof shortcodes[props.type] === 'function') ? shortcodes[props.type](props) : shortcodes[props.type]
}
export default Shortcode
