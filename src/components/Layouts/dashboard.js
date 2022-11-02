import React, { useEffect, useState } from "react"
import { Router } from "@reach/router"
import { login, isAuthenticated, getProfile } from "../../utils/auth.js"
import { decodeHtmlEntity } from "../../utils/htmlEntity.js"
import Home from "../dashboard/home"
import "./dashboard.css"

const homeDir = "/dashboard"

const Dashboard = ({ data }) => {
  const [user, setUser] = useState(false)
  useEffect(() => {
    async function fetchUser(id) {
      const res = await getDatoProfile(id)
      setUser(res.data.key)
    }

    let auth0Profile = getProfile()

    console.log({ auth0Profile, isAuthenticated })

    if (!auth0Profile || !auth0Profile.name || !isAuthenticated) {
      login()
      return <p>Redirecting to login</p>
    }

    if (auth0Profile.name) {
      auth0Profile.name = decodeHtmlEntity(auth0Profile.name)
    }

    localStorage.setItem("hasEmailSignup", "true") // ensure logged-in users don't receive popups

    const datoId =
      auth0Profile["https://ringofkeys.org/user_metadata"].entity_id
    fetchUser(datoId)
  }, [])

  return (
    <>
      {user && (
        <div className="dashboard_container">
          <Router basepath={homeDir}>
            <Home path="/" user={user} />
          </Router>
        </div>
      )}
    </>
  )
}
export default Dashboard

async function getDatoProfile(id) {
  return await fetch("https://graphql.datocms.com/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${process.env.GATSBY_DATO_READ_ONLY_TOKEN}`,
    },
    body: JSON.stringify({
      query: `{
          key(filter: {id: {eq: "${id}"}}) {
              id
              name
              headshot {
                url
              }
              slug
              stripeId
              stripeStatus
              isBetaUser
          }
        }`,
    }),
  })
    .then(res => res.json())
    .catch(error => {
      console.log(error)
    })
}
