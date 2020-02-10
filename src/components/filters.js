import React from 'react'
import { Field } from '../components/formfields'
 
const Filters = ({formik, filters}) => {
    return filters.map(filter => {
        if (filter.type === 'checkbox') {
            return (
            <div className={ filter.field }>
                <label>
                    <span>{filter.label}</span>
                    <span className='help_text'>{filter.helpText}</span>
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
                <p className='help_text collapsed'>{filter.helpText}</p>
                <div className={`checkbox__grid collapsed ${(filter.field === 'locations' || filter.field === 'affiliations') ? 'two-cols' : ''}`}>
                    {filter.values.map((val,i) => (
                    <Field type='checkbox' name={ `${filter.field}[${i}]` } label={ val } change={ formik.handleChange }
                        value={ formik.values[filter.field] } key={ val }/>
                    ))}
                    {/* <Field type='text' name='locationsOther' change={formik.handleChange} label='Other' value={formik.values.locationsOther} /> */}
                </div>
            </div>)
        } else if (filter.type === 'dropdown') {
            return (<>
            <label htmlFor={filter.field}>{filter.label}</label>
            <select name={filter.field} onChange={formik.handleChange}
                value={formik.values[filter.field]}>
                <option value=''>{filter.placeholder}</option>
                {filter.values.map(value => (
                    <option value={value}>
                    { value }
                    </option>
                )
                )}
            </select>
            </>)
        } else {
            return (
            <Field type='text' name={filter.field} label={filter.label}
                change={formik.handleChange} value={formik.values[filter.field]} placeholder={filter.placeholder}/>
            )
        }
        })
}
export default Filters