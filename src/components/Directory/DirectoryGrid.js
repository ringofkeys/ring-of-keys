import DirectoryCard from "./DirectoryCard"
import styles from "styles/directory.module.css"

export default function DirectoryGrid({ artists }) {
    return <section id="key__grid" className={styles["key__grid"]}>
        { artists.length ? (
            artists.map((obj, i) => <DirectoryCard obj={obj} index={i} key={obj?.name || obj?.item?.name } />)
        ) : (
            <p>No results found!</p>
        )}
    </section>
}