import { ProfileContext } from "pages/keys/[slug]"
import { useContext } from "react"
import styles from "styles/key.module.css"

export default function HeroBio({ setMessageOpen }) {
    const {
        artist,
        isEditable
    } = useContext(ProfileContext)
    
    return (
        <div className={styles["artist_bio"]}>
            <h1>{ artist?.name }</h1>
            {artist?.mainLocation && (
                <p>
                    Based in{" "}
                    {artist.mainLocation.replace(", ", " • ")}
                </p>
            )}
            <p>
                {artist?.pronouns}
                {artist?.memberSince
                    ? ` • Member Since ${artist?.memberSince}`
                    : ""}
            </p>
            {isEditable && (
                <p>
                    RoK ID:{" "}
                    {(!artist?.id || !artist.id.includes('-')) ? artist.id : artist.id?.match(/.*-(\d+)-.*/)[1]}
                </p>
            )}
            {!artist?.hideMessageButton && <button
                className={"btn " + styles["btn_message"]}
                onClick={() => {
                    setMessageOpen(true)
                }}
            >
                Message
            </button>}
        </div>
    )
}