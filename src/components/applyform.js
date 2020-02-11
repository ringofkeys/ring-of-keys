import React, { useState } from 'react';
import { Link } from 'gatsby'
import { Field } from './formfields'
import Popup from './popup'
import slugify from '../utils/slugify'
import { uploadFile } from '../utils/datoUploads'
let locations = [
  "New York City", "Chicago", "Los Angeles", "Philadelphia", "San Francisco / Oakland", "Minneapolis / St. Paul", "Denver",
  "Boulder", "Orlando", "Sarasota", "Louisville", "Baltimore", "Boston", "St. Louis", "Las Vegas", "Raleigh", "Cleveland",
  "Ashland", "Portland, OR", "Pittsburgh", "Austin", "Salt Lake City", "Washington, D.C.", "Seattle", "Toronto", "Ontario",
  "London",
]
locations = locations.sort()
let affiliations = [
  "AEA", "AFM", "AGMA", "AGVA", "ASCAP", "BMI", "CSA", "EMC", "IATSE",  "LMDA", "SAFD", "SAG/AFTRA", "SDC", "USA", "Non-union",
]
affiliations = affiliations.sort()

const ApplyForm = () => {
  const [formStatus, setFormStatus] = useState('unsent')
  const formLabels = {
      sending: 'Loading...',
      unsent: 'Submit',
      success: 'Sent!',
      failure: 'Please Try Again Later',
  }

  const [isPopupOpen, setPopupOpen] = useState(false)

  function handleSubmit(e) {
      e.preventDefault()
      setFormStatus('sending')

      const formEls = ([]).slice.call(e.target.elements)
      const formData = {}

      const arrayFields = [{ref:locations, name:'locations'}, {ref:affiliations, name:'affiliations'}]

      // gather up all checkbox fields into arrays
      arrayFields.forEach(field => {
        formData[field.name] = formEls.filter(el => el.name.includes(field.name) && (el.value || el.checked)).map((el, i) => {
          if (el.checked) return field.ref[i]
          else if (el.value) return el.value
        }).join(', ')
      })

      // save the rest of the formdata
      formEls.filter(el => el.name && !arrayFields.some(field => el.name.includes(field.name)) && (el.value || el.checked || el.files))
        .forEach(el => {
          if (el.files) {
            formData[el.name] = el.files[0]
          } else {
            formData[el.name] = el.value
          }
        })

      if (formData.website && !formData.website.startsWith('https://')) {
        formData.website = 'https://' + formData.website
      }

      console.log('formData = ', formData)

      submitApplication(formData).then(res => {
        console.log('createDatoUser response = ', res)

        if (res.status === 200) {
          setFormStatus('success')
          setPopupOpen(true)
          sendTxtMsg(formData.name)
          sendAdminEmail(formData)
        } else {
          setFormStatus('failure')
        }
      }).catch(err => {
        console.error(err)
        setFormStatus('failure')
      })
  }

  return (<>
    <form onSubmit={ handleSubmit } className='apply__form'>
        <h2>Tell us about yourself</h2>
        <div className='basic_info'>
          <Field type='text' name='name' label='Full Name' required={true} placeholder='First Last'/>
          <Field type='email' name='email' label='Email Address' required={true} placeholder='Email Address'/>
          <Field type='text' name='discipline' label='Discipline' required={true} placeholder='ie: Actor, Stage Manager, Music Director'/>
          <Field type='text' name='vocalRange' label='Vocal Range [optional]' placeholder='ie: Soprano, Tenor'/>
          <Field type='text' name='danceExperience' label='Dance Experience [optional]' placeholder='ie: Ballet, Tap, Jazz'/>
        </div>
        <div className='locations'>
          <label>
              <span>Region</span>
              <span className='help_text'>&nbsp;(check as many that apply):</span>
              <input className='visually-hidden' type='checkbox'
              onChange={e => {
                  e.target.nextSibling.classList.toggle('collapsed');
                  ([]).slice.call(e.target.parentElement.parentElement.children).forEach(el => el.classList.toggle('collapsed'))
              }} />
              <svg className='collapse_icon' viewBox='0 0 10 10'>
                  <path d='M 5.5 1 l 0 9' stroke='var(--rok-slate-blue_hex)' />
                  <path d='M 1 5 l 9 0' stroke='var(--rok-slate-blue_hex)' />
              </svg>
          </label>
          <p className='help_text collapsed'>(check as many that apply):</p>
          <div className='checkbox__grid collapsed'>
            {locations.map((city,i) => (<Field type='checkbox' name={`locations[${i}]`} label={locations[i]} key={locations[i]} />))}
            <Field type='text' name='locationsOther' label='Other' />
          </div>
        </div>
        <div className='affiliations'>
        <label>
              <span>Unions & Affiliations [optional]</span>
              <span className='help_text'>&nbsp;(check as many that apply):</span>
              <input className='visually-hidden' type='checkbox'
              onChange={e => {
                  e.target.nextSibling.classList.toggle('collapsed');
                  ([]).slice.call(e.target.parentElement.parentElement.children).forEach(el => el.classList.toggle('collapsed'))
              }} />
              <svg className='collapse_icon' viewBox='0 0 10 10'>
                  <path d='M 5.5 1 l 0 9' stroke='var(--rok-slate-blue_hex)' />
                  <path d='M 1 5 l 9 0' stroke='var(--rok-slate-blue_hex)' />
              </svg>
          </label>
          <p className='help_text collapsed'>(check as many that apply):</p>
          <div className='checkbox__grid collapsed'>
            {affiliations.map((aff,i) => (<Field type='checkbox' name={`affiliations[${i}]`} label={affiliations[i]} key={affiliations[i]} />))}
            <Field type='text' name='affiliationsOther' label='Other' />
          </div>
        </div>
        <div className='divider'></div>
        <h2>How do you identify?</h2>
        <div className='grid_2c-2r' style={{alignItems: 'flex-start', gap: '2em 1em'}}>
          <Field type='text' name='pronouns' label='Pronouns' required={true}
              placeholder='ie: They / Them or She / Her'/>
          <Field type='text' name='genderIdentity' label='Gender Identity' required={true} placeholder='ie: Non-Binary, Cis, Gender Fluid'/>
          <Field type='text' name='sexualIdentity' label='Sexual Orientation' required={true} placeholder='ie: Bisexual, Queer, Lesbian'/>
        </div>
        <div className='divider'></div>
        <h2>Just a little bit more...</h2>
        <Field type='text' name='website' label='Website URL [optional]' />
        <div className='grid_2c-1r'>
          <Field type='file' name='headshot' required={true} label='Upload your headshot or picture' accept='image/*' />
          <Field type='file' name='resume' label='Upload your Resumé [optional]' accept='.pdf,.doc,.docx' />
        </div>
        <div className='grid_2c-1r'>
          <Field type='textarea' name='whyRok' label='Why do you want to be a Key?' required={true} />
          <Field type='textarea' name='referral' label='How did you learn about Ring of Keys?' required={true} />
        </div>
        <label className='privacy-consent input__group checkbox'>
            <input type='checkbox' required />
            <span>
              I agree to the&nbsp;<Link to='/privacy' target='_blank' rel='noopener noreferrer'>Privacy Policy and Terms of Use.</Link>
            </span>
        </label>
        <button type='submit' className={`btn bg_slate ${ formStatus }`} 
          disabled={ formStatus === 'sending' || formStatus === 'success'} style={{ padding: '.75em 3em', margin: '2em 0'}}>
            { formLabels[formStatus] }
        </button>
    </form>
    <Popup isOpen={isPopupOpen} onClose={() => setPopupOpen(false)} >
        <h2>Thank You</h2>
        <p>for your submission</p>
        <div className='divider'></div>
        <p>
          You will receive an email soon alerting you of your acceptance to be a Key! Please add info@ringofkeys.org to 
          your contacts. Once accepted, you will be able to customize your Key profile. <br/>We look forward to queering the 
          stage with you.
        </p>
    </Popup>
  </>);
};
export default ApplyForm


