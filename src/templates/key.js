import React, { useState } from 'react'
// import Img from 'gatsby-image'
import { graphql, Link } from 'gatsby'
import Layout from '../components/layout'
import MessagePopup from '../components/messagepopup'
import { renderHtmlToReact } from '../utils/renderHtmlToReact'
import { getProfile, isAuthenticated } from "../utils/auth"

import './key.css'
import icon_youtube from '../images/social-icons/icon_youtube.svg'
import icon_instagram from '../images/social-icons/icon_instagram.svg'
import icon_facebook from '../images/social-icons/icon_facebook.svg'
import icon_twitter from '../images/social-icons/icon_twitter.svg'
import icon_linkedin from '../images/social-icons/icon_linkedin.svg'
import icon_camera from '../images/icon_camera.svg'
import icon_close from '../images/icon_close.svg'
import icon_pencil from '../images/icon_pencil.svg'
const socialIcons = {
    youtube: icon_youtube,
    instagram: icon_instagram,
    facebook: icon_facebook,
    twitter: icon_twitter,
    linkedin: icon_linkedin,
}

const colors = ['slate-blue', 'peach-1', 'copper-1', 'gold-1', 'pale-green-1']

const FieldEditForm = ({ id, userId, field, handleClose, isSubmitting, setSubmitting, handleUpdate}) => (<div id={id} className='profile_field_group'>
    <form onSubmit={e => {
        e.persist()
        handleUpdateSubmit(e, {userId, field, handleClose, setSubmitting, handleUpdate, handleClose})
    }}>
        <input type='text' required />
        <button className='btn bg_slate btn_submit' type='submit'>
            { isSubmitting ? 'Loading...' : 'Update' }
        </button>
    </form>
    <button className='btn_edit edit_field' onClick={handleClose}>
        <img src={ icon_close } className='icon_edit' alt={`close contact`} />
        <span className='tooltip'>Cancel Edit</span>
    </button>
</div>)

