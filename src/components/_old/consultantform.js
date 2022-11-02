import React, { useState } from "react"

const ConsultantForm = () => {
    const [formStatus, setFormStatus] = useState("unsent")
    const formLabels = {
        sending: "Loading...",
        unsent: "Submit",
        success: "Sent!",
        failure: "Something Went Wrong",
    }

    async function handleFormSubmit(e) {
        setFormStatus("sending")
        e.preventDefault()
        e.persist()

        const formEls = [].slice.call(e.target.elements)

        const formData = {}
        formEls.forEach((el) => {
            formData[el.name] = el.value
        })

        console.log("formData = ", formData)

        const emailRes = await sendAdminEmail(formData)

        if (emailRes.status === 200) {
            setFormStatus("success")
        } else {
            setFormStatus("failure")
            e.target.reset()
        }
    }

    return (
        <form id="consultancy-form" onSubmit={handleFormSubmit} method="POST">
            <div className="text-inputs">
                <div className="input__group name">
                    <label htmlFor="name">Name</label>
                    <input
                        id="field-name"
                        name="name"
                        type="text"
                        placeholder="Full Name"
                        required
                    />
                </div>
                <div className="input__group email">
                    <label htmlFor="email">Email</label>
                    <input
                        id="field-email"
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        required
                    />
                </div>
                <div className="input__group pronouns">
                    <label htmlFor="pronouns">Pronouns</label>
                    <input
                        id="field-pronouns"
                        name="pronouns"
                        type="text"
                        placeholder="ie: They / Them or She / Her"
                    />
                </div>
            </div>
            <div className="input__group more-info">
                <label htmlFor="more-info">
                    Tell us more about the scope of your project and the kind of
                    support you're looking for?
                </label>
                <textarea id="field-more-info" name="more-info" required />
            </div>
            <div className="input__group able-to-pay">
                <label htmlFor="able-to-pay">
                    <input
                        type="checkbox"
                        name="able-to-pay"
                        id="field-able-to-pay"
                    />
                    Are you anticipating being able to pay a Consultant for this
                    project?
                </label>
            </div>
            <div className="btn-container">
                <button type="reset" className="btn btn-link_ghost">
                    Reset Form
                </button>
                <button
                    type="submit"
                    className={`btn bg_slate ${formStatus}`}
                    disabled={
                        formStatus === "sending" || formStatus === "success"
                    }
                >
                    {formLabels[formStatus]}
                </button>
            </div>
        </form>
    )
}

export default ConsultantForm

async function sendAdminEmail(data) {
    return await fetch("/.netlify/functions/sendAdminEmail", {
        method: "POST",
        body: JSON.stringify({
            subject: `New Consultancy Submission from ${data.email}`,
            text: "A new Consultancy form submission through Ring of Keys",
            to: "info@ringofkeys.org",
            from: "website@ringofkeys.org",
            data,
        }),
    })
}
