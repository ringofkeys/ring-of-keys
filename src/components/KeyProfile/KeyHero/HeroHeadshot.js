import { useContext } from "react"
import { ProfileContext } from "pages/keys/[slug]"
import styles from "styles/key.module.css"

export default function HeroHeadShot({ setHeadshotFullOpen }) {
    const {
        artist: {
            headshot
        },
        isEditable
    } = useContext(ProfileContext)

    const HeadShot = () => (
        <img
            src={headshot.responsiveImage.src}
            alt={headshot.responsiveImage.title}
            className={styles["headshot"]}
            onClick={() => setHeadshotFullOpen(true)}
        />
    )

    return (
        <div className={styles["avatar"]}>
            {!isEditable ? (
                <HeadShot />
            ) : (
                <div className={styles["headshot_group"]}>
                    <HeadShot />
                    <button
                        className={styles["btn_edit edit_headshot"]}
                        onClick={() =>
                            console.log('editing!')
                            // headshot.setEditing(true)
                        }
                    >
                        {/* <img
                            src={profileIcons.camera}
                            className="icon_edit"
                            alt={`edit headshot`}
                        /> */}
                        <span className="tooltip">
                            Change Profile Photo
                        </span>
                    </button>
                </div>
            )}
        </div>
    )
}