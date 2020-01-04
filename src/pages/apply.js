import React from 'react'
import Layout from "../components/layout"
import slugify from '../utils/slugify'
import useForm from '../hooks/useForm'

const ApplyPage = () => {
    const submit = async e => {
        e.preventDefault()
        submitApplication(inputs)
    }

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
        <form method='post'>
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
            <button onClick={submit}>Submit</button>
        </form>
        </Layout>
    )
}
export default ApplyPage

function submitApplication(data) {
    const newUser = {
        ...data,
        slug: slugify(data.name),
    }

    async function getUrls() {
        
        const signedUrlsRes = await fetch('/.netlify/functions/createDatoImgUrl', {
            method: 'POST',
            body: JSON.stringify({
                fileName: data.headshot.name,
                fileType: data.headshot.type,
            }),
        })

        const datoUrlRes = await signedUrlsRes.json()
        console.log('urls = ', datoUrlRes)

        const fr = new FileReader()

        fr.onload = async () => {
            const uploadRes = await fetch(datoUrlRes.url, {
                method: 'PUT',
                headers: {
                    'Content-Type': data.headshot.type,
                },
                body: fr.result,
            })

            console.log('uploadRes = ', uploadRes)

            newUser.headshot = datoUrlRes.id
            
            const newUserRes = await fetch('/.netlify/functions/createDatoUser', {
                method: 'POST',
                body: JSON.stringify(newUser)
            })

            console.log('newUserRes = ', await newUserRes.json().catch(err => err))

        }

        fr.readAsArrayBuffer(data.headshot)
    }

    getUrls()

}