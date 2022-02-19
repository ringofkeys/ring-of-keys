import React, { useState, useEffect } from "react"
import withLocation from "../components/withLocation"
import { getProfile } from "../utils/auth"
import { decodeHtmlEntity } from "../utils/htmlEntity"
import { updateFields } from "../utils/profileEditor"

const KeyshipButton = ({ search }) => {
  const [ready, setReady] = useState(false)
  console.log({ search })

  async function saveStripeId(sessionId) {
    const profile = getProfile()
    if (!profile) {
      setReady(true)
      return
    }

    const name = decodeHtmlEntity(profile.name)
    const datoId = profile["https://ringofkeys.org/user_metadata"].entity_id

    const data = await fetch(
      "https://api.stripe.com/v1/checkout/sessions/" + sessionId,
      {
        headers: {
          Authorization: "Bearer " + process.env.GATSBY_STRIPE_SECRET_KEY,
        },
      }
    ).then(res => res.json())

    localStorage.setItem("stripe_customer", data.customer)

    // const response = await updateFields(datoId, name, { stripeId: data.customer })

    setReady(true)
  }

  useEffect(() => {
    if (search && search.session_id) {
      saveStripeId(search.session_id)
    } else {
      setReady(true)
    }
  }, [])

  return (
    <a
      href={getProfile() ? (ready ? "/dashboard/" : "") : "/"}
      className={"btn bg_navy " + (ready ? "has-arrow" : "bg_gray")}
    >
      {getProfile()
        ? ready
          ? "Return to Dashboard"
          : "Loading..."
        : "Return Home"}
    </a>
  )
}

export default withLocation(KeyshipButton)
