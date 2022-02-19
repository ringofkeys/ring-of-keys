import React, { useState } from "react"
import Link from "next/link"
import styles from "./EmailSignupBar.module.css"

const EmailSignupForm = ({
  labelText = "Receive news and updates from Ring of Keys",
  optIn = false,
  onSubmit = val => console.log(val),
  afterSubmit = () => {},
  buttonText = "",
}) => {
  const [submitStatus, setSubmitStatus] = useState("unsent")

  async function handleSignup(e) {
    e.preventDefault()
    e.persist()
    setSubmitStatus("sending")

    const sendRes = !optIn
      ? await onSubmit(e.target.elements[0].value)
      : await onSubmit(e.target.elements[0].value, e.target.elements[2].checked)

    if (optIn && e.target.elements[2].checked) {
      try {
        // addToMailchimp(e.target.elements[0].value)
      } catch (err) {
        console.error(err)
      }
    }

    if (sendRes.result === "success" || sendRes.status === 200) {
      setSubmitStatus("sent")
      e.target.disabled = true
      afterSubmit(sendRes)
    } else {
      setSubmitStatus("failed")
      e.target.reset()
    }
  }

  return (
    <form
      className={styles.EmailSignupBar + " " + (optIn ? styles.optIn : "")}
      method="POST"
      onSubmit={handleSignup}
    >
      <label className={styles.emailInput}>
        <span>{labelText}</span>
        <input type="email" placeholder="Email Address" required />
      </label>
      <label className={styles.privacyConsent + " input__group checkbox"}>
        <input type="checkbox" required />
        <span>
          I agree with the&nbsp;
          <Link href="/privacy" target="_blank" rel="noopener noreferrer">
            <a>Privacy Policy</a>
          </Link>{" "}
          and{" "}
          <Link
            href="/terms-e-communications"
            target="_blank"
            rel="noopener noreferrer"
          >
            <a>Terms of Use</a>
          </Link>
          .
        </span>
      </label>
      {optIn && (
        <label className={styles.privacyConsent + " input__group checkbox"}>
          <input type="checkbox" />
          <span>
            I would like to receive news and updates from Ring of Keys.
          </span>
        </label>
      )}
      <button
        className={`btn ${submitStatus}`}
        type="submit"
        disabled={submitStatus === "sending" || submitStatus === "sent"}
      >
        {buttonText}
        <svg viewBox="0 0 5 7" style={{ margin: "0 .5rem" }}>
          <path
            stroke="white"
            strokeLinecap="round"
            d="M 1 1 l 3 2.5 l -3 2.5"
          />
        </svg>
      </button>
    </form>
  )
}
export default EmailSignupForm
