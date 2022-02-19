import React, { useState } from "react"
import withLocation from "./withLocation"
import PropTypes from "prop-types"

const ContactForm = ({ search }) => {
  const { subject } = search

  const [formStatus, setFormStatus] = useState("unsent")
  const formLabels = {
    sending: "Loading...",
    unsent: "Submit",
    success: "Sent!",
    failure: "Please Try Again Later",
  }

  async function handleFormSubmit(e) {
    setFormStatus("sending")
    e.preventDefault()
    e.persist()

    const formEls = [].slice.call(e.target.elements)

    const formData = {
      email: formEls.find(el => el.name === "email").value,
      subject: formEls.find(el => el.name === "subject").value,
      message: formEls.find(el => el.name === "message").value,
    }

    const emailRes = await sendAdminEmail(formData)

    if (emailRes.status === 200) {
      setFormStatus("success")
    } else {
      setFormStatus("failure")
      e.target.reset()
    }
  }

  return (
    <form className="contact_form" onSubmit={handleFormSubmit} method="POST">
      <div className="input__group email">
        <label htmlFor="email">Email</label>
        <input id="field-email" name="email" type="email" required />
      </div>
      <div className="input__group select"></div>
      <label htmlFor="subject">Subject</label>
      <select id="field-subject" name="subject" required defaultValue={subject}>
        <option value="general">General inquiries</option>
        <option value="hiring">Hire Ring of Keys</option>
        <option value="job-submission">Submit a casting notice for Keys</option>
        <option value="volunteer">
          Request to volunteer with Ring of Keys
        </option>
        <option value="technical">Technical issues</option>
      </select>
      <div className="input__group email">
        <label htmlFor="message">Message</label>
        <textarea id="field-message" name="message" required />
      </div>
      <button
        type="submit"
        className={`btn bg_slate ${formStatus}`}
        disabled={formStatus === "sending" || formStatus === "success"}
      >
        {formLabels[formStatus]}
      </button>
    </form>
  )
}

export default withLocation(ContactForm)

ContactForm.propTypes = {
  search: PropTypes.object,
}

async function sendAdminEmail(data) {
  const config =
    data.subject !== "technical"
      ? {
          subject: `New Contact Submission from ${data.email}`,
          text: "A new Contact form submission through Ring of Keys",
          to: "info@ringofkeys.org",
          from: data.email,
          data,
        }
      : {
          subject: `New Technical Issue submission from ${data.email}`,
          text: `A new technical issue submission through Ring of Keys`,
          to: `taylorpoer@gmail.com`,
          from: data.email,
          data,
        }

  return await fetch("/.netlify/functions/sendAdminEmail", {
    method: "POST",
    body: JSON.stringify(config),
  })
}
