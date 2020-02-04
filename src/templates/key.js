import React, { useState } from 'react'
// import Img from 'gatsby-image'
import { graphql, Link } from 'gatsby'
import Layout from '../components/layout'
import MessagePopup from '../components/messagepopup'
import Popup from '../components/popup'
import FileDrop from '../components/filedrop'
import { renderHtmlToReact } from '../utils/renderHtmlToReact'
import { uploadFile } from '../utils/datoUploads'
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
        handleUpdateSubmit(e, {userId, field, handleClose, setSubmitting, handleUpdate})
    }}>
        <input type='text' required />
        <button className='btn bg_slate btn_submit' type='submit'>
            { isSubmitting ? 'Loading...' : 'Update' }
        </button>
    </form>
    <button className='btn_edit edit_field' onClick={handleClose}>
        <img src={ icon_close } className='icon_edit' alt={`close`} />
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
            memberSince,
            resume,
        } = data.datoCmsKey

    const [isEditable, setEditable] = useState(isAuthenticated() && (getProfile().name === name))

    const heroFields = {
        headshot: {data: headshot, fieldName: 'headshot', },
        featuredImage: {data: featuredImage, fieldName: 'featuredImage', },
        socialMedia: {data: socialMedia, fieldName: 'socialMedia', },
    }
    Object.keys(heroFields).forEach(key => {
        if (key === 'headshot') {
            heroFields[key].data.url += '?fit=facearea&faceindex=1&facepad=5&mask=ellipse&w=180&h=180&'
        }
        const [fieldValue, setFieldValue] = useState(heroFields[key].data)
        heroFields[key].data = fieldValue
        heroFields[key].setFieldValue = setFieldValue
    
        const [isEditing, setEditing] = useState(false)
        heroFields[key].isEditing = isEditing
        heroFields[key].setEditing = setEditing
    })
    

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
            <section className='artist_hero'
                style={{ '--grad-rot': Math.random()*360+'deg', '--grad-col-1': `var(--rok-${colors[Math.floor(Math.random()*colors.length)]}_hex)` }}>
                <div className='avatar'>
                { !isEditable
                    ? <img src={ headshot.url } alt={ headshot.title } className='headshot' />
                    : (<div className='headshot_group'>
                        <img src={ heroFields.headshot.data.url } alt={ headshot.title } className='headshot' />
                        <button className='btn_edit edit_headshot' onClick={() => heroFields.headshot.setEditing(true)}>
                            <img src={ icon_camera } className='icon_edit' alt={`edit headshot`} />
                            <span className='tooltip'>Change Profile Photo</span>
                        </button>
                    </div>)
                }</div>
                <div className='artist_bio'>
                    <h1>{ name }</h1>
                    { mainLocation && <p>Based in {mainLocation.replace(', ', ' • ')}</p> }
                    <p>{ pronouns }{ memberSince ? ` • Member Since ${ memberSince }` : '' }</p>
                    <button className='btn btn_message' onClick={() => setMessageOpen(true)}>Message</button>
                </div>
                { !isEditable
                    ? ( socialMedia && (<div className='artist_social-icons'>
                    {socialMedia.map(socialObj => {
                        const mediaPlatform = Object.keys(socialIcons).filter((key) => socialObj.socialMediaLink.includes(key))[0]
                        return (
                        <a href={socialObj.socialMediaLink} rel='noopener noreferrer' target='_blank' className='social-icon' key={mediaPlatform}>
                            <img src={ socialIcons[mediaPlatform] } alt={`${mediaPlatform}`} />
                        </a>
                        )}
                    )}
                    </div>))
                    : (<div className='artist_social-icons'>
                        { Object.keys(socialIcons).map(key => {
                            const hasLink = socialMedia.find(socialObj => socialObj.socialMediaLink.includes(key))
                            return (
                                <div className='social-icon'>
                                    <img src={ socialIcons[key] } alt={`${ key }`} className={!hasLink ? 'inactive' : ''}/>
                                </div>
                            )
                        })}
                        <button className='btn_edit edit_social' onClick={() => heroFields.socialMedia.setEditing(true)}>
                            <img src={ icon_pencil } className='icon_edit' alt={`edit pencil`} />
                            <span className='tooltip from-above'>Change Social Media Links</span>
                        </button>
                    </div>) }
                { heroFields.featuredImage.data && 
                    <img src={ heroFields.featuredImage.data.url } alt={ heroFields.featuredImage.data.alt } className='featured_image' /> }
                { isEditable &&
                    <button className='btn_edit edit_featuredImage' onClick={() => heroFields.featuredImage.setEditing(true)}>
                        <img src={ icon_camera } className='icon_edit' alt={`edit cover icon`} />
                        <span className='tooltip'>Change Cover Photo</span>
                    </button> }
                <Link to='/directory' className='back_link'><span>Back to Directory</span></Link>
            </section>
            <section className='artist_body'>
                { bioNode.childMarkdownRemark.htmlAst.children &&
                <div className='my_story'>
                    <h2>My Story</h2>
                    { renderHtmlToReact(bioNode.childMarkdownRemark.htmlAst) }
                </div>
                }
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
                { resume && resume.url && 
                    <a className='btn btn_resume' href={ resume.url } rel='noopener noreferrer' target='_blank'>
                        View Resume
                    </a>
                }
            </section>
            <MessagePopup isOpen={isMessageOpen} artistId={id} onClose={() => setMessageOpen(false)} />
            {/* <Popup isOpen={isMessageOpen} onClose={() => setMessageOpen(false)} >
                <h2>Messaging is coming soon!</h2>
                <p>
                    Our developers actually have it working, and are planning to roll it out on February 3rd to beta testers!
                </p>
            </Popup> */}
            { heroFields.headshot.isEditing && 
                    <Popup isOpen={ heroFields.headshot.isEditing } onClose={ () => heroFields.headshot.setEditing(false) } >
                        <h2 className='file-drop_h2'>Change Profile Photo</h2>
                        <form id='edit-headshot' onSubmit={e => {
                            e.preventDefault()
                            e.persist()

                            handleUpdateSubmit(e.target.elements[0].files[0], {
                                userId: id,
                                field: 'headshot',
                                setSubmitting,
                                handleUpdate: (newVal) => heroFields.headshot.setFieldValue({ url: newVal, alt: 'newly uploaded image'}),
                                handleClose: () => heroFields.headshot.setEditing(false)
                            }, true)
                        }}>
                            <FileDrop />
                            <div className='file-drop_btns'>
                                <button className='btn btn-link_ghost' onClick={() => heroFields.headshot.setEditing(false)}>
                                    Cancel
                                </button>
                                <button className='btn' type='submit' disabled={ isSubmitting }>
                                    { isSubmitting ? 'Loading...' : 'Save' }
                                </button>
                            </div>
                        </form>
                    </Popup>
                }
                { heroFields.featuredImage.isEditing && 
                    <Popup isOpen={ heroFields.featuredImage.isEditing } onClose={ () => heroFields.featuredImage.setEditing(false) } >
                        <h2 className='file-drop_h2'>Change Cover Photo</h2>
                        <form id='edit-featured-image' onSubmit={ e => {
                            e.preventDefault()
                            e.persist()

                            handleUpdateSubmit(e.target.elements[0].files[0], {
                                userId: id,
                                field: 'featuredImage',
                                setSubmitting,
                                handleUpdate: (newVal) => heroFields.featuredImage.setFieldValue({ url: newVal, alt: 'newly uploaded image'}),
                                handleClose: () => heroFields.featuredImage.setEditing(false)
                            }, true)
                        }}>
                            <FileDrop helpText='(For best results, use a 3:1 aspect ratio)'/>
                            <div className='file-drop_btns'>
                                <button className='btn btn-link_ghost' onClick={() => heroFields.featuredImage.setEditing(false)}>
                                    Cancel
                                </button>
                                <button className='btn' type='submit' disabled={ isSubmitting }>
                                    { isSubmitting ? 'Loading...' : 'Save' }
                                </button>
                            </div>
                        </form>
                    </Popup>
                }
                { heroFields.socialMedia.isEditing && 
                    <Popup isOpen={ heroFields.socialMedia.isEditing } onClose={ () => heroFields.socialMedia.setEditing(false) } >
                        <h2 className=''>Set Social Media Links</h2>
                        <p>
                            Go to your social media profile and copy &amp; paste the URL from the browser in the appropriate field 
                        </p>
                        <form id='edit-social-media' onSubmit={e => {
                            e.preventDefault()
                            e.persist()

                            handleUpdateSubmit(e.target.elements.filter(el => el.value).map(el => {
                                return {
                                    socialMediaLink: el.value
                                }
                            }), {
                                userId: id,
                                field: 'socialMedia',
                                setSubmitting,
                                handleUpdate: (newVal) => heroFields.socialMedia.setFieldValue(newVal),
                                handleClose: () => heroFields.socialMedia.setEditing(false)
                            }, false)
                        }}>
                            { Object.keys(socialIcons).map(key => {
                                const s = socialMedia.find(socialObj => socialObj.socialMediaLink.includes(key))
                                return (
                            <div className='icon-field'>
                                <img src={ socialIcons[key] } />
                                <label>{ key + ' Link' }
                                    <input type='text' name={ key } value={ s ? s.socialMediaLink : '' }/>
                                </label>
                            </div>
                            )})}
                            <div className='file-drop_btns'>
                                <button className='btn btn-link_ghost' onClick={() => heroFields.socialMedia.setEditing(false)}>
                                    Cancel
                                </button>
                                <button className='btn' type='submit' disabled={ isSubmitting }>
                                    { isSubmitting ? 'Loading...' : 'Save' }
                                </button>
                            </div>
                        </form>
                    </Popup>
                }
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
            memberSince
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

async function handleUpdateSubmit(dataValue, { userId, field, setSubmitting, handleUpdate, handleClose }, isFile) {
    setSubmitting(true)
    
    let updateRes = {status: 500}

    try {
        const file = {}
        if (isFile) {
            file = dataValue
            const uploadRes = await uploadFile(dataValue).catch(err => console.error(err))
            dataValue = uploadRes[0].id
        }

        updateRes = await updateField(userId.match(/-(\d+)-/)[1], { [field]: dataValue }, isFile)
        console.log('updateRes = ', updateRes)

        
        if (updateRes.status === 200) {
            if (isFile) {
                const newUrl = URL.createObjectURL(file)
                console.log('new URL = ', newUrl)
                handleUpdate(newUrl)
            } else {
                handleUpdate(dataValue)
            }
            handleClose()
        } else {
            console.log('bad response!')
        }
    } catch (err) {
        console.error(err)
    }

    setSubmitting(false)    
}

async function updateField(id, data, isFile) {
    const fieldEditRes = await fetch('/.netlify/functions/updateDatoField', {
        method: 'POST',
        body: JSON.stringify({
            id,
            data,
            isFile
        }),
    }).catch(err => console.error(err))

    return fieldEditRes
}