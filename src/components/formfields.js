import React from 'react'

export const Field = ({ name, label, change, value, type, placeholder, inputClasses, required = false, accept='', defaultChecked, defaultValue}) => (
    <div className={`input__group ${type}`}>
        {label && <label htmlFor={name} className={`${required ? 'is-required' : ''}`}>{label}</label>}
        {type !== 'textarea' 
        ? <input
            id={name}
            name={name}
            type={type}
            onChange={change}
            value={value}
            placeholder={placeholder}
            className={inputClasses}
            required={required}
            accept={accept}
            defaultChecked={defaultChecked}
            defaultValue={defaultValue}
            />
        : <textarea id={name}
            name={name}
            type={type}
            onChange={change}
            value={value}
            placeholder={placeholder}
            className={inputClasses}
            required={required}
            defaultChecked={defaultChecked}
            defaultValue={defaultValue}
            />
        }
    </div>
)


