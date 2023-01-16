import { useState } from "react"
import styles from "styles/contact.module.css"


const ContactForm = ({ subject }) => {
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
            email: formEls.find((el) => el.name === "email").value,
            subject: formEls.find((el) => el.name === "subject").value,
            message: formEls.find((el) => el.name === "message").value,
        }

        const emailRes = await sendAdminEmail(formData)

        if (emailRes.status === 200) {
            setFormStatus("success")
            e.target.reset()
            e.target.disabled = true
        } else {
            setFormStatus("failure")
        }
    }

    return (
        <form
            className={styles.contactForm}
            onSubmit={handleFormSubmit}
            method="POST"
        >
            <div className={"input__group email " + styles['input__group'] }>
                <label htmlFor="email">Email</label>
                <input id="field-email" name="email" type="email" required className={styles.field}/>
            </div>
            <div className={"input__group select " + styles['input__group'] }>
                <label htmlFor="subject">Subject</label>
                <select
                    id="field-subject"
                    name="subject"
                    required
                    defaultValue={subject}
                    className={styles.field}
                >
                    <option value="general">General inquiries</option>
                    <option value="hiring">Hire Ring of Keys</option>
                    <option value="job-submission">
                        Submit a casting notice for Keys
                    </option>
                    <option value="volunteer">
                        Request to volunteer with Ring of Keys
                    </option>
                    <option value="technical">Technical issues</option>
                </select>
            </div>
            <div className={"input__group email " + styles['input__group'] }>
                <label htmlFor="message">Message</label>
                <textarea className={styles.field} id="field-message" name="message" required />
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

export default ContactForm


async function sendAdminEmail(data) {
    const config =
        data.subject !== "technical"
            ? {
                  subject: `New Contact Submission from ${data.email}`,
                  text: "A new Contact form submission through Ring of Keys",
                  to: "taylorpoer@gmail.com",
                  from: data.email,
                  data,
              }
            : {
                  subject: `New Technical Issue submission from ${data.email}`,
                  text: `A new technical issue submission through Ring of Keys`,
                  to: `frank.ringofkeys@gmail.com`,
                  from: data.email,
                  data,
              }

    return await fetch("/api/sendAdminEmail", {
        method: "POST",
        body: JSON.stringify(config),
    })
}
