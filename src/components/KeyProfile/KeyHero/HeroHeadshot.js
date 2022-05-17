import { useContext } from "react"
import { ProfileContext } from "pages/keys/[slug]"
import styles from "styles/key.module.css"
import Icon from "components/Icon"
import tooltipStyles from "styles/tooltip.module.css"

export default function HeroHeadShot({ setHeadshotFullOpen, setEditingHeadshot }) {
    const {
        artist: {
            headshot
        },
        isEditing
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
            {!isEditing ? (
                <HeadShot />
            ) : (
                <div className={styles["headshot_group"]}>
                    <HeadShot />
                    <button
                        className={styles["btn_edit"] +' '+ styles["edit_headshot"]}
                        onClick={() => {
                            console.log('editing!')
                            setEditingHeadshot(true)
                        }}
                    >
                        <Icon type="camera" className={styles["icon_edit"]} />
                        <span className={tooltipStyles["tooltip"]}>
                            Change Profile Photo
                        </span>
                    </button>
                </div>
            )}
        </div>
    )
}