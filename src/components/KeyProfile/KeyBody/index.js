import InfoIcon from "components/FormField/InfoIcon"
import { PROFILE_INFO_COPY } from "lib/constants"
import { ProfileContext } from "pages/keys/[slug]"
import { useContext } from "react"
import styles from "styles/key.module.css"

export function KeyBody() {
    const {
        artist: {
            bio,
            sexualIdentity,
            genderIdentity,
            raceEthnicity,
            discipline,
            vocalRange,
            danceExperience,
            affiliations,
            website,
        },
        isEditable,
        isEditing,
        setEditing,
    } = useContext(ProfileContext)

    function handleProfileSave() {
        console.log('TODO: save profile and reload')
    }

    return (
        <section className={styles["artist_body"]}>
            {isEditable &&
            <div className={styles.toggleRow}>
                <label
                    className={styles["toggle_group"]}
                    htmlFor="profile-edit-toggle"
                >
                    <input
                        id="profile-edit-toggle"
                        type="checkbox"
                        className="visually-hidden"
                        checked={isEditing}
                        onChange={() => setEditing(!isEditing)}
                    />
                    <span className={styles.toggle}></span>
                    <span className={styles["toggle_label"]}>
                        Toggle Editing View
                    </span>
                </label>
                {isEditing && (
                        <button onClick={handleProfileSave} className={`btn`}>
                            Save Profile Edits
                        </button>
                )}
            </div>}
            {bio && (
                <div className={styles["my_story"]}>
                    <h2>My Story</h2>
                    <div>
                        <p>{ bio }</p>
                    </div>
                </div>
            )}
            {sexualIdentity && (<>
                <h3>
                    Sexual Orientation
                    <InfoIcon infoText={ PROFILE_INFO_COPY.sexualOrientation } />
                </h3>
                <p>{ sexualIdentity }</p>
            </>)}
            {genderIdentity && (<>
                <h3>
                    Gender Identity
                    <InfoIcon infoText={ PROFILE_INFO_COPY.genderIdentity } />
                </h3>
                <p>{ genderIdentity }</p>
            </>)}
            {raceEthnicity && (<>
                <h3>
                    Race/Ethnicity
                    <InfoIcon infoText={ PROFILE_INFO_COPY.raceEthnicity } />
                </h3>
                <p>{ raceEthnicity }</p>
            </>)}
            {discipline && (<>
                <h3>Discipline</h3>
                <p>{ discipline }</p>
            </>)}
            {vocalRange && (<>
                <h3>Vocal Range</h3>
                <p>{ vocalRange }</p>
            </>)}
            {danceExperience && (<>
                <h3>Dance Experience</h3>
                <p>{ danceExperience }</p>
            </>)}
            {affiliations && (<>
                <h3>Unions & Affiliations</h3>
                <p>{ affiliations }</p>
            </>)}
            {website && (<>
                <h3>Website</h3>
                <a href={website} target="_blank" rel="noopener noreferrer">{ website }</a>
            </>)}
        </section>
    )
}