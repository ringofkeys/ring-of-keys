import { ProfileContext } from "pages/keys/[slug]"
import { useContext } from "react"
import styles from "styles/key.module.css"

export default function HeroBio({ setMessageOpen }) {
    const {
        artist: {
            name,
            location,
            pronouns,
            memberSince,
            id,
        },
        isEditable
    } = useContext(ProfileContext)
    
    return (
        <div className={styles["artist_bio"]}>
            <h1>{ name }</h1>
            {location && (
                <p>
                    Based in{" "}
                    {location.replace(", ", " • ")}
                </p>
            )}
            <p>
                {pronouns}
                {memberSince
                    ? ` • Member Since ${memberSince}`
                    : ""}
            </p>
            {isEditable && (
                <p>
                    RoK ID:{" "}
                    {id.match(/.*-(\d+)-.*/)[1]}
                </p>
            )}
            <button
                className={"btn " + styles["btn_message"]}
                onClick={() => setMessageOpen(true)}
            >
                Message
            </button>
        </div>
    )
}