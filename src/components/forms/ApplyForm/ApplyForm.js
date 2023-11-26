import React, { useState, useRef } from "react"
import Link from 'next/link'
import * as Sentry from '@sentry/nextjs'
import FormField, { UploadField } from "components/FormField"
import { affiliations, locations, mockData } from "./constants"
import { slugify } from 'lib/utils.js'
import styles from "./ApplyForm.module.css"
import CheckboxGrid from "components/CheckboxGrid"
import newApplicationSubmission from "components/Emails/newApplicationSubmission"
import applicationUnderReview from "components/Emails/applicationUnderReview"

export default function ApplyForm() {
    const [formStatus, setFormStatus] = useState("unsent")
    const [resumeType, setResumeType] = useState("URL")
    const [nameValue, setNameValue] = useState("")
    const formRef = useRef(null)
    const [uploads, setUploads] = useState({})

    const formLabels = {
        submitting: "Loading...",
        unsent: "Submit",
        success: "Sent!",
        failure: "Please Try Again Later",
    }

    const onUploadComplete = (fieldName, data) => {
        setUploads((previous) => ({
            ...previous,
            [fieldName]: data
        }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setFormStatus("submitting")
        const applyFormData = new FormData(e.target)

        const transformedUploads = Object.fromEntries(Object.entries(uploads)
            .map(([fieldName, fieldValue]) => ([
                fieldName,
                {
                    uploadId: fieldValue.id
                }
            ])))

        const applyFormObj = Object.assign(
            Object.fromEntries(applyFormData),
            transformedUploads,
        )

        delete applyFormObj.resumeType
        applyFormObj.slug = slugify(applyFormObj.name)

        // Gather up array fields
        const locationData = applyFormData.getAll("locations[]")
        applyFormObj.locations = locationData.join('| ')
        delete applyFormObj['locations[]']
        const unionData = applyFormData.getAll("affiliations[]")
        applyFormObj.affiliations = unionData.join('| ')
        delete applyFormObj['affiliations[]']

        // Move fields only needed for email to admin
        const emailFields = {
            whyRok: applyFormObj.whyRok,
            referral: applyFormObj.referral,
        }
        delete applyFormObj.whyRok;
        delete applyFormObj.referral;

        // Validate URL fields
        const validateUrl = (url) => (url.startsWith('http')) ? url : 'http://' + url
        if (applyFormObj.resume) {
            applyFormObj.resume = validateUrl(applyFormObj.resume)
        }
        if (applyFormObj.website) {
            applyFormObj.website = validateUrl(applyFormObj.website)
        }

        try {
            const submissionRes = await fetch('/api/submitKeyshipApplication', {
                method: 'POST',
                headers: {
                    "Content-Type": 'text/json',
                },
                body: JSON.stringify(applyFormObj)
            })

            if (submissionRes.status.toString().startsWith('5')) {
                fetch('/api/sendAdminEmail', {
                    method: 'POST',
                    headers: {
                        "Content-Type": 'text/json',
                    },
                    body: JSON.stringify({
                        subject: 'Error in Ring of Keys Application for ' + applyFormObj.name,
                        text: 'Automated admin notification from ringofkeys.org',
                        to: ['info@ringofkeys.org', 'frank.ringofkeys@gmail.com'],
                        from: 'website@ringofkeys.org',
                        html: `<p>
                            Error while submitting application for <a href="mailto:${applyFormObj.email}">${applyFormObj.name}</a>.
                            Uploads were successful, but not publication. Please check logs and reach out to them promptly.
                        </p>`,
                    })
                })
            }
            
            const submissionData = await submissionRes.json()

            setFormStatus('success')

            if (!submissionData.id) {
                Sentry.captureException('No submission ID returned from DatoCMS', {
                    applyFormObj,
                    submissionRes,
                    submissionData,
                })
            }

            // Notify admin team
            fetch('/api/sendAdminEmail', {
                method: 'POST',
                headers: {
                    "Content-Type": 'text/json',
                },
                body: JSON.stringify({
                    subject: 'New Ring of Keys Application - ' + applyFormObj.name,
                    text: 'Automated admin notification from ringofkeys.org',
                    to: ['info@ringofkeys.org', 'taylorjo@ringofkeys.org', 'frank.ringofkeys@gmail.com'],
                    from: 'website@ringofkeys.org',
                    html: newApplicationSubmission({ id: submissionData.id, ...applyFormObj, ...emailFields}),
                })
            })

            // Notify applicant
            fetch('/api/sendAdminEmail', {
                method: 'POST',
                headers: {
                    "Content-Type": 'text/json',
                },
                body: JSON.stringify({
                    subject: 'Ring of Keys - Application awaiting review',
                    text: 'Thank you for applying to join Ring of Keys!',
                    to: applyFormObj.email,
                    from: 'info@ringofkeys.org',
                    html: applicationUnderReview({ id: submissionData.id, ...applyFormObj, ...emailFields}),
                })
            })
        } catch(e) {
            setFormStatus('failure')
            Sentry.captureException(e)

            fetch('/api/sendAdminEmail', {
                method: 'POST',
                headers: {
                    "Content-Type": 'text/json',
                },
                body: JSON.stringify({
                    subject: 'Ring of Keys Application Error',
                    text: 'Automated admin error notification from ringofkeys.org',
                    to: 'frank.ringofkeys@gmail.com',
                    from: 'website@ringofkeys.org',
                    html: `
                        <p>Error: <pre>${ JSON.stringify(e, false, 2) }</pre></p>
                        <p>Form data: <pre>${ JSON.stringify(applyFormObj, false, 2) }</pre></p>
                    `,
                })
            })
        }
    }

    function fillForm() {
        Object.entries(mockData).map(([key, value]) =>
            formRef.current.elements[key].value = value
        )
    }

    return (
        <>
            {(process.env.NODE_ENV == "development") && <button className="btn" onClick={fillForm}>Auto-fill form</button>}
            <form ref={formRef} onSubmit={handleSubmit} className={styles.applyForm}>
                <h2>Tell us about yourself</h2>
                <div className="grid gap-6 lg:grid-cols-3 lg:gap-y-10">
                    <FormField
                        type="text"
                        name="name"
                        label="Full Name"
                        required={true}
                        placeholder="First Last"
                        value={nameValue}
                        onChange={(e) => setNameValue(e.target.value)}
                    />
                    <FormField
                        type="email"
                        name="email"
                        label="Email Address"
                        required={true}
                        placeholder="Email Address"
                    />
                    <FormField
                        type="text"
                        name="discipline"
                        label="Discipline"
                        required={true}
                        placeholder="ie: Actor, Stage Manager, Music Director"
                    />
                    <FormField
                        type="text"
                        name="vocalRange"
                        label="Vocal Range"
                        required={false}
                        placeholder="ie: Soprano, Tenor"
                    />
                    <FormField
                        type="text"
                        name="danceExperience"
                        label="Dance Experience"
                        required={false}
                        placeholder="ie: Ballet, Tap, Jazz"
                    />
                    <FormField
                        type="text"
                        name="mainLocation"
                        label="Where are you based?"
                        required={false}
                        placeholder="ie: New York City, Chicago"
                    />
                </div>
                <CheckboxGrid
                    className="four-cols"
                    label="Region(s)"
                    helpText="(check as many that apply)"
                    fieldData={locations}
                >
                    {locations.map((val) => (
                        <div className="checkbox" key={val}>
                            <label htmlFor={"locations-" + val}>
                                {val}
                            </label>
                            <input
                                id={"locations-" + val}
                                key={"locations-" + val}
                                name="locations[]"
                                type="checkbox"
                                value={val}
                            />
                        </div>
                    ))}
                </CheckboxGrid>
                <CheckboxGrid
                    label="Unions & Affiliations"
                    helpText="(check as many that apply)"
                    fieldData={affiliations}
                >
                    {affiliations.map((val) => (
                        <div className="checkbox" key={val}>
                            <label htmlFor={"affiliations-" + val}>
                                {val}
                            </label>
                            <input
                                id={"affiliations-" + val}
                                key={"affiliations-" + val}
                                name="affiliations[]"
                                type="checkbox"
                                value={val}
                            />
                        </div>
                    ))}
                </CheckboxGrid>
                <hr className="h-0.5 my-6 lg:my-10 bg-slate-50"/>
                <h2>How do you identify?</h2>
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-y-10">
                    <FormField
                        type="text"
                        name="pronouns"
                        label="Pronouns"
                        required={true}
                        placeholder="ie: They / Them, She / Her, etc"
                        helpText="When a person shares their pronouns, they are naming the pronouns that they want to be referred to by in the singular third person (when referring to that person while talking to someone else)."
                    />
                    <FormField
                        type="text"
                        name="genderIdentity"
                        label="Gender Identity"
                        required={true}
                        placeholder="ie: Non-Binary, Cis, Gender Fluid"
                        helpText={`One’s internal, deeply held sense of gender. Some people identify completely with the gender they were assigned at birth (usually male or female), while others may identify with only a part of that gender, or not at all. Some people identify with another gender entirely. Unlike gender expression, gender identity is not visible to others.`}
                    />
                    <FormField
                        type="text"
                        name="sexualIdentity"
                        label="Sexual Orientation"
                        required={false}
                        placeholder="ie: Bisexual, Queer, Lesbian"
                        helpText={`Sexual orientation describes a person's enduring physical, romantic, and/or emotional attraction to another person.`}
                    />
                    <FormField
                        type="text"
                        name="raceEthnicity"
                        label="Race/Ethnicity"
                        required={false}
                        placeholder="ie: Black, Indigenous, Latinx, etc."
                        helpText="Racial identity is the qualitative meaning one ascribes to one’s racial group, whereas ethnic identity is a concept that refers to one’s sense of self as a member of an ethnic group. At their core, both constructs reflect an individual’s sense of self as a member of a group; however, racial identity integrates the impact of race and related factors, while ethnic identity is focused on ethnic and cultural factors. We celebrate our Keys’ intersectionality and understand that creating one’s racial/ethnic identity is a fluid and nonlinear process that varies for every person. Many folks will identify with more than one background while others will identify with a single group more broadly."
                    />
                </div>
                <hr className="h-0.5 my-6 lg:my-10 bg-slate-50"/>
                <h2>Just a little bit more...</h2>
                <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-y-10">
                    <FormField
                        type="text"
                        name="website"
                        label="Website URL"
                        required={false}
                    />
                    <UploadField
                        name="headshot"
                        label="Upload your headshot or picture (max 4Mb)"
                        accept=".jpg, .png, .jpeg, .webp"
                        required={true}
                        onUploadComplete={onUploadComplete} 
                        author={nameValue || 'unknown author'}
                    />
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input defaultChecked={true} type="radio" name="resumeType" value="URL" onChange={() => setResumeType("URL")} />
                            Resumé by URL
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" name="resumeType" value="File" onChange={() => setResumeType("File")} />
                            Resumé by File
                        </label>
                    </div>
                    <div>
                        {(resumeType === "URL")
                        ? <FormField
                            type="text"
                            name="resume"
                            label="Resumé URL"
                        />
                        : <UploadField
                            name="resumeFile"
                            label="Resumé File"
                            onUploadComplete={onUploadComplete}
                            author={nameValue || 'unknown author'}
                        />}
                    </div>
                    <FormField
                        type="textarea"
                        name="whyRok"
                        label="Why do you want to be a Key?"
                        required={true}
                    />
                    <FormField
                        type="textarea"
                        name="referral"
                        label="How did you learn about Ring of Keys"
                        required={true}
                    />
                    <label className="flex items-center col-span-2 gap-2">
                        <input type="checkbox" required />
                        <span>
                            I agree to the&nbsp;
                            <Link href="/privacy" rel="noopener noreferrer"
                                target="_blank"
                                className="underline">
                                Privacy Policy
                            </Link>{" "}
                            and{" "}
                            <Link href="/terms" target="_blank"
                                rel="noopener noreferrer"
                                className="underline">
                                Terms of Use.
                            </Link>
                        </span>
                    </label>
                </div>
                <button
                    type="submit"
                    className={`btn bg_slate ${formStatus}`}
                    disabled={
                        formStatus === "submitting" || formStatus === "success"
                    }
                    style={{ padding: ".75em 3em", margin: "2em 0" }}
                >
                    {formLabels[formStatus]}
                </button>
            </form>
        </>
    )
}
