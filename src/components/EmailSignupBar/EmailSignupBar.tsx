import React, { FormEvent } from "react"
import Link from "next/link"
import MailchimpSubscribe, {
  EmailFormFields,
  FormHooks,
} from "react-mailchimp-subscribe"
import styles from "./EmailSignupBar.module.css"

interface EmailSignupFormProps {
  labelText?: string
  optIn?: boolean
  onSubmit?: (val: string, optedIn: boolean) => Promise<Response | void>
  afterSubmit?: (val: string, optedIn: boolean) => void
  buttonText?: string
  mailchimpUrl?: string
}

const EmailSignupForm = ({
  labelText = "Receive news and updates from Ring of Keys",
  optIn = false,
  onSubmit = async (val, optedIn) => console.log(val, optedIn),
  afterSubmit = () => { },
  buttonText = "",
  mailchimpUrl,
}: EmailSignupFormProps) => {
  const MAILCHIMP_URL = (mailchimpUrl || process.env.NEXT_PUBLIC_MAILCHIMP_URL || "").trim()

  if (!MAILCHIMP_URL) {
  if (process.env.NODE_ENV !== "production") {
    console.warn("[EmailSignupBar] Missing Mailchimp URL. Set NEXT_PUBLIC_MAILCHIMP_URL or pass mailchimpUrl prop.")
  }
  return null
}

  async function handleSignup(
    e: FormEvent<HTMLFormElement>,
    mailchimpProps: FormHooks<EmailFormFields>
  ) {
    e.preventDefault()
   // e.persist()

    const { subscribe, status, message } = mailchimpProps

    const form = e.target as HTMLFormElement
    const email = (
      form.elements.namedItem("email") as HTMLInputElement
    ).value.trim()
    const optedIn = optIn ?
      (form.elements.namedItem("optedIn") as HTMLInputElement)?.checked ??
      false
      : true

    onSubmit(email, optedIn)
      .then((res) => res && res.json())
      .then((data) => console.log("onSubmit data", data))
      .catch(() => {})

    if (!optIn || optedIn) {
      try {
        subscribe({ EMAIL: email })
      } catch (err) {
        console.error(err)
      }
    }

    if (status === "success") {
      form.disabled = true
      afterSubmit(email, optedIn)
    } else {
      form.reset()
    }
  }

  return (
    <MailchimpSubscribe
      url={process.env.NEXT_PUBLIC_MAILCHIMP_URL!}
      render={(mailchimpProps) => {
        const submitStatusText = {
          sending: (
            <div
              className={
                styles.statusBox + " text-blue-600 bg-blue-100"
              }
            >
              Subscribing...
            </div>
          ),
          success: (
            <div
              className={
                styles.statusBox +
                " text-green-800 bg-green-100"
              }
            >
              You're subscribed! 🎉
            </div>
          ),
          error: (
            <div
              className={
                styles.statusBox + " text-red-700 bg-red-200"
              }
            >
              An error occurred:{" "}
              {mailchimpProps.message instanceof Error
                ? mailchimpProps.message.message
                : mailchimpProps.message}
            </div>
          ),
        }

        return (
          <form
            className={
              styles.emailSignupBar +
              " " +
              (optIn ? styles.optIn : "")
            }
            method="POST"
            onSubmit={(e) => handleSignup(e, mailchimpProps)}
          >
            <label className={styles.emailInput}>
              <span>{labelText}</span>
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                required
              />
            </label>
            <label
              className={
                styles.privacyConsent + " input__group checkbox"
              }
            >
              <input name="privacy" type="checkbox" required />
              <span>
                I agree with the&nbsp;
                <Link
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link
                  href="/terms-e-communications"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Terms of Use
                </Link>
                .
              </span>
            </label>
            {optIn && (
              <label
                className={
                  styles.privacyConsent +
                  " input__group checkbox"
                }
              >
                <input
                  name="optedIn"
                  type="checkbox"
                  defaultChecked
                />
                <span>
                  I would like to receive news and updates
                  from Ring of Keys.
                </span>
              </label>
            )}
            <button
              className={
                "btn " +
                (mailchimpProps.status
                  ? styles[mailchimpProps.status]
                  : "")
              }
              type="submit"
              disabled={mailchimpProps.status === "sending"}
            >
              {buttonText}
              <svg
                viewBox="0 0 5 7"
                style={{ margin: "0 .5rem" }}
              >
                <path
                  stroke="white"
                  strokeLinecap="round"
                  d="M 1 1 l 3 2.5 l -3 2.5"
                />
              </svg>
            </button>
            {mailchimpProps.status
              ? submitStatusText[mailchimpProps.status]
              : ""}
          </form>
        )
      }}
    />
  )
}
export default EmailSignupForm
