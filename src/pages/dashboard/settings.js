import React, { useState } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import useForm from '../../hooks/useForm'



const Settings = (user) => {
    const allUsers = useStaticQuery(graphql`
    query SettingsQuery {
      allDatoCmsKey {
        edges {
          node {
            slug
            name
            email
            isemailpublic
            headshot {
              url
            }
            pronouns
            id
          }
        }
      }
    }
  `)

  // const userData = allUsers.allDatoCmsKey.edges.filter(({ node }) => node.email === user.user.email)[0].node
  // // I've had to rewerite this like 7 times completely from the ground up when it breaks and it's getting really annoying to write the same exact *working* code.

  // const submit = async e => {
  //   console.log('submitting! anyone??')
  //   e.preventDefault()
  //   submitApplication(userData.id, {...inputs}, userData)
  // }

  // const { inputs, handleChange } = useForm({
  //   ...userData
  // })
  // const [isEditing, toggleEditing] = useState(false)

  // console.log('inputs = ', inputs)

  return (
    <>
      <h1>Profile Settings</h1>
      {/* <pre>{ JSON.stringify(userData, null, 2) }</pre>
      <button onClick={() => toggleEditing(!isEditing)}>✏ Edit</button>
      { (!isEditing) ? (<>
        <div>Name: <span>{ userData.name }</span></div>
        <div>Email: <span>{ userData.email }</span></div>
        <div>Display Email: <span>{ (userData.isemailpublic) ? 'Yes' : 'No' }</span></div>
        <div>Pronouns: <span>{ userData.pronouns }</span></div>
        <div><img src={ (userData.headshot) ? userData.headshot.url : '' } alt={ userData.name + ' headshot' } /></div>
      </>) : (<>
        <form method='post' >
          <label style={{display: 'block', margin: '1.5em'}}>Name 
              <input type='text' name='name'
                value={ inputs.name } onChange={ handleChange } />
          </label>
          <label style={{display: 'block', margin: '1.5em'}}>Email
              <input type='email' name='email'
                value={ inputs.email } onChange={ handleChange } />      
          </label>
          <label style={{display: 'block', margin: '1.5em'}}>Is Email Public?
              <input type='checkbox' name='isemailpublic'
                checked={ inputs.isemailpublic } onChange={ handleChange } />
          </label>
          <label style={{display: 'block', margin: '1.5em'}}>Pronouns
              <input type='text' name='pronouns'
                value={ inputs.pronouns } onChange={ handleChange } />      
          </label>
          <label style={{display: 'block', margin: '1.5em'}}>Headshot
              <input type='file' name='headshot'
                accept='image/*' files={ inputs.headshot } onChange={ handleChange } />      
          </label>
            <img src={ userData.headshot.url } alt={ userData.name + ' headshot' } />
          <input type='submit' onClick={submit} />
        </form>
      </>)
      } */}
    </>
  )
}
export default Settings


async function submitApplication(id, newData, oldData) {
  console.log('newData =', newData)
  const updates = {}
  Object.keys(newData).forEach(key => {
    if ((newData[key] !== oldData[key]) && !!newData[key]){
      updates[key] = newData[key]
    }
  })

  console.log('updates = ', updates)


  if (Object.keys(updates).length < 1) return

  if (updates.headshot) {
    // const urlRes = await getSignedUrls()
  }

  //const updateRes = await fetch(http://locahost:55167/.netlify/functions/updateDatoUser)


} 



