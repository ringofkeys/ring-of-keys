import React from 'react'
import ConsultantBios from './ConsultantBios'
import ConsultantForm from './consultantform'
import KeyshipButton from './KeyshipButton'
import DonorBoxWidget from './DonorBoxWidget'
import VimeoEmbed from './VimeoEmbed'

const shortcodes = {
    'consultancy-form': <ConsultantForm />,
    'consultant-bios': <ConsultantBios />,
    'keyship-button': <KeyshipButton />,
    'donorbox': <DonorBoxWidget />,
    'vimeo': VimeoEmbed,
}

const Shortcode = (props) => {
    // remove the quotes from each prop's value
    Object.keys(props).forEach(key => {
        if (typeof props[key] == 'string' && props[key].startsWith('"') && props[key].endsWith('"')) {
            props[key] = props[key].slice(1, props[key].length-1)
        }
    })
    console.log('a shortcode!', props)
    if (!shortcodes[props.type]) return null
    return (typeof shortcodes[props.type] === 'function') ? shortcodes[props.type](props) : shortcodes[props.type]
}
export default Shortcode