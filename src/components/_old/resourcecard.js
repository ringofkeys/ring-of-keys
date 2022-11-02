import React from "react"
import "./resourcecard.css"

const ResourceCard = ({ title, description, href, color }) => {
    return (
        <div className="resource-card" style={{ "--theme-color": color }}>
            <h3>{title}</h3>
            <p>{description}</p>
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-link_ghost"
            >
                Learn More
            </a>
        </div>
    )
}
export default ResourceCard
