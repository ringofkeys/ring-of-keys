import EmailSignupBar from "components/EmailSignupBar"
import Link from "next/link"
import { useState, useEffect } from "react"
import Popup from "./Popup"

export default function EmailPopup({ isOpen = true, setOpen, isSignedIn = false }) {
  const [isValidated, setValidated] = useState(true)
  
  useEffect(() => {
    const validated = window?.localStorage.getItem('hasEmailSignup') || isSignedIn || false
    setValidated(validated)
    
    setOpen(!validated)
  }, [isSignedIn])

  async function submitDatoViewer(email, optedIntoNewsletter) {
    console.log('submitting Viewer')

    if (!isValidated) {
      console.log('not validated, creating a viewer')
      const res = await fetch("/api/createDatoViewer", {
        method: "POST",
        body: JSON.stringify({
          email,
          optedIntoNewsletter,
        }),
      }).catch(err => console.error(err))

      setValidated(true)
      // window.localStorage.setItem('hasEmailSignup', true)
      setOpen(false)

      return res

    } else {
      return {
        result: "success",
        body: "user is in the system",
      }
    }
  }

  return (
    <Popup isOpen={isOpen} canClose={false}>
      <h2>Get Access</h2>
      <p>To Key Profiles Now</p>
      <div className="divider" style={{ margin: "2vh 0" }}></div>
      <EmailSignupBar
        labelText="Email Address"
        buttonText="Submit"
        onSubmit={submitDatoViewer}
        optIn={true}
      />
      <p style={{ marginBlockStart: "3vh" }}>
        Are you a Key? <Link href="/dashboard"><a>Sign in now.</a></Link>
      </p>
    </Popup>
  )
}
