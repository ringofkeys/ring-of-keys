import FormField from "components/FormField"
import Popup from "components/Popup"
import Link from "next/link"
import { useState } from "react"
// import sendTxtMsg from "../utils/twilioFns"

const messageStatusText = {
    unsent: "Send Message",
    sending: "Sending...",
    success: "Sent!",
    failure: "Something Went Wrong",
}

const MessagePopup = ({ isOpen, artistId, artistName, onClose }) => {
    const [messageStatus, setMessageStatus] = useState("unsent")

    async function handleSubmit(e) {
        e.preventDefault()
        e.persist()
        setMessageStatus("sending")

        console.log({artistId})

        const formVals = [].slice.call(e.target.elements)
        const values = {
            toArtist: artistId,
        }

        formVals
            .filter((el) => el.value && el.name)
            .forEach((el) => {
                values[el.name] = el.value
            })

        console.log("values = ", values)

        const sendRes = await sendMessage(values)

        console.log("sendRes", sendRes)

        if (sendRes.status === 201) {
            setMessageStatus("success")
            // sendTxtMsg(
            //     `New RoK message awaiting approval from ${values.fromName} to ${artistName}. Here's what they said:\n"${values.message}"`
            // )

            setTimeout(() => onClose(), 1250)
        } else {
            setMessageStatus("failure")
        }
    }

    return (
        <Popup isOpen={isOpen} onClose={onClose}>
            <h2>Send a message</h2>
            <p>Connect directly with this Key Member.</p>
            <form onSubmit={handleSubmit}>
                <FormField
                    type="text"
                    name="fromName"
                    label="Your Name"
                    required={true}
                />
                <FormField
                    type="email"
                    name="fromEmail"
                    label="Your Email Address"
                    required={true}
                />
                <FormField
                    type="textarea"
                    name="message"
                    label="Your Message"
                    required={true}
                />
                <label
                    className="flex input__group checkbox is-required"
                    style={{ margin: "1rem 0" }}
                >
                    <input type="checkbox" className="mr-4" required />
                    <span>
                        I have read and accepted the{" "}
                        <Link href="/privacy" target='_blank'>
                            Terms and Conditions and Privacy Policy.
                        </Link>
                    </span>
                </label>
                <button
                    type="submit"
                    className={`btn ${
                        messageStatus === "unsent" ? "has-arrow" : ""
                    } ${messageStatus}`}
                    style={{ width: "100%", padding: "1em 0" }}
                >
                    {messageStatusText[messageStatus]}
                </button>
            </form>
        </Popup>
    )
}
export default MessagePopup

async function sendMessage(data) {
    let messageRes = "no message returned"

    try {
        messageRes = await fetch("/api/createDatoMessage", {
            method: "POST",
            body: JSON.stringify(data),
        })
    } catch (err) {
        console.error("fetching error, ", err)
    }

    return messageRes
}
