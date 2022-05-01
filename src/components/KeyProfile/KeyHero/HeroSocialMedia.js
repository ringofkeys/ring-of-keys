export default function HeroSocialMedia() {
    const {
        artist: {
            socialMedia,
        },
        isEditable
    } = useContext(ProfileContext)

    return (
        <div className="artist_social-icons">
            {/* {!isEditable ? (
                heroFields.socialMedia.data && (
                    <>
                        {heroFields.socialMedia.data.map(
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
                                        className="social-icon"
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
                            heroFields.socialMedia.data.find(
                                (socialObj) =>
                                    socialObj.socialMediaLink.includes(
                                        key
                                    )
                            )
                        return (
                            <div className="social-icon">
                                <img
                                    src={socialIcons[key]}
                                    alt={`${key}`}
                                    className={
                                        !hasLink ? "inactive" : ""
                                    }
                                />
                            </div>
                        )
                    })}
                    <button
                        className="btn_edit edit_social"
                        onClick={() =>
                            heroFields.socialMedia.setEditing(true)
                        }
                    >
                        <img
                            src={profileIcons.pencil}
                            className="icon_edit"
                            alt={`edit pencil`}
                        />
                        <span className="tooltip from-above">
                            Change Social Media Links
                        </span>
                    </button>
                </>
            )} */}
        </div>
    )
}