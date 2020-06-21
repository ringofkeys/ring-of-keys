import React, { useState, useEffect } from 'react'
// import Img from 'gatsby-image'
import { graphql, Link } from 'gatsby'
import Layout from '../components/layout'
import MessagePopup from '../components/messagepopup'
import FieldEditForm from '../components/FieldEditForm'
import BasicInfoField from '../components/BasicInfoField'
import BodyInfoField from '../components/BodyInfoField'
import ResumeField from '../components/ResumeField'
import { getProfile, isAuthenticated } from "../utils/auth"
import './key.css'
import socialIcons from '../images/social-icons/socialIcons.js'
import profileIcons from '../images/profile-icons/profileIcons.js'
import EmailPopup from '../components/emailpopup'
import HeroFeaturedImageEditor from '../components/HeroFeaturedImageEditor'
import HeroHeadshotImageEditor from '../components/HeroHeadshotImageEditor'
import PreviewMessage from '../components/PreviewMessage'
import HeroSocialMediaEditor from '../components/HeroSocialMediaEditor'
const urlRegExpStr = '^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$'

const colors = ['slate-blue', 'peach-1', 'copper-1', 'gold-1', 'pale-green-1']

export default ({ data }) => { 
    const { name,
            id,
            pronouns,
            socialMedia,
            headshot,
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

    const applyDatoField = (field) => {
        field.data = data.datoCmsKey[field.fieldName]
        return field
    }

    const heroFields = getHeroFields()
    Object.keys(heroFields).forEach(key => { heroFields[key].data = data.datoCmsKey[heroFields[key].fieldName] })

    // on first load, make the URL the correct query. Only run once so as not to append with every state change.
    useEffect(() => {
        heroFields['headshot'].data.url += '?fit=facearea&faceindex=1&facepad=5&mask=ellipse&w=180&h=180&'
    }, [heroFields])
    
    Object.keys(heroFields).forEach(key => useFieldStates(heroFields[key]))

    const bioField = {label: 'Bio', data: bio, fieldName: 'bio',}
    useFieldStates(bioField)


    const bodyFields = getBodyFields(data.datoCmsKey.affiliations, data.datoCmsKey.locations).map(applyDatoField)

    bodyFields.forEach(useFieldStates)

    const resumeField = {label: 'Resume', data: resume, fieldName: 'resume',}
    useFieldStates(resumeField)

    const infoFields = getInfoFields(data.datoCmsKey.locations).map(applyDatoField)
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
                {/* TODO: Add a global submit button, remove individual submissions (except image upload fields) */}
            </section>
        </Layout>
        { hasSubmitted && 
            <PreviewMessage />
        }
        <MessagePopup isOpen={ isMessageOpen } artistId={ id } artistName={ data.datoCmsKey.name } onClose={ () => setMessageOpen(false) } />
        { heroFields.headshot.isEditing && 
            <HeroHeadshotImageEditor userId={ id } field={ heroFields.headshot } editorState={ { isSubmitting, setSubmitting, setSubmitted } } />
        }
        { heroFields.featuredImage.isEditing && 
            <HeroFeaturedImageEditor userId={ id } field={ heroFields.featuredImage } editorState={ { isSubmitting, setSubmitting, setSubmitted } } />
        }
        { heroFields.socialMedia.isEditing && 
            <HeroSocialMediaEditor userId={ id } field={ heroFields.socialMedia } editorState={ { isSubmitting, setSubmitting, setSubmitted } } />
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
        headshot: { fieldName: 'headshot', },
        featuredImage: { fieldName: 'featuredImage', },
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
        initialOther: getInitialOther(locations, locationLabels())
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
        initialOther: getInitialOther(affiliations, affiliationLabels())
        },
        {label:'Website', fieldName: 'website', },
    ]
}

function locationLabels() {
    return [
        "New York City", "Chicago", "Los Angeles", "Philadelphia", "San Francisco / Oakland", "Minneapolis / St. Paul", "Denver",
        "Boulder", "Orlando", "Sarasota", "Louisville", "Baltimore", "Boston", "St. Louis", "Las Vegas", "Raleigh", "Cleveland",
        "Ashland", "Portland, OR", "Pittsburgh", "Austin", "Salt Lake City", "Washington, D.C.", "Seattle", "Toronto", "Ontario",
        "London",
    ].sort()
}

function affiliationLabels() {
    return [
        "AEA", "AFM", "AGMA", "AGVA", "ASCAP", "BMI", "CSA", "EMC", "IATSE",  "LMDA", "SAFD", "SAG/AFTRA", "SDC", "USA", "Non-union",
    ].sort()
}

function getInitialOther(string, valArray) {
    // if (!locations) return ''
    const filteredOther = string.split(', ').filter(val => valArray.indexOf(val) < 0)
    return filteredOther ? filteredOther[0] : ''
}
