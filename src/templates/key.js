import React, { useState, useEffect } from 'react'
// import Img from 'gatsby-image'
import { graphql, Link } from 'gatsby'
import Layout from '../components/layout'
import MessagePopup from '../components/messagepopup'
import Popup from '../components/popup'
import FieldEditForm from '../components/FieldEditForm'
import BasicInfoField from '../components/BasicInfoField'
import BodyInfoField from '../components/BodyInfoField'
import ResumeField from '../components/ResumeField'
import FileDrop from '../components/filedrop'
import { handleUpdateSubmit } from '../utils/profileEditor'
import { getProfile, isAuthenticated } from "../utils/auth"
import './key.css'
import socialIcons from '../images/social-icons/socialIcons.js'
import profileIcons from '../images/profile-icons/profileIcons.js'
import EmailPopup from '../components/emailpopup'
const urlRegExpStr = '^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$'

let locationLabels = [
    "New York City", "Chicago", "Los Angeles", "Philadelphia", "San Francisco / Oakland", "Minneapolis / St. Paul", "Denver",
    "Boulder", "Orlando", "Sarasota", "Louisville", "Baltimore", "Boston", "St. Louis", "Las Vegas", "Raleigh", "Cleveland",
    "Ashland", "Portland, OR", "Pittsburgh", "Austin", "Salt Lake City", "Washington, D.C.", "Seattle", "Toronto", "Ontario",
    "London",
]
locationLabels = locationLabels.sort()
let affiliationLabels = [
    "AEA", "AFM", "AGMA", "AGVA", "ASCAP", "BMI", "CSA", "EMC", "IATSE",  "LMDA", "SAFD", "SAG/AFTRA", "SDC", "USA", "Non-union",
]
affiliationLabels = affiliationLabels.sort()

