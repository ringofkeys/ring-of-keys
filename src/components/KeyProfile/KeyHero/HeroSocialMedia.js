import { ProfileContext } from "pages/keys/[slug]"
import { useContext } from "react"
import styles from "styles/key.module.css"
import tooltipStyles from "styles/tooltip.module.css"
import { socialIcons } from 'lib/constants'

export default function HeroSocialMedia({ setEditingSocialMedia }) {
    const {
        artist,
        isEditing
    } = useContext(ProfileContext)

    

    return (
        <div className={styles["artist_social-icons"]}>
            {!isEditing ? (
                artist?.socialMedia && (
                    <>
                        {artist.socialMedia.map(
                            (socialObj) => {
                                const mediaPlatform = Object.keys(
                                    socialIcons
                                ).filter((key) =>
                                    socialObj.socialMediaLink.includes(
                                        key
                                    )
                                )[0]
                                return (
                                    <a
                                        href={
                                            socialObj.socialMediaLink
                                        }
                                        rel="noopener noreferrer"
                                        target="_blank"
                                        className={styles["social-icon"]}
                                        key={mediaPlatform}
                                    >
                                        <img
                                            src={
                                                socialIcons[
                                                    mediaPlatform
                                                ]
                                            }
                                            alt={`${mediaPlatform}`}
                                        />
                                    </a>
                                )
                            }
                        )}
                    </>
                )
            ) : (
                <>
                    {Object.keys(socialIcons).map((key) => {
                        const hasLink =
                            socialMedia.find(
                                (socialObj) =>
                                    socialObj.socialMediaLink.includes(
                                        key
                                    )
                            )
                        return (
                            <div className={styles["social-icon"]} key={key}>
                                <img
                                    src={socialIcons[key]}
                                    alt={`${key}`}
                                    className={
                                        !hasLink ? styles["inactive"] : ""
                                    }
                                />
                            </div>
                        )
                    })}
                    <button
                        className={styles["btn_edit"] +' '+ styles["edit_social"]}
                        onClick={() => { setEditingSocialMedia(true) }}
                    >
                        <img
                            src="/img/profile-icons/icon_pencil.svg"
                            className={styles["icon_edit"]}
                            alt={`edit pencil`}
                        />
                        <span className={tooltipStyles["tooltip"] +' '+ tooltipStyles["from-above"]}>
                            Change Social Media Links
                        </span>
                    </button>
                </>
            )}
        </div>
    )
}