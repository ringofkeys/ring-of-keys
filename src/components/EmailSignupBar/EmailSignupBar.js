import React, { useState } from "react"
import Link from "next/link"
import MailchimpSubscribe from "react-mailchimp-subscribe"
import styles from "./EmailSignupBar.module.css"

const EmailSignupForm = ({
    labelText = "Receive news and updates from Ring of Keys",
    optIn = false,
    onSubmit = async (val, optedIn) => console.log(val, optedIn),
    afterSubmit = () => {},
    buttonText = "",
}) => {
    async function handleSignup(e, mailchimpProps) {
        e.preventDefault()
        e.persist()

        const { subscribe, status, message } = mailchimpProps

        const form = e.target
        const email = form.elements["email"]?.value
        const optedIn = form.elements["optedIn"]?.checked || false

        onSubmit(email, optedIn)
            .then(res => res && res.json())
            .then(data => console.log('onSubmit data', data))

        if (!optIn || optedIn) {
            try {
                console.log('attempting to subscribe...', {
                    mailchimpProps,
                    EMAIL: email,
                    optedIn,
                    url: process.env.NEXT_PUBLIC_MAILCHIMP_URL,
                })
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

    return (<MailchimpSubscribe
        url={process.env.NEXT_PUBLIC_MAILCHIMP_URL}
        render={(mailchimpProps) => {
            const submitStatusText = {
                sending: <div className={styles.statusBox + " text-blue-600 bg-blue-100"}>Subscribing...</div>,
                success: <div className={styles.statusBox + " text-green-800 bg-green-100"}>You're subscribed! 🎉</div>,
                error: <div className={styles.statusBox + " text-red-700 bg-red-200"}>An error occurred: {mailchimpProps.message}</div>,
            }

            return (
            <form
                className={
                    styles.emailSignupBar + " " + (optIn ? styles.optIn : "")
                }
                method="POST"
                onSubmit={e => handleSignup(e, mailchimpProps)}
                disabled={mailchimpProps.status === "sending"}
            >
                <label className={styles.emailInput}>
                    <span>{labelText}</span>
                    <input name="email" type="email" placeholder="Email Address" required />
                </label>
                <label className={styles.privacyConsent + " input__group checkbox"}>
                    <input name="privacy" type="checkbox" required />
                    <span>
                        I agree with the&nbsp;
                        <Link
                            href="/privacy"
                        >
                            <a 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline"
                            >Privacy Policy</a>
                        </Link>{" "}
                        and{" "}
                        <Link
                            href="/terms-e-communications"
                        >
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline"
                            >Terms of Use</a>
                        </Link>
                        .
                    </span>
                </label>
                {optIn && (
                    <label
                        className={styles.privacyConsent + " input__group checkbox"}
                    >
                        <input name="optedIn" type="checkbox" />
                        <span>
                            I would like to receive news and updates from Ring of
                            Keys.
                        </span>
                    </label>
                )}
                <button
                    className={'btn ' + styles[mailchimpProps.status]}
                    type="submit"
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
                { submitStatusText[mailchimpProps.status] || '' }
            </form>
        )}
    }
    />)
}
export default EmailSignupForm

