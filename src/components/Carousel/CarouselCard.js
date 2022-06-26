import React, { useRef } from "react"
import Link from "next/link"
// import { useIntersect } from "hooks/useIntersect"
import render from "html-react-parser"
import styles from "./Carousel.module.css"

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

const CarouselCardInner = ({ node, recordType, ratio, className }) => {
    function DynamicLink({ className, children }) {
        return node.externalUrl ? (
            <a
                href={node.externalUrl}
                rel="noopener noreferrer"
                target="_blank"
                className={cssModularize(className)}
                tabIndex="-1"
            >
                {children}
            </a>
        ) : (
            <Link
                href={
                    (recordType ? "/" + recordType : "") +
                    "/" +
                    (node.slug ? node.slug : "#")
                }
                tabIndex="-1"
            >
                <a className={cssModularize(className)}>{children}</a>
            </Link>
        )
    }

    function truncatedDescription(descriptionHTML) {
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

    return (
        <li
            className={`${styles["carousel_card"]} ${styles["hover_scale"]} ${className}`}
            style={{ opacity: ratio ? ratio : 1 }}
        >
            {wrapLink(
                node,
                "img_wrapper fullwidth",
                node.featuredImage ? (
                    <img
                        src={node.featuredImage.url}
                        alt={node.featuredImage.alt}
                    />
                ) : (
                    <div
                        className="img_replacement fullwidth"
                        style={{ "--grad-rotate": Math.random() * 360 + "deg" }}
                    ></div>
                )
            )}
            {wrapLink(
                node,
                "header_link",
                node.title && (
                    <h3>
                        {node.title.length > 70
                            ? node.title.substr(0, 70) + "..."
                            : node.title}
                    </h3>
                )
            )}
            <div>
                {(node.startTime || node.publishDate) && (
                    <>
                        <p>
                            <em>
                                {node.startTime
                                    ? node.startTime
                                    : node.publishDate}
                            </em>
                        </p>
                    </>
                )}
                {(node.body || node.description) &&
                    truncatedDescription(
                        node.body ? node.body : node.description
                    )}
            </div>
            {node.externalUrl ? (
                <a
                    href={node.externalUrl}
                    className="btn btn-link_ghost"
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    Read More
                </a>
            ) : (
                <Link
                    href={
                        (recordType ? "/" + recordType : "") +
                        "/" +
                        (node.slug ? node.slug : "#")
                    }
                    className="btn btn-link_ghost"
                >
                    <a>Read More</a>
                </Link>
            )}
        </li>
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
                        <p><em>{entry.startTime ? entry.startTime : entry.publishDate}</em></p>
                        )}
                        <p>
                            {(entry.description || entry.body).substr(0, excerptLength) + (((entry.description || entry.body)).length > excerptLength ? "..." : '')}
                        </p>
                    </div>
                    <div className={"btn btn-link_ghost " + styles.button}>Read More</div>
                </a>
            </Link>
        </li>
    )
}
export default CarouselCard
