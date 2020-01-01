import React from 'react'
import Layout from "../components/layout"
import slugify from '../utils/slugify'
import useForm from '../hooks/useForm'

const ApplyPage = () => {
    const { inputs, handleChange } = useForm({
        name: '',
        email: '',
        isemailpublic: false,
        pronouns: '',
        headshot: '',
    })
    
    return (
        <Layout>
        <h1>Apply to be a Key</h1>
        <form method='post'
          onSubmit={async e => {
              e.preventDefault()
              submitApplication(inputs)
          }}>
            <label style={{display: 'block', margin: '1.5em'}}>Name 
                <input type='text' name='name' required
                  value={ inputs.name } onChange={ handleChange } />
            </label>
            <label style={{display: 'block', margin: '1.5em'}}>Email
                <input type='email' name='email' required
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
                <input type='file' name='headshot' required
                  accept='image/*' files={ inputs.headshot } onChange={ handleChange } />      
            </label>
            <input type='submit'/>
        </form>
        </Layout>
    )
}
export default ApplyPage

function submitApplication(data) {
    const newUser = {
        ...data,
        slug: slugify(data.name),
        fileType: data.headshot.type,
    }
    const reader = new FileReader()

    reader.onload = async () => {
        newUser.headshot = reader.result

        const datoArtist = await fetch('http://localhost:57914/.netlify/functions/createDatoArtist', {
            method: 'POST',
            body: JSON.stringify(newUser),
        })

        console.log('datoArtist', datoArtist)
    }

    reader.readAsDataURL(newUser.headshot)
}