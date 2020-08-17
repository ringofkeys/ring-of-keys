import React, { useState, useEffect } from 'react'
// import Img from 'gatsby-image'
import { graphql, Link } from 'gatsby'
import Layout from '../components/layout'
import MessagePopup from '../components/messagepopup'
import { getProfile, isAuthenticated } from "../utils/auth"
import { Hero, Body } from '../components/profile'
import './key.css'
import socialIcons from '../images/social-icons/socialIcons.js'
import profileIcons from '../images/profile-icons/profileIcons.js'
import EmailPopup from '../components/emailpopup'
import PreviewMessage from '../components/PreviewMessage'
import { decodeHTMLEntities, updateFields } from '../utils/profileEditor'

const colors = ['slate-blue', 'peach-1', 'copper-1', 'gold-1', 'pale-green-1']

export default ({ data }) => { 

    const isProfileOwner = isAuthenticated() && (decodeHTMLEntities(getProfile().name) === data.datoCmsKey.name)
    const [isEditable, setEditable] = useState(isProfileOwner)
    const [isSubmitting, setSubmitting] = useState(false)
    const [isMessageOpen, setMessageOpen] = useState(false)
    const [hasSubmitted, setSubmitted] = useState(false)
    const editorState = { isEditable, isSubmitting, setSubmitting, setSubmitted }
    
    const [editedFields, setEditedFields] = useState({})
    const updateField = (key, val) => {
        const newFields = Object.assign({}, editedFields)
        newFields[key] = val
        setEditedFields(newFields)
        console.log('edited fields so far', newFields)
    }            

    function useFieldStates(field) {
        const [fieldValue, setFieldValue] = useState(field.data)
        field.data = fieldValue
        field.setFieldValue = setFieldValue
    
        const [isEditing, setEditing] = useState(false)
        field.isEditing = isEditing
        field.setEditing = setEditing

        field.updateField = updateField
    }

    const applyDatoField = (field) => {
        field.data = (!field.initialVals) ? data.datoCmsKey[field.fieldName] : [...field.initialVals, field.initialOther]
        return field
    }

    const heroFields = getHeroFields()
    Object.keys(heroFields).forEach(key => { heroFields[key].data = data.datoCmsKey[heroFields[key].fieldName] })

    // on first load, make the URL the correct query. Only run once so as not to append with every state change.
    useEffect(() => {
        heroFields['headshot'].data.url += '?fit=facearea&faceindex=1&facepad=5&mask=ellipse&w=180&h=180&'
    }, [])
    
    Object.keys(heroFields).forEach(key => useFieldStates(heroFields[key]))

    const bioField = applyDatoField({label: 'Bio', fieldName: 'bio',})
    useFieldStates(bioField)


    const bodyFields = getBodyFields(data.datoCmsKey.affiliations, data.datoCmsKey.locations)
        .map(applyDatoField)
    bodyFields.forEach(useFieldStates)

    const resumeField = applyDatoField({label: 'Resume', fieldName: 'resume',})
    useFieldStates(resumeField)

    const infoFields = getInfoFields(data.datoCmsKey.locations)
        .map(applyDatoField)
    infoFields.forEach(useFieldStates)

    async function handleProfileSave() {
        setSubmitting(true)
        const saveRes = await updateFields(data.datoCmsKey.id, data.datoCmsKey.name, editedFields)
        console.log('saveRes', saveRes)
        setSubmitting(false)
        setSubmitted(true)
    }

    return (<><Layout classNames={['fullwidth','key-profile']} title={ data.datoCmsKey.name }
            description={`${ data.datoCmsKey.name } (${ data.datoCmsKey.pronouns }) is a ${ data.datoCmsKey.discipline }, and a member of Ring of Keys.`}>
            <section className='artist_hero'
                style={{ '--grad-rot': Math.random()*360+'deg', '--grad-col-1': `var(--rok-${colors[Math.floor(Math.random()*colors.length)]}_hex)` }}>
                <div className='avatar'>
                { !isEditable
                    ? <img src={ heroFields.headshot.data.url } alt={ heroFields.headshot.data.title } className='headshot' />
                    : (<div className='headshot_group'>
                        <img src={ heroFields.headshot.data.url } alt={ heroFields.headshot.data.title } className='headshot' />
                        <button className='btn_edit edit_headshot' onClick={() => heroFields.headshot.setEditing(true)}>
                            <img src={ profileIcons.camera } className='icon_edit' alt={`edit headshot`} />
                            <span className='tooltip'>Change Profile Photo</span>
                        </button>
                    </div>)
                }</div>
                <div className='artist_bio'>
                    <h1>{ infoFields[0].data }</h1>
                    { infoFields[2].data && <p>Based in {infoFields[2].data.replace(', ', ' • ')}</p> }
                    <p>{ infoFields[1].data }{ data.datoCmsKey.memberSince ? ` • Member Since ${ data.datoCmsKey.memberSince }` : '' }</p>
                    <button className='btn btn_message' onClick={ () => setMessageOpen(true) }>Message</button>
                </div>
                <div className='artist_social-icons'>
                    { !isEditable
                        ? ( heroFields.socialMedia.data && (<>
                            {heroFields.socialMedia.data.map(socialObj => {
                                const mediaPlatform = Object.keys(socialIcons).filter((key) => socialObj.socialMediaLink.includes(key))[0]
                                return (
                                <a href={socialObj.socialMediaLink} rel='noopener noreferrer' target='_blank' className='social-icon' key={mediaPlatform}>
                                    <img src={ socialIcons[mediaPlatform] } alt={`${mediaPlatform}`} />
                                </a>
                                )}
                            )}
                        </>))
                        : (<>
                            { Object.keys(socialIcons).map(key => {
                                const hasLink = heroFields.socialMedia.data.find(socialObj => socialObj.socialMediaLink.includes(key))
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
                        </>)
                    }
                </div>
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
                    <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                    <label className='toggle_group' htmlFor='profile-edit-toggle'>
                        <input id='profile-edit-toggle' type='checkbox' className='visually-hidden' checked={isEditable} onChange={() => setEditable(!isEditable)}/>
                        <span className='toggle'></span>
                        <span className='toggle_label'>Toggle Editing View</span>
                    </label>
                    { (isEditable && Object.keys(editedFields).length > 0) &&
                        <button onClick={ handleProfileSave }
                        className={`btn ${isSubmitting ? 'submitting' : ''} ${hasSubmitted ? 'success': ''}`}>
                            { hasSubmitted ? 'Profile Saved' : 'Save Profile Edits'}
                        </button>
                    }
                    </div>
                }
                { (bioField.data || isEditable) &&
                    <Body.BioField userId={data.datoCmsKey.id} field={ bioField } editorState={{ isEditable, isSubmitting, setSubmitting, setSubmitted }} />
                }
                { infoFields.map((field, i) => <Body.BasicInfoField field={ field } index={ i }  userId={ data.datoCmsKey.id } key={`basic-info-${ i }`}  editorState={ editorState }/>) } 
                { bodyFields.map((field, i) => <Body.BodyInfoField field={ field } index={ i } userId={ data.datoCmsKey.id } key={`body-field-${ i }`} editorState={ editorState }/>) }
                { (resumeField.data || isEditable) 
                    && <Body.ResumeField field={ resumeField } userId={ data.datoCmsKey.id } editorState={ editorState } />
                }
                { (isEditable && Object.keys(editedFields).length > 0) &&
                    <button onClick={ handleProfileSave }
                    className={`btn ${isSubmitting ? 'submitting' : ''} ${hasSubmitted ? 'success': ''}`}>
                        { hasSubmitted ? 'Profile Saved' : 'Save Profile Edits'}
                    </button>
                }
            </section>
        </Layout>
        { hasSubmitted && 
            <PreviewMessage />
        }
        <MessagePopup isOpen={ isMessageOpen } artistId={ data.datoCmsKey.id } artistName={ data.datoCmsKey.name } onClose={ () => setMessageOpen(false) } />
        { heroFields.headshot.isEditing && 
            <Hero.HeroHeadshotImageEditor userId={ data.datoCmsKey.id } field={ heroFields.headshot } editorState={ editorState } />
        }
        { heroFields.featuredImage.isEditing && 
            <Hero.HeroFeaturedImageEditor userId={ data.datoCmsKey.id } field={ heroFields.featuredImage } editorState={ editorState } />
        }
        { heroFields.socialMedia.isEditing && 
            <Hero.HeroSocialMediaEditor userId={ data.datoCmsKey.id } field={ heroFields.socialMedia } editorState={ editorState } />
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

function getHeroFields() {
    return {
        headshot: { fieldName: 'headshot', type: 'image'},
        featuredImage: { fieldName: 'featuredImage', type: 'image'},
        socialMedia: { fieldName: 'socialMedia', },
    }
}

function getInfoFields(locations) {
    return [
        {label: 'Name', fieldName: 'name', type: 'text',},
        {label: 'Pronouns', fieldName: 'pronouns', type: 'text',
         infoText: `When a person shares their pronouns, they are naming the pronouns that they want to be referred to by in the singular third person (when referring to that person while talking to someone else`},
        {label: 'Where are you based?', fieldName: 'mainLocation', type: 'text'},
        {label: 'Regions', helpText: '(These control your search page listing)', refArray: locationLabels(), fieldName: 'locations', type: 'checkbox',
        initialVals: locationLabels().map(label => locations.includes(label)),
        initialOther: getInitialOther(locations, locationLabels(), '| '), joinChar: '| ',
        },
    ]
}

function getBodyFields(affiliations) {
    return [
        {label: 'Sexual Orientation', fieldName: 'sexualIdentity', type: 'text',
         infoText: `Sexual orientation describes a person's enduring physical, romantic, and/or emotional attraction to another person `, },
        {label: 'Gender Identity', fieldName: 'genderIdentity', type: 'text',
         infoText: `One’s internal, deeply held sense of gender. Some people identify completely with the gender they were assigned at birth (usually male or female), while others may identify with only a part of that gender, or not at all. Some people identify with another gender entirely. Unlike gender expression, gender identity is not visible to others.`},
        {label: 'Discipline', fieldName: 'discipline', type: 'text',},
        {label: 'Vocal Range', fieldName: 'vocalRange', type: 'text',},
        {label: 'Dance Experience', fieldName: 'danceExperience', type: 'text',},
        {label: 'Unions & Affiliations', helpText: '(check as many as apply)', refArray: affiliationLabels(), fieldName: 'affiliations', type: 'checkbox',
        initialVals: affiliationLabels().map(label => affiliations.includes(label)),
        initialOther: getInitialOther(affiliations, affiliationLabels(), ', '), joinChar: ', '
        },
        {label:'Website', fieldName: 'website', },
    ]
}

function locationLabels() {
    return [
        "New York City", "Chicago", "Los Angeles", "Philadelphia", "San Francisco / Oakland", "Minneapolis / St. Paul", "Denver",
        "Boulder", "Orlando", "Sarasota", "Louisville", "Baltimore", "Boston", "St. Louis", "Las Vegas", "Raleigh", "Cleveland",
        "Ashland", "Portland, OR", "Pittsburgh", "Austin", "Salt Lake City", "Washington DC", "Seattle", "Toronto", "Ontario",
        "London",
    ].sort()
}

function affiliationLabels() {
    return [
        "AEA", "AFM", "AGMA", "AGVA", "ASCAP", "BMI", "CSA", "EMC", "IATSE",  "LMDA", "SAFD", "SAG/AFTRA", "SDC", "USA", "Non-union",
    ].sort()
}

function getInitialOther(string, valArray, splitStr) {
    const filteredOther = string.split(splitStr).filter(val => valArray.indexOf(val) < 0)
    return filteredOther ? filteredOther[0] : ''
}
