import React from "react"
import styles from "./ResourceCard.module.css"

const ResourceCard = ({ title, description, href, color }) => {
    return (
        <div className={styles["resource-card"]} style={{ "--theme-color": color }}>
            <h3>{title}</h3>
            <p>{description}</p>
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-link_ghost"
            >
                Learn More
            </a>
        </div>
    )
}
export default ResourceCard
