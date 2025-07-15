/* import DirectoryCard from "./DirectoryCard"
import styles from "styles/directory.module.css"

export default function DirectoryGrid({ artists, className = "" }) {
    return (
        <section
            id="key__grid"
            className={styles["key__grid"] + " " + className}
        >
            {artists.length ? (
                artists.map((obj, i) => (
                    <DirectoryCard
                        obj={obj}
                        index={i}
                        key={obj?.name || obj?.item?.name}
                    />
                ))
            ) : (
                <p>No results found!</p>
            )}
        </section>
    )
} 
**/
import { useState } from "react"
import DirectoryCard from "./DirectoryCard"
import styles from "styles/directory.module.css"

export default function DirectoryGrid({ artists, className = "" }) {
    const [visibleCount, setVisibleCount] = useState(20)
    const showMore = () => setVisibleCount(prev => prev + 20)
    const visibleArtists = artists.slice(0, visibleCount)

    console.log("visibleCount:", visibleCount)
    console.log("artists.length:", artists.length)
    return (
        <>
            <section
                id="key__grid"
                className={`${styles["key__grid"]} ${className}`}
            >
                {visibleArtists.length ? (
                    visibleArtists.map((obj, i) => (
                        <DirectoryCard
                            obj={obj}
                            index={i}
                            key={obj?.name || obj?.item?.name}
                        />
                    ))
                ) : (
                    <p>No results found!</p>
                )}
            </section>

            {visibleCount < artists.length && (
                <div className={styles["see-more-container"]}>
                    <button
                        onClick={showMore}
                        className={styles["see-more-button"]}
                    >
                        See More
                    </button>
                </div>
            )}
        </>
    )
}
