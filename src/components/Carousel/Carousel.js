import React, { useRef } from "react"
import CarouselCard from "./CarouselCard.js"
import styles from "./Carousel.module.css"

const Carousel = ({
    heading,
    recordType,
    entryList,
    classNames = [],
    style,
    children,
}) => {
    const carousel = useRef(null)

    function advanceCarousel(amount) {
        if (!carousel || !carousel.current) return
        carousel.current.scrollLeft +=
            (carousel.current.getBoundingClientRect().width / 100) * amount
    }

    return (
        <section
            className={styles["carousel-section"]}
            style={Object.assign(
                { position: "relative", paddingBlockStart: "1.5rem" },
                style ? style : {}
            )}
        >
            <div className={styles["carousel-title"]}>
                {heading && <h2>{heading}</h2>}
                <ul
                    className={styles["carousel_advance_btns"]}
                    style={{ top: !heading ? "0" : "2.4rem" }}
                >
                    <li>
                        <button onClick={() => advanceCarousel(-100)}>
                            <span className="visually-hidden">Back</span>
                            <svg viewBox="0 0 10 10">
                                <path d="M 8 1 L 2 5 L 8 9" />
                            </svg>
                        </button>
                    </li>
                    <li>
                        <button onClick={() => advanceCarousel(100)}>
                            <span className="visually-hidden"></span>
                            <svg viewBox="0 0 10 10">
                                <path d="M 2 1 L 8 5 L 2 9" />
                            </svg>
                        </button>
                    </li>
                </ul>
            </div>
            <div
                ref={carousel}
                tabIndex="0"
                className={`${styles["carousel"]} ${
                    classNames.length > 0 ? classNames.join(" ") : ""
                }`}
            >
                <ul className={styles["carousel_inner"]}>
                    {entryList &&
                        entryList.map((entry, i) => (
                            <CarouselCard
                                entry={entry}
                                entryType={recordType}
                                key={`carousel-${classNames[0]}-${i}`}
                            />
                        ))
                    }
                    {children && children}
                </ul>
            </div>
        </section>
    )
}

export default Carousel