async function submitApplication(data) {
  const newUser = {
      slug: slugify(data.name),
  }
  Object.keys(data).forEach(key => {

    //TODO: SEND THESE FIELDS OFF TO THE ADMIN IN AN EMAIL
    if (key !== 'whyRok' && key !== 'referral') {
      newUser[key] = data[key]
    }
  })

  const headshotRes = await uploadFile(newUser.headshot)
  newUser.headshot = headshotRes[0].id  

  let resumeRes = ''
  if (newUser.resume) {
    resumeRes = await uploadFile(newUser.resume)
    newUser.resume = resumeRes[0].id
  }

  console.log('newUser = ', JSON.stringify(newUser))

  return await fetch('/.netlify/functions/createDatoUser', {
      method: 'POST',
      body: JSON.stringify(newUser)
  }).catch(err => console.error(err))
}

async function sendTxtMsg(name) {
  const txtMsgRes = await fetch('/.netlify/functions/newUserTxtMessage', {
      method: 'POST',
      body: JSON.stringify({
          name
      }),
  }).catch(err => console.error(err))

  console.log('Twilio response: ', txtMsgRes)
}

async function sendAdminEmail(userData) {
  const emailRes = await fetch('/.netlify/functions/newUserEmail', {
      method: 'POST',
      body: JSON.stringify(userData),
  }).catch(err => console.error(err))

  console.log('SendGrid response: ', emailRes)
}