import React, { useState, useEffect } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import Popup from "./popup"
import EmailSignupBar from "./emailsignupbar"
import { hasEmailSignup, isAuthenticated } from "../utils/auth"

const EmailPopup = () => {
    const [popupState, setPopupState] = useState(true)
    const { allDatoCmsViewer: viewers, allDatoCmsKey: keys } =
        useStaticQuery(graphql`
            query EmailPopupQuery {
                allDatoCmsViewer {
                    edges {
                        node {
                            email
                        }
                    }
                }
                allDatoCmsKey {
                    edges {
                        node {
                            email
                        }
                    }
                }
            }
        `)

    useEffect(() => {
        if (!(hasEmailSignup() || isAuthenticated())) {
            setPopupState(false)
        }
    }, [])

    function isInDatoCMS(email) {
        return (
            viewers.edges.some(({ node: viewer }) =>
                viewer.email.includes(email)
            ) || keys.edges.some(({ node: key }) => key.email.includes(email))
        )
    }

    async function submitDatoViewer(email, optedIntoNewsletter) {
        console.log("submitting", email, optedIntoNewsletter)

        if (!isInDatoCMS(email)) {
            return await fetch("/.netlify/functions/createDatoViewer", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    optedIntoNewsletter,
                }),
            }).catch((err) => console.error(err))
        } else {
            return {
                result: "success",
                body: "user is in the system",
            }
        }
    }

    function afterSubmit() {
        setTimeout(() => {
            localStorage.setItem("hasEmailSignup", "true")
            setPopupState(true)
        }, 750)
    }

    return (
        <Popup isOpen={popupState === false} canClose={false}>
            <h2>Get Access</h2>
            <p>To Key Profiles Now</p>
            <div className="divider" style={{ margin: "2vh 0" }}></div>
            <EmailSignupBar
                labelText="Email Address"
                buttonText="Submit"
                onSubmit={submitDatoViewer}
                afterSubmit={afterSubmit}
                optIn={true}
            />
            <p style={{ marginBlockStart: "3vh" }}>
                Are you a Key? <Link to="/dashboard">Sign in now.</Link>
            </p>
        </Popup>
    )
}

export default EmailPopup
