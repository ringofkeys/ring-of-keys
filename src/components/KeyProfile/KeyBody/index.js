import InfoIcon from "components/FormField/InfoIcon"
import { PROFILE_INFO_COPY } from "lib/constants"
import { ProfileContext } from "pages/keys/[slug]"
import { useContext } from "react"
import styles from "styles/key.module.css"
import KeyField from "../KeyField"

/**
 * React component of all Key profile fields below the Hero
 * @returns {React.FC}
 */
export function KeyBody() {
    const {
        artist,
        isEditable,
        isEditing,
        setEditing,
    } = useContext(ProfileContext)

    function handleProfileSave() {
        console.log('TODO: save profile and reload')
    }

    return (
        <section className={styles["artist_body"]}>
            {/* This toggle lets the profile owner enter/exit Edit Mode */}
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
            </div>}
            <KeyField fieldName="bio" heading={<h2>My Story</h2>}>
                <div>
                    <p>{ artist?.bio }</p>
                </div>
            </KeyField>
            {/* These fields don't appear unless the profile owner enters Edit Mode */}
            {isEditing && (<>
                <KeyField fieldName="name" heading={<h3>Name</h3>}>
                    <p>{ artist?.name }</p>
                </KeyField>
                <KeyField fieldName="pronouns"
                    heading={<h3>
                        Pronouns
                        <InfoIcon infoText={ PROFILE_INFO_COPY.pronouns } />
                    </h3>}
                >
                    <p>{ artist?.pronouns }</p>
                </KeyField>
                <KeyField fieldName="mainLocation" heading={<h3>Your Main Location</h3>}>
                    <p>{ artist?.mainLocation }</p>
                </KeyField>
                <KeyField fieldName="locations" heading={<h3>Your Regions</h3>}>
                    <p>{ artist?.locations.replaceAll('| ', ', ') }</p>
                </KeyField>
            </>)}
            {/* These fields are always visible if they have data */}
            <KeyField fieldName="sexualIdentity"
                    heading={<h3>
                        Sexual Orientation
                        <InfoIcon infoText={ PROFILE_INFO_COPY.sexualOrientation } />
                    </h3>}
                >
                <p>{ artist?.sexualIdentity }</p>
            </KeyField>
            <KeyField fieldName="genderIdentity"
                    heading={<h3>
                        Gender Identity
                        <InfoIcon infoText={ PROFILE_INFO_COPY.genderIdentity } />
                    </h3>}
                >
                <p>{ artist?.genderIdentity }</p>
            </KeyField>
            <KeyField fieldName="raceEthnicity"
                    heading={<h3>
                        Race/Ethnicity
                        <InfoIcon infoText={ PROFILE_INFO_COPY.raceEthnicity } />
                    </h3>}
                >
                <p>{ artist?.raceEthnicity }</p>
            </KeyField>
            <KeyField fieldName="discipline" heading={<h3>Discipline</h3>}>
                <p>{ artist?.discipline }</p>
            </KeyField>
            <KeyField fieldName="vocalRange" heading={<h3>Vocal Range</h3>}>
                <p>{ artist?.vocalRange }</p>
            </KeyField>
            <KeyField fieldName="danceExperience" heading={<h3>Dance Experience</h3>}>
                <p>{ artist?.danceExperience }</p>
            </KeyField>
            <KeyField fieldName="affiliations" heading={<h3>Unions & Affiliations</h3>}>
                <p>{ artist?.affiliations }</p>
            </KeyField>
            <KeyField fieldName="website" heading={<h3>Website</h3>}>
                <a href={artist?.website} target="_blank" rel="noopener noreferrer">{ artist?.website }</a>
            </KeyField>
            <KeyField fieldName="resume" heading={<h3>Resume</h3>}>
                <a className={"btn " + styles["btn_resume"]}
                    href={artist?.resume}
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    View Resume
                </a>
            </KeyField>
        </section>
    )
}