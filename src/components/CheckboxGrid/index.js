import React from "react"
import styles from 'styles/directory.module.css'

const CheckboxGrid = ({
  className,
  label,
  helpText,
  children,
}) => {
  return (
    <div className={styles["cb-grid_wrapper"] + (className ? (' ' + className) : "")}>
        <label>
            <span>{label}</span>
            <span className={styles["help_text"]}>&nbsp;{helpText} </span>
            <input
            className="visually-hidden"
            type="checkbox"
            onChange={e => {
                e.target.nextSibling.classList.toggle("collapsed")
                ;[].slice
                .call(e.target.parentElement.parentElement.children)
                .forEach(el => el.classList.toggle("collapsed"))
            }}
            />
            <svg className={styles["collapse_icon"]} viewBox="0 0 10 10">
            <path d="M 5.5 1 l 0 9" stroke="var(--rok-slate-blue_hex)" />
            <path d="M 1 5 l 9 0" stroke="var(--rok-slate-blue_hex)" />
            </svg>
        </label>
        <p className={styles["help_text"] +' '+ styles["collapsed"]}>{helpText}:</p>
        <div className={styles["checkbox__grid"] +' '+ styles["collapsed"]}>
            {children}
        </div>
    </div>
  )
}
export default CheckboxGrid
