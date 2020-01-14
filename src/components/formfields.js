import React from 'react'

export const Field = ({ name, label, change, value, type, placeholder, inputClasses, required = false}) => (
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
            />
        : <textarea id={name}
            name={name}
            type={type}
            onChange={change}
            value={value}
            placeholder={placeholder}
            className={inputClasses}
            required={required}
            />
        }
    </div>
)


