import { ProfileContext } from "pages/keys/[slug]"
import { useContext } from "react"
import styles from "styles/key.module.css"

const socialIcons = {
    instagram: '/img/social-icons/icon_instagram.svg',
    facebook: '/img/social-icons/icon_facebook.svg',
    twitter: '/img/social-icons/icon_twitter.svg',
    youtube: '/img/social-icons/icon_youtube.svg',
    linkedin: '/img/social-icons/icon_linkedin.svg',
}

export default function HeroSocialMedia() {
    const {
        artist: {
            socialMedia,
        },
        isEditable
    } = useContext(ProfileContext)

    

    return (
        <div className={styles["artist_social-icons"]}>
            {!isEditable ? (
                socialMedia && (
                    <>
                        {socialMedia.map(
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
                            <div className={styles["social-icon"]}>
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
                        className={styles["btn_edit edit_social"]}
                        onClick={() => {
                            // TODO! acknowledge editing
                            // socialMedia.setEditing(true)
                        }
                        }
                    >
                        <img
                            src="/img/profile-icons/icon_pencil.svg"
                            className="icon_edit"
                            alt={`edit pencil`}
                        />
                        <span className="tooltip from-above">
                            Change Social Media Links
                        </span>
                    </button>
                </>
            )}
        </div>
    )
}