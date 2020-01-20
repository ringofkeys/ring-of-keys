import React from 'react'
import { Field } from '../components/formfields'

const Filters = ({formik, filters}) => {
    return filters.map(filter => {
        if (filter.type === 'text') {
            return (
            <Field type='text' name={filter.field} label={filter.label}
                change={formik.handleChange} value={formik.values[filter.field]} placeholder={filter.placeholder}/>
            )
        } else if (filter.type === 'checkbox') {
            return (<div>
            <label>{filter.label}</label>
            <div className={`checkbox__grid ${(filter.field === 'locations' || filter.field === 'affiliations') ? 'two-cols' : ''}`}>
                {filter.values.map((val,i) => (
                <Field type='checkbox' name={`${filter.field}[${i}]`} label={val} change={formik.handleChange}
                    value={formik.values[filter.field]} key={val}/>
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
        }
        })
}
export default Filters