import React, { useState } from "react"
import { Link } from "gatsby"
import { Field } from "./formfields"
import CheckboxGrid from "./checkboxgrid"
import Popup from "./popup"
import sendTxtMsg from "../utils/twilioFns"
import slugify from "../utils/slugify"
import { uploadFile } from "../utils/datoUploads"
let locations = [
  "New York City",
  "Chicago",
  "Los Angeles",
  "Philadelphia",
  "San Francisco / Oakland",
  "Minneapolis / St. Paul",
  "Denver",
  "Boulder",
  "Orlando",
  "Sarasota",
  "Louisville",
  "Baltimore",
  "Boston",
  "St. Louis",
  "Las Vegas",
  "Raleigh",
  "Cleveland",
  "Ashland",
  "Portland, OR",
  "Pittsburgh",
  "Austin",
  "Salt Lake City",
  "Washington DC",
  "Seattle",
  "Toronto",
  "Ontario",
  "London",
]
locations = locations.sort()
let affiliations = [
  "AEA",
  "AFM",
  "AGMA",
  "AGVA",
  "ASCAP",
  "BMI",
  "CSA",
  "EMC",
  "IATSE",
  "LMDA",
  "SAFD",
  "SAG/AFTRA",
  "SDC",
  "USA",
  "Non-union",
]
affiliations = affiliations.sort()

const MAX_IMAGE_FILE_SIZE_IN_BYTES = 4194304 // 4MB

const ApplyForm = () => {
  const [resumeType, setResumeType] = useState("url")
  const [formStatus, setFormStatus] = useState("unsent")
  const formLabels = {
    submitting: "Loading...",
    unsent: "Submit",
    success: "Sent!",
    failure: "Please Try Again Later",
  }

  const [isPopupOpen, setPopupOpen] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setFormStatus("submitting")

    const formEls = [].slice.call(e.target.elements)
    const formData = {}

    const arrayFields = [
      { ref: locations, name: "locations" },
      { ref: affiliations, name: "affiliations" },
    ]

    // gather up all checkbox fields into arrays
    arrayFields.forEach(field => {
      formData[field.name] = formEls
        .filter(el => el.name.includes(field.name))
        .map((el, i) => {
          if (el.checked) return field.ref[i]
          else if (el.value) return el.value
        })
        .filter(val => val)
        .join("| ")
    })

    // save the rest of the formdata
    formEls
      .filter(
        el =>
          el.name &&
          !arrayFields.some(field => el.name.includes(field.name)) &&
          (el.value || el.checked || el.files)
      )
      .forEach(el => {
        if (el.files) {
          formData[el.name] = el.files[0]
        } else {
          formData[el.name] = el.value
        }
      })

    function validateURL(url) {
      return url.startsWith("https://") ? url : "https://" + url
    }

    if (formData.website) {
      formData.website = validateURL(formData.website)
    }
    if (formData.resume) {
      formData.resume = validateURL(formData.resume)
    }

    delete formData.resumeType

    submitApplication(formData)
      .then(res => {
        console.log("createDatoUser response = ", res)

        if (res.status === 200) {
          setFormStatus("success")
          setPopupOpen(true)
          sendAdminEmail(formData)
        } else {
          setFormStatus("failure")
        }
      })
      .catch(err => {
        console.error(err)
        setFormStatus("failure")
      })
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="apply__form">
        <h2>Tell us about yourself</h2>
        <div className="basic_info">
          <Field
            type="text"
            name="name"
            label="Full Name"
            required={true}
            placeholder="First Last"
          />
          <Field
            type="email"
            name="email"
            label="Email Address"
            required={true}
            placeholder="Email Address"
          />
          <Field
            type="text"
            name="discipline"
            label="Discipline"
            required={true}
            placeholder="ie: Actor, Stage Manager, Music Director"
          />
          <Field
            type="text"
            name="vocalRange"
            label="Vocal Range [optional]"
            placeholder="ie: Soprano, Tenor"
          />
          <Field
            type="text"
            name="danceExperience"
            label="Dance Experience [optional]"
            placeholder="ie: Ballet, Tap, Jazz"
          />
          <Field
            type="text"
            name="mainLocation"
            label="Where are you based?"
            placeholder="ie: New York City, Chicago"
          />
        </div>
        <CheckboxGrid
          className="locations"
          label="Region(s)"
          helpText="(check as many as apply)"
          fieldData={locations}
          fieldName="locations"
        >
          {locations.map((field, i) => (
            <Field
              type="checkbox"
              name={`locations[${i}]`}
              label={locations[i]}
              key={locations[i]}
            />
          ))}
          <Field type="text" name={`locationsOther`} label="Other" />
        </CheckboxGrid>
        <CheckboxGrid
          className="affiliations"
          label="Unions & Affiliations [optional]"
          helpText="(check as many as apply)"
          fieldData={affiliations}
          fieldName="affiliations"
        >
          {affiliations.map((field, i) => (
            <Field
              type="checkbox"
              name={`affiliations[${i}]`}
              label={affiliations[i]}
              key={affiliations[i]}
            />
          ))}
          <Field type="text" name={`affiliationsOther`} label="Other" />
        </CheckboxGrid>
        <div className="divider"></div>
        <h2>How do you identify?</h2>
        <div
          className="grid_2c-2r"
          style={{ alignItems: "flex-start", gap: "2em 1em" }}
        >
          <Field
            type="text"
            name="pronouns"
            label="Pronouns"
            required={true}
            placeholder="ie: They / Them or She / Her"
            helpText={`When a person shares their pronouns, they are naming the pronouns that they want to be referred to by in the singular third person (when referring to that person while talking to someone else).`}
          />
          <Field
            type="text"
            name="genderIdentity"
            label="Gender Identity"
            required={true}
            placeholder="ie: Non-Binary, Cis, Gender Fluid"
            helpText={`One’s internal, deeply held sense of gender. Some people identify completely with the gender they were assigned at birth (usually male or female), while others may identify with only a part of that gender, or not at all. Some people identify with another gender entirely. Unlike gender expression, gender identity is not visible to others.`}
          />
          <Field
            type="text"
            name="sexualIdentity"
            label="Sexual Orientation"
            required={true}
            placeholder="ie: Bisexual, Queer, Lesbian"
            helpText={`Sexual orientation describes a person's enduring physical, romantic, and/or emotional attraction to another person.`}
          />
          <Field
            type="text"
            name="raceEthnicity"
            label="Race/Ethnicity [optional]"
            placeholder="ie: Black, Indigenous, Latinx, etc."
            helpText={`Racial identity is the qualitative meaning one ascribes to one’s racial group, whereas ethnic identity is a concept that refers to one’s sense of self as a member of an ethnic group. At their core, both constructs reflect an individual’s sense of self as a member of a group; however, racial identity integrates the impact of race and related factors, while ethnic identity is focused on ethnic and cultural factors. We celebrate our Keys’ intersectionality and understand that creating one’s racial/ethnic identity is a fluid and nonlinear process that varies for every person. Many folks will identify with more than one background while others will identify with a single group more broadly.`}
          />
        </div>
        <div className="divider"></div>
        <h2>Just a little bit more...</h2>
        <Field type="text" name="website" label="Website URL [optional]" />
        <div className="grid_2c-1r">
          <Field
            type="file"
            name="headshot"
            required={true}
            label="Upload your headshot or picture (max 4Mb)"
            accept="image/*"
          />
          <div>
            <div class="grid_2c-1r" style={{ marginBottom: ".5rem" }}>
              <label>
                <input
                  name="resumeType"
                  type="radio"
                  checked={resumeType === "url"}
                  onChange={() => setResumeType("url")}
                />
                URL
              </label>
              <label>
                <input
                  name="resumeType"
                  type="radio"
                  checked={resumeType === "file"}
                  onChange={() => setResumeType("file")}
                />
                File
              </label>
            </div>
            {resumeType === "url" ? (
              <Field
                type="text"
                name="resume"
                label="Resumé URL"
                required={true}
              />
            ) : (
              <Field
                type="file"
                name="resumeFile"
                required={true}
                label="Resumé File"
              />
            )}
          </div>
        </div>
        <div className="grid_2c-1r">
          <Field
            type="textarea"
            name="whyRok"
            label="Why do you want to be a Key?"
            required={true}
          />
          <Field
            type="textarea"
            name="referral"
            label="How did you learn about Ring of Keys?"
            required={true}
          />
        </div>
        <label className="privacy-consent input__group checkbox">
          <input type="checkbox" required />
          <span>
            I agree to the&nbsp;
            <Link to="/privacy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link to="/terms" target="_blank" rel="noopener noreferrer">
              Terms of Use.
            </Link>
          </span>
        </label>
        <button
          type="submit"
          className={`btn bg_slate ${formStatus}`}
          disabled={formStatus === "submitting" || formStatus === "success"}
          style={{ padding: ".75em 3em", margin: "2em 0" }}
        >
          {formLabels[formStatus]}
        </button>
      </form>
      <Popup isOpen={isPopupOpen} onClose={() => setPopupOpen(false)}>
        <h2>Thank You</h2>
        <p>for your submission</p>
        <div className="divider"></div>
        <p>
          You will receive an email soon alerting you of your acceptance to be a
          Key! Please add info@ringofkeys.org to your contacts. Once accepted,
          you will be able to customize your Key profile. <br />
          We look forward to queering the stage with you.
        </p>
      </Popup>
    </>
  )
}
export default ApplyForm

