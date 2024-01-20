import Link from "next/link"
import styles from "./Hero.module.css"

export default function Hero({ type, ...otherProps }) {
    switch (type) {
        // Other hero types can be defined in DatoCMS and added as cases here in future.
        default:
            return <HomeHero {...otherProps} />
    }
}

function HomeHero({ description, linkText, linkUrl }) {
    return (
        <div className={styles.index_hero}>
            <h1>
                <span>
                    <span>Q</span>
                    <span>u</span>
                    <span>e</span>
                    <span>e</span>
                    <span>r</span>
                </span>
                &nbsp; The Stage
            </h1>
            <div className={styles["index_hero__right-col"]}>
                {description}
                <Link href={linkUrl} className={"btn " + styles.btn}>
                    {linkText}
                </Link>
            </div>
        </div>
    )
}
