import React from "react"
import styles from "./CheckboxGrid.module.css"
import directoryStyles from "styles/directory.module.css"

const CheckboxGrid = ({ className, label, helpText, children }) => {
    return (
        <div
            className={
                directoryStyles["cb-grid_wrapper"] +
                (className ? " " + className : "")
            }
        >
            <label>
                <span>{label}</span>
                <span className={directoryStyles["help_text"]}>
                    &nbsp;{helpText}{" "}
                </span>
                <input
                    className="visually-hidden"
                    type="checkbox"
                    onChange={(e) => {
                        e.target.nextSibling.classList.toggle(
                            directoryStyles["collapsed"]
                        )
                        ;[].slice
                            .call(e.target.parentElement.parentElement.children)
                            .forEach((el) =>
                                el.classList.toggle(
                                    directoryStyles["collapsed"]
                                )
                            )
                    }}
                />
                <svg
                    className={directoryStyles["collapse_icon"]}
                    viewBox="0 0 10 10"
                >
                    <path
                        d="M 5.5 1 l 0 9"
                        stroke="var(--rok-slate-blue_hex)"
                    />
                    <path d="M 1 5 l 9 0" stroke="var(--rok-slate-blue_hex)" />
                </svg>
            </label>
            <p
                className={
                    directoryStyles["help_text"] +
                    " " +
                    directoryStyles["collapsed"]
                }
            >
                {helpText}:
            </p>
            <div
                className={
                    directoryStyles["checkbox__grid"] +
                    " " +
                    directoryStyles["collapsed"] +
                    " " +
                    styles["checkbox__grid"]
                }
            >
                {children}
            </div>
        </div>
    )
}
export default CheckboxGrid
