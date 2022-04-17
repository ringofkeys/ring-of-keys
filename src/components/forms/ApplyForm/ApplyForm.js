import React, { useState } from "react"
import FormField from "components/FormField"
import { affiliations, locations } from "./constants"
import styles from "./ApplyForm.module.css"

export default function ApplyForm() {
    const [formStatus, setFormStatus] = useState("unsent")
    const formLabels = {
        submitting: "Loading...",
        unsent: "Submit",
        success: "Sent!",
        failure: "Please Try Again Later",
    }

    function handleSubmit(e) {
        // TODO
        console.log(e)
    }

    return (
        <>
            <form onSubmit={handleSubmit} className={styles.applyForm}>
                <h2>Tell us about yourself</h2>
                <div className={styles.basicInfo}>
                    <FormField
                        type="text"
                        name="name"
                        label="Full Name"
                        required={true}
                        placeholder="First Last"
                    />
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
