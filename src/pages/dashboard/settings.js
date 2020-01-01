import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'

const Settings = (props) => {
    const allUsers = useStaticQuery(graphql`
    query SettingsQuery {
      allDatoCmsKey {
        edges {
          node {
            name
            email
            pronouns
            headshot {
                url
            }
          }
        }
      }
    }
  `)

   const userData = allUsers.allDatoCmsKey.edges

  //  console.log('email = ', props.user.email, 'userData = ', userData, 'userdata emails = ', userData.map((node) => node.email))
    return (
        <>
            <h1>Settings</h1>
            {/* <p>{ userData.name }</p>
            <em>{ userData.pronouns }</em> */}
        </>
    )
}
export default Settings