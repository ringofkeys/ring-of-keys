import React from 'react'
import InfoIcon from './InfoIcon'
import styles from './FormField.module.css'

export default function FormField({
    name,
    label,
    onChange,
    type,
    value,
    placeholder,
    className = "",
    inputClasses,
    required = false,
    accept = "",
    defaultChecked,
    defaultValue,
    helpText,
}) {

    return (
        <div className={styles["input__group"] + ((type) ? ' '+type : '') + ((className) ? ' '+className : '')}>
            {label && (
            <label htmlFor={name} className={`${required ? styles["is-required"] : ""}`}>
                {label}
                {helpText && <InfoIcon infoText={helpText} />}
            </label>
            )}
            {type !== "textarea" ? (
            <input
                id={name}
                name={name}
                type={type}
                onChange={onChange}
                value={value}
                placeholder={placeholder}
                className={inputClasses}
                required={required}
                accept={accept}
                defaultChecked={defaultChecked}
                defaultValue={defaultValue}
            />
            ) : (
            <textarea
                id={name}
                name={name}
                type={type}
                onChange={onChange}
                value={value}
                placeholder={placeholder}
                className={inputClasses}
                required={required}
                defaultChecked={defaultChecked}
                defaultValue={defaultValue}
            />
            )}
        </div>
    )
}