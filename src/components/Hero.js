import React from "react"
import { Link } from 'gatsby'

export default function Hero({ type, ...otherProps }) {
    switch (type) {
        // Other hero types can be defined in DatoCMS and added as cases here in future.
        default:
            return <HomeHero {...otherProps}/>
    }
}

function HomeHero({ description, linkText, linkUrl }) {
    return (
        <div className='index_hero'>
            <h1>
                <span>
                    <span>Q</span>
                    <span>u</span>
                    <span>e</span>
                    <span>e</span>
                    <span>r</span>
                </span>&nbsp;
                The Stage
            </h1>
            <div class='index_hero__right-col'>
                { description }
                <Link to={ linkUrl } className='btn btn__learn-more'>{ linkText }</Link>
            </div>
        </div>
    )
}