const colors = ['slate-blue', 'peach-1', 'copper-1', 'gold-1', 'pale-green-1']

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
            locations,
            affiliations,
            vocalRange,
            danceExperience,
            discipline,
            bio,
            memberSince,
            resume,
        } = data.datoCmsKey

    const isProfileOwner = isAuthenticated() && (getProfile().name === name)
    const [isEditable, setEditable] = useState(isProfileOwner)
    const [hasSubmitted, setSubmitted] = useState(false)

            
    function useFieldStates(field) {
        const [fieldValue, setFieldValue] = useState(field.data)
        field.data = fieldValue
        field.setFieldValue = setFieldValue
    
        const [isEditing, setEditing] = useState(false)
        field.isEditing = isEditing
        field.setEditing = setEditing
    }

    const heroFields = {
        headshot: {data: headshot, fieldName: 'headshot', },
        featuredImage: {data: featuredImage, fieldName: 'featuredImage', },
        socialMedia: {data: socialMedia, fieldName: 'socialMedia', },
    }

    // on first load, make the URL the correct query. Only run once so as not to append with every state change.
    useEffect(() => {
        heroFields['headshot'].data.url += '?fit=facearea&faceindex=1&facepad=5&mask=ellipse&w=180&h=180&'
    }, [heroFields])
    
    Object.keys(heroFields).forEach(key => useFieldStates(heroFields[key]))

    const bioField = {label: 'Bio', data: bio, fieldName: 'bio',}
    useFieldStates(bioField)


    const bodyFields = [
        {label: 'Sexual Orientation', data: sexualIdentity, fieldName: 'sexualIdentity', type: 'text',
         infoText: `Sexual orientation describes a person's enduring physical, romantic, and/or emotional attraction to another person `, },
        {label: 'Gender Identity', data: genderIdentity, fieldName: 'genderIdentity', type: 'text',
         infoText: `One’s internal, deeply held sense of gender. Some people identify completely with the gender they were assigned at birth (usually male or female), while others may identify with only a part of that gender, or not at all. Some people identify with another gender entirely. Unlike gender expression, gender identity is not visible to others.`},
        {label: 'Discipline', data: discipline, fieldName: 'discipline', type: 'text',},
        {label: 'Vocal Range', data: vocalRange, fieldName: 'vocalRange', type: 'text',},
        {label: 'Dance Experience', data: danceExperience, fieldName: 'danceExperience', type: 'text',},
        {label: 'Unions & Affiliations', helpText: '(check as many as apply)', refArray: affiliationLabels, 
        data: affiliations, fieldName: 'affiliations', type: 'checkbox',
        initialVals: affiliationLabels.map(label => affiliations.includes(label)),
        initialOther: getInitialOther(affiliations, affiliationLabels)
        },
        {label:'Website', data: website, fieldName: 'website', },
    ]

    bodyFields.forEach(useFieldStates)

    const resumeField = {label: 'Resume', data: resume, fieldName: 'resume',}
    useFieldStates(resumeField)

    function getInitialOther(string, valArray) {
        if (!locations) return ''
        const filteredOther = string.split(', ').filter(val => valArray.indexOf(val) < 0)
        return filteredOther ? filteredOther[0] : ''
    }

    const infoFields = [
        {label: 'Name', data: name, fieldName: 'name', type: 'text',},
        {label: 'Pronouns', data: pronouns, fieldName: 'pronouns', type: 'text',
         infoText: `When a person shares their pronouns, they are naming the pronouns that they want to be referred to by in the singular third person (when referring to that person while talking to someone else`},
        {label: 'Where are you based?', data: mainLocation, fieldName: 'mainLocation', type: 'text'},
        {label: 'Regions', helpText: '(These control your search page listing)', refArray: locationLabels, 
        data: locations, fieldName: 'locations', type: 'checkbox',
        initialVals: locationLabels.map(label => locations.includes(label)),
        initialOther: getInitialOther(locations, locationLabels)
        },
    ]
    infoFields.forEach(useFieldStates)

    const [isSubmitting, setSubmitting] = useState(false)
    const [isMessageOpen, setMessageOpen] = useState(false)

    return (<><Layout classNames={['fullwidth','key-profile']} title={ name }
            description={`(${ pronouns }) - ${ name } is a ${ discipline }, and a member of Ring of Keys.`}>
            <section className='artist_hero'
                style={{ '--grad-rot': Math.random()*360+'deg', '--grad-col-1': `var(--rok-${colors[Math.floor(Math.random()*colors.length)]}_hex)` }}>
                <div className='avatar'>
                { !isEditable
                    ? <img src={ headshot.url } alt={ headshot.title } className='headshot' />
                    : (<div className='headshot_group'>
                        <img src={ heroFields.headshot.data.url } alt={ headshot.title } className='headshot' />
                        <button className='btn_edit edit_headshot' onClick={() => heroFields.headshot.setEditing(true)}>
                            <img src={ profileIcons.camera } className='icon_edit' alt={`edit headshot`} />
                            <span className='tooltip'>Change Profile Photo</span>
                        </button>
                    </div>)
                }</div>
                <div className='artist_bio'>
                    <h1>{ infoFields[0].data }</h1>
                    { infoFields[2].data && <p>Based in {infoFields[2].data.replace(', ', ' • ')}</p> }
                    <p>{ infoFields[1].data }{ memberSince ? ` • Member Since ${ memberSince }` : '' }</p>
                    <button className='btn btn_message' onClick={ () => setMessageOpen(true) }>Message</button>
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
                            <img src={ profileIcons.pencil } className='icon_edit' alt={`edit pencil`} />
                            <span className='tooltip from-above'>Change Social Media Links</span>
                        </button>
                    </div>) }
                { heroFields.featuredImage.data && 
                    <img src={ heroFields.featuredImage.data.url } alt={ heroFields.featuredImage.data.alt } className='featured_image' /> }
                { isEditable &&
                    <button className='btn_edit edit_featuredImage' onClick={() => heroFields.featuredImage.setEditing(true)}>
                        <img src={ profileIcons.camera } className='icon_edit' alt={`edit cover icon`} />
                        <span className='tooltip'>Change Cover Photo</span>
                    </button> }
                <Link to='/directory' className='back_link'><span>Back to Directory</span></Link>
            </section>
            <section className='artist_body'>
                { isProfileOwner && 
                    <label className='toggle_group'>
                        <input type='checkbox' className='visually-hidden' checked={isEditable} onChange={() => setEditable(!isEditable)}/>
                        <span className='toggle'></span>
                        <span className='toggle_label'>Toggle Editing View</span>
                    </label>
                }
                { (bio || isEditable) &&
                <div className='my_story'>
                    <h2>My Story</h2>
                    <p>
                        { !isEditable
                            ? <p>{ bioField.data }</p>
                            :  (!bioField.isEditing)
                                ? <div className='profile_field_group'>
                                    <p>{ bioField.data
                                        ? bioField.data
                                        : <span className='unfilled-field'>
                                            Here is where you can add your bio so people know your background, your interests,
                                            and all your strengths. Tell us your story!
                                          </span>
                                    }</p>
                                    <button className='btn_edit edit_field' onClick={() => bioField.setEditing(true)}>
                                        <img src={ profileIcons.pencil } className='icon_edit' alt={`edit field`} />
                                        <span className='tooltip'>Change { bioField.label }</span>
                                    </button>
                                </div>
                                : <FieldEditForm type='textarea' key={bioField.fieldName+'-form'} userId={ id } handleClose={() => bioField.setEditing(false)}
                                    field={bioField.fieldName} val={bioField.data} handleUpdate={(newVal) => {
                                        bioField.setFieldValue(newVal)
                                        setSubmitted(true)
                                    }}
                                    isSubmitting={isSubmitting} setSubmitting={setSubmitting}/>
                        }
                    </p>
                </div>
                }
                { infoFields.map((field, i) => <BasicInfoField field={ field } index={ i } isEditable={ isEditable }  userId={ id }
                    setSubmitted={ setSubmitted } isSubmitting={ isSubmitting } setSubmitting={ setSubmitting } key={`basic-info-${ i }`} />) } 
                { bodyFields.map((field, i) => <BodyInfoField field={ field } index={ i } isEditable={ isEditable } userId={ id }
                    setSubmitted={ setSubmitted } isSubmitting={ isSubmitting } setSubmitting={ setSubmitting } key={`body-field-${ i }`} />) }
                { (resume || isEditable) 
                    && <ResumeField field={ resumeField } urlRegExpStr={ urlRegExpStr } userId={ id }
                        isEditable={ isEditable } isSubmitting={ isSubmitting } setSubmitting={ setSubmitting } setSubmitted={ setSubmitted } />
                }
            </section>
        </Layout>
        { hasSubmitted && <div className={`preview-message`}>
            <div className='wrapper'>
                <p>
                    You're viewing a preview of your new profile content. We're rebuilding the site now with your edits, and you
                    should see them across the site within a few minutes.
                </p>
                <button className='btn_close' onClick={ e => {
                        console.log('target = ', e.target)
                        let elem = e.target
                        while (!elem.classList.contains('preview-message') && elem.parentElement) {
                            elem = elem.parentElement
                        }

                        elem.classList.add('closed')
                    }}>
                    <span className='visually-hidden'>Close</span>
                    <svg viewBox='0 0 5 5'>
                        <path d='M 1 1 l 3 3' stroke='black' />
                        <path d='M 1 4 l 3 -3' stroke='black' />
                    </svg>
                </button>
            </div>
        </div> }
        <MessagePopup isOpen={ isMessageOpen } artistId={ id } onClose={ () => setMessageOpen(false) } />
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
                        handleUpdate: (newVal) => {
                            heroFields.headshot.setFieldValue({ url: newVal, alt: 'newly uploaded image'})
                            setSubmitted(true)
                        },
                        handleClose: () => heroFields.headshot.setEditing(false)
                    }, true)
                }}>
                    <FileDrop helpText='For best results, keep file size below 2Mb'/>
                    <div className='file-drop_btns'>
                        <button className='btn btn-link_ghost' onClick={() => heroFields.headshot.setEditing(false)}>
                            Cancel
                        </button>
                        <button type='submit' disabled={ isSubmitting }className={`btn ${isSubmitting ? 'submitting' : ''}`}>
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
                        handleUpdate: (newVal) => {
                            heroFields.featuredImage.setFieldValue({ url: newVal, alt: 'newly uploaded image'})
                            setSubmitted(true)
                        },
                        handleClose: () => heroFields.featuredImage.setEditing(false),
                    }, true)
                }}>
                    <FileDrop helpText='For best results, use a 3:1 aspect ratio and keep file size below 2Mb'/>
                    <div className='file-drop_btns'>
                        <button className='btn btn-link_ghost' onClick={() => heroFields.featuredImage.setEditing(false)}>
                            Cancel
                        </button>
                        <button type='submit' disabled={ isSubmitting } className={`btn ${isSubmitting ? 'submitting' : ''}`}>
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

                    const data = ([]).slice.call(e.target.elements).filter(el => el.value)
                        .map(el => (el.value.startsWith('http')) ? el.value : 'https://' + el.value)

                    handleUpdateSubmit(data, {
                        userId: id,
                        field: 'socialMedia',
                        setSubmitting,
                        handleUpdate: (newVal) => {
                            heroFields.socialMedia.setFieldValue(newVal)
                            setSubmitted(true)
                        },
                        handleClose: () => heroFields.socialMedia.setEditing(false)
                    }, false)
                }}>
                    { Object.keys(socialIcons).map(key => {
                        const s = socialMedia.find(socialObj => socialObj.socialMediaLink.includes(key))
                        return (
                    <div className='icon-field'>
                        <img src={ socialIcons[key] } />
                        <label>{ key + ' Link' }
                            <input type='text' name={ key } defaultValue={ s ? s.socialMediaLink : '' }
                            pattern={ urlRegExpStr }/>
                        </label>
                    </div>
                    )})}
                    <div className='file-drop_btns'>
                        <button className='btn btn-link_ghost' onClick={() => heroFields.socialMedia.setEditing(false)}>
                            Cancel
                        </button>
                        <button type='submit' disabled={ isSubmitting } className={`btn ${isSubmitting ? 'submitting' : ''}`}>
                            { isSubmitting ? 'Loading...' : 'Save' }
                        </button>
                    </div>
                </form>
            </Popup>
        }
        <EmailPopup />
        </>
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
            locations
            affiliations
            vocalRange
            danceExperience
            discipline
            bio
            resume
        }
    }
`