async function submitApplication(data) {
  const newUser = {
    slug: slugify(data.name),
  }
  Object.keys(data).forEach(key => {
    //Removing these fields from the obj to be uploaded as the new user
    if (key !== "whyRok" && key !== "referral") {
      newUser[key] = data[key]
    }
  })

  console.log("newUser Object = ", newUser)

  // TODO: fail form just like required=true behavior, possibly overriding formfields
  console.log(
    "Headshot filesize is ",
    newUser.headshot.size > MAX_IMAGE_FILE_SIZE_IN_BYTES ? "above" : "within",
    " the limit of 4MB."
  )

  const uploadPromises = []

  uploadPromises.push(uploadFile(newUser.headshot))

  if (newUser.resumeFile) {
    uploadPromises.push(uploadFile(newUser.resumeFile))
  }

  const uploadResponses = await Promise.all(uploadPromises)
  newUser.headshot = uploadResponses[0][0].id

  if (newUser.resumeFile) {
    newUser.resumeFile = uploadResponses[1][0].id
  }

  console.log("newUser = ", JSON.stringify(newUser))

  return await fetch("/.netlify/functions/createDatoUser", {
    method: "POST",
    body: JSON.stringify(newUser),
  }).catch(err => console.error(err))
}

async function sendAdminEmail(userData) {
  const emailRes = await fetch("/.netlify/functions/newUserEmail", {
    method: "POST",
    body: JSON.stringify(userData),
  }).catch(err => console.error(err))

  console.log("SendGrid response: ", emailRes)
}
