import React from "react"
import styles from "./InfoIcon.module.css"
import tooltipStyles from "styles/tooltip.module.css"

export default function InfoIcon({ infoText }) {
    return (
        <div
            tabIndex="0"
            className={styles["info-icon"] + " " + tooltipStyles["info-icon"]}
        >
            i<span className={tooltipStyles["tooltip"]}>{infoText}</span>
        </div>
    )
}
