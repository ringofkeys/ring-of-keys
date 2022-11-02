import React, { useRef } from "react"
import Link from "next/link"
// import { useIntersect } from "hooks/useIntersect"
import render from "html-react-parser"
import styles from "./Carousel.module.css"
import { toDateString, toDateTime } from "lib/utils"
import { MarkdownRenderer, parseMarkdown } from "lib/markdown"

const TRUNCATE_LENGTH = 120

function cssModularize(cssClassString) {
    cssClassString
        .split(" ")
        .map((c) => styles[c])
        .join(" ")
}

function ImageOrFallback({ src, className = '', ...props }) {
    const rotation = useRef(Math.random() * 360)
    return (src) 
        ? (<div className={styles['img_wrapper']}>
            <img src={src} className={className} {...props} />
        </div>)
        : (<div
            className={styles['img_replacement'] + " fullwidth " + className}
            style={{ "--grad-rotate": rotation.current + "deg" }}
            {...props}
        ></div>)
}

function truncateDescription(descriptionHTML) {
    const descriptionObjects = render(descriptionHTML)
    const truncatedPara = descriptionObjects.find(
        (d) =>
            typeof d == "string" ||
            (d.type == "p" && typeof d.props.children == "string")
    )
    if (!truncatedPara) return
    return (
        (typeof truncatedPara == "string"
            ? truncatedPara
            : truncatedPara.props.children
        ).slice(0, TRUNCATE_LENGTH) + "..."
    )
}

const CarouselCard = ({entry, entryType, className}) => {
    const excerptLength = 128

    return (
        <li
            className={`${styles["carousel_card"]} ${styles["hover_scale"]} ${className}`}
        >
            <Link href={entry.externalUrl || `/${entryType}/${entry.slug}`}>
                <a {...((entry.externalUrl) ? {rel: 'nofollower noreferrer', target: '_blank'} : '')}>
                    <ImageOrFallback src={entry.featuredImage?.url} alt={entry.featuredImage?.alt} />
                    {entry.title && (
                    <h3>{entry.title.substr(0, 70) + (entry.title.length > 70 ? "..." : '')}</h3>)}
                    <div className={styles.cardDetails}>
                        {(entry.startTime || entry.publishDate) && (
                        <p><em>{entry.startTime ? toDateTime(new Date(entry.startTime)) : toDateString(new Date(entry.publishDate))}</em></p>
                        )}
                        <p>
                            {(entry.body)
                                ? (entry.body.substr(0, excerptLength) + (entry.body.length > excerptLength ? "..." : ''))
                                : <MarkdownRenderer ast={parseMarkdown(entry.description)} plaintext={true} excerptLength={excerptLength} />
                            }
                        </p>
                    </div>
                    <div className={"btn btn-link_ghost " + styles.button}>Read More</div>
                </a>
            </Link>
        </li>
    )
}
export default CarouselCard
