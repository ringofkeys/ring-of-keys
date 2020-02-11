import React from 'react'
import { Field } from './formfields'


const CheckboxGrid = ({ className, label, helpText, fieldData, fieldName, children}) => {

    return (
        <div className={ `cb-grid_wrapper ${className ? className : ''}` }>
          <label>
              <span>{ label }</span>
              <span className='help_text'>&nbsp;{ helpText } </span>
              <input className='visually-hidden' type='checkbox'
              onChange={e => {
                  e.target.nextSibling.classList.toggle('collapsed');
                  ([]).slice.call(e.target.parentElement.parentElement.children).forEach(el => el.classList.toggle('collapsed'))
              }} />
              <svg className='collapse_icon' viewBox='0 0 10 10'>
                  <path d='M 5.5 1 l 0 9' stroke='var(--rok-slate-blue_hex)' />
                  <path d='M 1 5 l 9 0' stroke='var(--rok-slate-blue_hex)' />
              </svg>
          </label>
          <p className='help_text collapsed'>{ helpText }:</p>
          <div className='checkbox__grid collapsed'>
            { children }
          </div>
        </div>
    )
}
export default CheckboxGrid