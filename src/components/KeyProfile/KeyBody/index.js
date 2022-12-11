import CheckboxGrid from "components/CheckboxGrid"
import InfoIcon from "components/FormField/InfoIcon"
import { affiliations, locations } from "components/forms/ApplyForm/constants"
import { PROFILE_INFO_COPY } from "lib/constants"
import { ProfileContext } from "pages/keys/[slug]"
import { useContext } from "react"
import styles from "styles/key.module.css"
import KeyField from "../KeyField"
import fieldStyles from "components/FormField/FormField.module.css"
import Link from "next/link"

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

    const finalLocationVal = artist?.locations?.slice(artist?.locations?.lastIndexOf('| ') + 2) || ''
    const locationsOther = (locations.findIndex(l => l === finalLocationVal) < 0) ? finalLocationVal : ''

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
            <KeyField fieldName="bio"
                heading={<h2>My Story</h2>}
                editFormFields={<textarea name="bio" defaultValue={artist?.bio} placeholder="Tell us about yourself!" />}
            >
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
                <KeyField fieldName="locations"
                    heading={<h3>Your Regions</h3>}
                    editFormFields={<CheckboxGrid
                        className={styles["locations"]}
                        label="Region"
                        helpText="(check as many that apply)"
                    >
                        {locations.map((val) => (
                            <div
                                className={
                                    " " +
                                    styles.checkbox +
                                    " " +
                                    fieldStyles.checkbox
                                }
                                key={val}
                            >
                                <label htmlFor={"locations-" + val}>
                                    {val}
                                </label>
                                <input
                                    id={"locations-" + val}
                                    key={"locations-" + val}
                                    name="locations[]"
                                    type="checkbox"
                                    value={val}
                                    defaultChecked={artist?.locations.includes(val)}
                                />
                            </div>
                        ))}
                        <div className={fieldStyles["input__group"]}>
                            <label htmlFor="locationsOther">Other</label>
                            <input type='text' name='locationsOther' defaultValue={locationsOther} />
                        </div>

                    </CheckboxGrid>}
                    processDataCallback={(_, formSubmitEvent) => {
                        const locationArray = Array.from(formSubmitEvent.currentTarget.elements["locations[]"])
                            .filter(field => field.checked)
                            .map(field => field.value)
                        const locationOther = formSubmitEvent.currentTarget.elements.locationsOther.value

                        return {
                            locations: locationArray.join('| ') + (locationOther ? '| ' : '') + locationOther
                        }
                    }}
                >
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
            <KeyField fieldName="isGenderConsultant"
                heading={<h3>Available for Gender Consulting</h3>}
                    editFormFields={<div className={styles.toggleRow}>
                    <label
                        className={styles["toggle_group"]}
                        htmlFor="isGenderConsultant"
                    >
                        <input
                            id="isGenderConsultant"
                            type="checkbox"
                            className="visually-hidden"
                            defaultChecked={artist?.isGenderConsultant}
                        />
                        <span className={styles.toggle}></span>
                        <span className={styles["toggle_label"]}>
                            Show me as available for Gender Consulting
                        </span>
                        <p>Checking this box will display you on <Link href="/consultancy">the Gender Consultancy page</Link> and may result in you receiving solicitation for consulting work. Please only opt in if you are comfortable with Ring of Keys sharing these solicitations with you.</p>
                    </label>
                </div>}
                processDataCallback={(_, formSubmitEvent) => {
                    const isGenderConsultant = formSubmitEvent.currentTarget.elements["isGenderConsultant"].checked
                    console.log({isGenderConsultant, formElements: formSubmitEvent.currentTarget.elements   })
                    return {
                        isGenderConsultant
                    }
                }}
            >
                <p>{ artist?.isGenderConsultant 
                    && (<span>Yes, I'm available to provide paid gender consulting services for productions. Learn more about <Link href="/consultancy">Ring of Keys gender consultants here.</Link></span>)
                }</p>
            </KeyField>
            <KeyField fieldName="vocalRange" heading={<h3>Vocal Range</h3>}>
                <p>{ artist?.vocalRange }</p>
            </KeyField>
            <KeyField fieldName="danceExperience" heading={<h3>Dance Experience</h3>}>
                <p>{ artist?.danceExperience }</p>
            </KeyField>
            <KeyField fieldName="affiliations"
                heading={<h3>Unions & Affiliations</h3>}
                editFormFields={<CheckboxGrid
                    className={'w-full ' + styles["affiliations"]}
                    label="Unions & Affiliations"
                    helpText="(check as many that apply)"
                >
                    {affiliations.map((val) => (
                        <div
                            className={'py-2 px-4 ' + fieldStyles.checkbox}
                            key={val}
                        >
                            <label htmlFor={"affiliations-" + val}>
                                {val}
                            </label>
                            <input
                                id={"affiliations-" + val}
                                key={"affiliations-" + val}
                                name="affiliations[]"
                                type="checkbox"
                                value={val}
                                defaultChecked={artist?.affiliations?.includes(val)}
                            />
                        </div>
                    ))}
                </CheckboxGrid>}
                processDataCallback={(_, formSubmitEvent) => {
                    const affiliationArray = Array.from(formSubmitEvent.currentTarget.elements["affiliations[]"])
                        .filter(field => field.checked)
                        .map(field => field.value)

                    return {
                        affiliations: affiliationArray.join(', ')
                    }
                }}
            >
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