export default ({ data }) => {
    const { name,
            id,
            pronouns,
            website,
            socialMedia,
            headshot,
            featuredImage,
            genderIdentity,
            sexualIdentity,
            mainLocation,
            vocalRange,
            discipline,
            bioNode,
            resume,
        } = data.datoCmsKey

    let isEditable = (isAuthenticated() && (getProfile().name === name))


    const bodyFields = [
        {label: 'Gender Identity', data: genderIdentity, fieldName: 'genderIdentity', },
        {label: 'Sexual Identity', data: sexualIdentity, fieldName: 'sexualIdentity', },
        {label: 'Vocal Range', data: vocalRange, fieldName: 'vocalRange', },
        {label: 'Discipline', data: discipline, fieldName: 'discipline', },
        {label:'Website', data: website, fieldName: 'website', },
    ]

    bodyFields.forEach(field => {
        const [fieldValue, setFieldValue] = useState(field.data)
        field.data = fieldValue
        field.setFieldValue = setFieldValue

        const [isEditing, setEditing] = useState(false)
        field.isEditing = isEditing
        field.setEditing = setEditing
    })

    const [isSubmitting, setSubmitting] = useState(false)
    const [isMessageOpen, setMessageOpen] = useState(false)

    return (
        <Layout classNames={['fullwidth']}>
            <div className='artist_hero'
                style={{ '--grad-rot': Math.random()*360+'deg', '--grad-col-1': `var(--rok-${colors[Math.floor(Math.random()*colors.length)]}_hex)` }}>
                { !isEditable
                    ? <img src={ headshot.url+'?fit=facearea&faceindex=1&facepad=5&mask=ellipse&w=180&h=180&' } alt={ headshot.title } className='avatar' />
                    : (<div className='headshot_group'>
                        <img src={ headshot.url+'?fit=facearea&faceindex=1&facepad=5&mask=ellipse&w=180&h=180&' } alt={ headshot.title } className='avatar' />
                        <button className='btn_edit edit_headshot'>
                            <img src={ icon_camera } className='icon_edit' alt={`edit headshot`} />
                            <span className='tooltip'>Change Profile Photo</span>
                        </button>
                    </div>)
                }
                <div className='artist_bio'>
                    <h1>{ name }</h1>
                    { mainLocation && <p>Based in {mainLocation.replace(', ', ' · ')}</p> }
                    <p>{ pronouns }</p>
                    { !isEditable
                        ? (<button className='btn btn_message' onClick={() => setMessageOpen(true)}>Message</button>)
                        : (<div className='message_group'>
                            <button className='btn btn_message' onClick={() => setMessageOpen(true)}>Message</button>
                            <button className='btn_edit edit_contactMethod'>
                                <img src={ icon_pencil } className='icon_edit' alt={`edit contact`} />
                                <span className='tooltip'>Change Contact Method</span>
                            </button>
                        </div>)
                    }
                </div>
                {socialMedia && (<div className='artist_social-icons'>
                    {socialMedia.map(socialObj => {
                        const mediaPlatform = Object.keys(socialIcons).filter((key) => socialObj.socialMediaLink.includes(key))[0]
                        return (
                        <a href={socialObj.socialMediaLink} rel='noopener noreferrer' target='_blank' className='social-icon' key={mediaPlatform}>
                            <img src={ socialIcons[mediaPlatform] } alt={`${mediaPlatform}`} />
                        </a>
                        )}
                    )}
                </div>)}
                { featuredImage && 
                    <img src={ featuredImage.url } alt={ featuredImage.alt } className='featured_image' /> }
                { isEditable &&
                    <button className='btn_edit edit_featuredImage'>
                        <img src={ icon_camera } className='icon_edit' alt={`edit cover icon`} />
                        <span className='tooltip'>Change Cover Photo</span>
                    </button> }
                <Link to='/directory' className='back_link'><span>Back to Directory</span></Link>
            </div>
            <section className='artist_body'>
                <div className='my_story'>
                    <h2>My Story</h2>
                    { renderHtmlToReact(bioNode.childMarkdownRemark.htmlAst) }
                </div>
                {bodyFields.map(({data, label, isEditing, setEditing, fieldName, setFieldValue}, i) => data && (<>
                    <h3>{ label }</h3>
                    { !isEditable
                        ? (<p>{ !data.includes('http') ? data
                            : <a href={data} rel='noopener noreferrer' target='_blank'>{data}</a> }</p>)
                        : (!isEditing) 
                            ? (<div className='profile_field_group'>
                                <p>{ !data.includes('http') ? data
                                    : <a href={data} rel='noopener noreferrer' target='_blank'>{data}</a> }</p>
                                <button className='btn_edit edit_field' onClick={() => setEditing(true)}>
                                    <img src={ icon_pencil } className='icon_edit' alt={`edit field`} />
                                    <span className='tooltip'>Change { label }</span>
                                </button>
                              </div>)
                            : <FieldEditForm key={fieldName+'-form-'+i} userId={ id } handleClose={() => setEditing(false)}
                                field={fieldName} handleUpdate={(newVal) => setFieldValue(newVal)}
                                isSubmitting={isSubmitting} setSubmitting={setSubmitting}/>  
                    }
                </>))}
                { resume && resume.url && <a className='btn btn_resume' href={ resume.url } rel='noopener noreferrer' target='_blank'>View Resume</a> }
            </section>
            <MessagePopup isOpen={isMessageOpen} artistId={id} onClose={() => setMessageOpen(false)} />
        </Layout>
    )
}

export const query = graphql`
    query KeyQuery($slug: String!) {
        datoCmsKey(slug: { eq: $slug }) {
            name
            id
            pronouns
            headshot {
                url
                title
            }
            featuredImage {
                url
                alt
            }
            email
            website
            socialMedia {
                socialMediaLink
            }
            genderIdentity
            sexualIdentity
            mainLocation
            vocalRange
            discipline
            bioNode {
                childMarkdownRemark {
                    htmlAst
                }
            }
            resume {
                url
            }
        }
    }
`

async function handleUpdateSubmit(e, { userId, field, setSubmitting, handleUpdate, handleClose}) {
    e.preventDefault()
    setSubmitting(true)
    
    let updateRes = {status: 500}

    try {
        updateRes = await updateField(userId.match(/-(\d+)-/)[1], { [field]: e.target.elements[0].value})
        
        if (updateRes.status === 200) {
            handleUpdate(e.target.elements[0].value)
            handleClose()
        }
    } catch (err) {
        console.error(err)
    }

    setSubmitting(false)    
}

async function updateField(id, data) {
    const fieldEditRes = await fetch('http://localhost:55691/.netlify/functions/updateDatoField', {
        method: 'POST',
        body: JSON.stringify({
            id,
            data,
        }),
    }).catch(err => console.error(err))

    return fieldEditRes
}