import React from 'react'
import icon_key from '../images/icon_key.svg'


const QuoteBlock = ({ quoteText, quoteAttribution, bg}) => (
    <div className='section_quote-block' style={{background: bg ? bg : ''}}>
        <img className='icon_key' src={ icon_key } alt='key icon' />
        <div>
          <blockquote>{ quoteText }</blockquote>
          <p style={{color: 'white'}}>— { quoteAttribution }</p>
        </div>
    </div>
)
export default QuoteBlock