import CheckboxGrid from 'components/CheckboxGrid'
import FormField from 'components/FormField'
import fieldStyles from 'components/FormField/FormField.module.css'
import { affiliations, locations } from 'lib/directory'
import React, { useRef } from 'react'
import styles from 'styles/directory.module.css'

export default function DirectoryFilters({ filtersAreVisible, appliedFilters, setAppliedFilters }) {
    const filterForm = useRef(null)

    function fieldValueChange(e) {
        e.preventDefault()
        const isArrayField = e.target.name.includes('[]')

        const fieldName = (!isArrayField) ? e.target.name : e.target.name.replace('[]', '')
        const fieldValue = (!isArrayField) 
            ? e.target.value
            : [...filterForm.current.elements[e.target.name]].filter(input => input.checked)
                .map(input => input.value)

        const foundIndex = appliedFilters.findIndex(filter => filter[0] === fieldName)
        
        if (fieldValue && (!isArrayField || fieldValue.length)) {
            if (foundIndex >= 0) {
                const newFilters = [...appliedFilters]
                newFilters[foundIndex][1] = fieldValue
                setAppliedFilters(newFilters)
            } else {
                setAppliedFilters([...appliedFilters, [fieldName, fieldValue]])
            }
        } else {
            if (foundIndex >= 0) {
                setAppliedFilters([...appliedFilters.slice(0, foundIndex), ...appliedFilters.slice(foundIndex + 1)])
            }
        }
    }

    return (
        <form ref={filterForm} className={styles["section_filters"] + (filtersAreVisible ? ' ' + styles["active"] : "")}>
            <div className={styles["filters"]}>
                <button className="visually-hidden"
                    onClick={() => document.querySelector("a.key__card").focus()}>
                    click to skip past filters to Artists' Cards
                </button>
                <FormField name="firstName" label="First Name" type="text" onChange={fieldValueChange} />
                <FormField name="lastName" label="Last Name" type="text" onChange={fieldValueChange} />
                <FormField name="discipline" label="Discipline" type="text" onChange={fieldValueChange}
                    placeholder="ie: Actor, Stage Manager, Music Director"
                />
                <FormField name="vocalRange" label="Vocal Range" type="text" onChange={fieldValueChange}
                    placeholder="ie: Soprano, Tenor"
                />
                <FormField name="danceExperience" label="Dance Experience" type="text" onChange={fieldValueChange}
                    placeholder="ie: Ballet, Tap, Jazz"
                />
                <FormField name="pronouns" label="Pronouns" type="text" onChange={fieldValueChange}
                    placeholder="ie: They / Them or She / Her"
                    helpText="When a person shares their pronouns, they are naming the pronouns that they want to be referred to by in the singular third person (when referring to that person while talking to someone else)."
                />
                <FormField name="genderIdentity" label="Gender Identity" type="text" onChange={fieldValueChange}
                    placeholder="ie: Non-Binary, Cis, Gender Fluid"
                    helpText="One’s internal, deeply held sense of gender. Some people identify completely with the gender they were assigned at birth (usually male or female), while others may identify with only a part of that gender, or not at all. Some people identify with another gender entirely. Unlike gender expression, gender identity is not visible to others."
                />
                <FormField name="sexualIdentity" label="Sexual Orientation" type="text" onChange={fieldValueChange}
                    placeholder="ie: Bisexual, Queer, Lesbian"
                    helpText="Sexual orientation describes a person's enduring physical, romantic, and/or emotional attraction to another person."
                />
                <FormField name="raceEthnicity" label="Race / Ethnicity" type="text" onChange={fieldValueChange}
                    placeholder="ie: Black, Indigenous, Latinx, etc."
                    helpText="Racial identity is the qualitative meaning one ascribes to one’s racial group, whereas ethnic identity is a concept that refers to one’s sense of self as a member of an ethnic group. At their core, both constructs reflect an individual’s sense of self as a member of a group; however, racial identity integrates the impact of race and related factors, while ethnic identity is focused on ethnic and cultural factors. We celebrate our Keys’ intersectionality and understand that creating one’s racial/ethnic identity is a fluid and nonlinear process that varies for every person. Many folks will identify with more than one background while others will identify with a single group more broadly."
                />
                <CheckboxGrid
                    className={styles["locations"]}
                    label="Region"
                    helpText="(check as many that apply)"
                    fieldData={ locations }
                    >
                    {locations.map(val => (
                        <div className={styles["input__group"] +' '+ styles.checkbox +' '+ fieldStyles["input__group"] +' '+ fieldStyles.checkbox}>
                            <label htmlFor={'locations-'+val}>
                                { val }
                            </label>
                            <input
                                id={'locations-'+val}
                                key={'locations-'+val}
                                name="locations[]"
                                type="checkbox"
                                onInput={fieldValueChange}
                                value={val}
                            />
                        </div>
                    ))}
                    {/* <Field type='text' name='locationsOther' change={formik.handleChange} label='Other' value={formik.values.locationsOther} /> */}
                </CheckboxGrid>
                <CheckboxGrid
                    className={styles["affiliations"]}
                    label="Unions & Affiliations"
                    helpText="(check as many that apply)"
                    fieldData={ affiliations }
                    >
                    {affiliations.map(val => (
                        <div className={`input__group checkbox`}>
                            <label htmlFor={'affiliations-'+val}>
                                { val }
                            </label>
                            <input
                                id={'affiliations-'+val}
                                key={'affiliations-'+val}
                                name="affiliations[]"
                                type="checkbox"
                                onInput={fieldValueChange}
                                value={val}
                            />
                        </div>
                    ))}
                </CheckboxGrid>
            </div>
            <div className="btn-row">
                <button
                    type="reset"
                    className="btn btn-link_ghost btn_filters"
                    onClick={() => setAppliedFilters([])}
                >
                    Clear Advanced Search
                </button>
            </div>
        </form>
    )
}