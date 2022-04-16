import React from "react"
import styles from './CheckboxGrid.module.css'
import dashboardStyles from 'styles/directory.module.css'

const CheckboxGrid = ({
  className,
  label,
  helpText,
  children,
}) => {
  return (
    <div className={dashboardStyles["cb-grid_wrapper"] + (className ? (' ' + className) : "")}>
        <label>
            <span>{label}</span>
            <span className={dashboardStyles["help_text"]}>&nbsp;{helpText} </span>
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
            <svg className={dashboardStyles["collapse_icon"]} viewBox="0 0 10 10">
            <path d="M 5.5 1 l 0 9" stroke="var(--rok-slate-blue_hex)" />
            <path d="M 1 5 l 9 0" stroke="var(--rok-slate-blue_hex)" />
            </svg>
        </label>
        <p className={dashboardStyles["help_text"] +' '+ dashboardStyles["collapsed"]}>{helpText}:</p>
        <div className={dashboardStyles["checkbox__grid"] +' '+ dashboardStyles["collapsed"] +' '+ styles["checkbox__grid"]}>
            {children}
        </div>
    </div>
  )
}
export default CheckboxGrid
