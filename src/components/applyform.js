import React, { useState } from 'react';
import { useFormik } from 'formik';
import slugify from '../utils/slugify'
import { Field } from './formfields'
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


  const [results, setResults] = useState(undefined)
  const [isLoading, setLoading] = useState(false)

  const initialValues = {
      name: '',
      email: '',
      discipline: '',
      locations: [...locations.map(c => false)],
      locationsOther: '',
      affiliations: [...affiliations.map(a => false)],
      affiliationsOther: '',
      pronouns: '',
      genderIdentity: '',
      sexualIdentity: '',
      website: '',
      headshot: '',
      resume: '',
      whyRok: '',
      referral: '',
  }

  const formik = useFormik({
    initialValues,
    onSubmit: values => {
        setFormStatus('sending')

        const arrayFields = [
          {ref:locations,name:'locations'},
          {ref:affiliations,name:'affiliations'},
        ]

        arrayFields.forEach(field => {
          values[field.name] = [...field.ref.filter((c, i) => values[field.name][i])].join(', ')
          if (values[field.name+'Other']) { values[field.name] += ', '+values[field.name+'Other'] }
        })
        const filteredValues = {}
        Object.keys(values).filter(key => !key.includes('Other') && values[key]).forEach(key => { filteredValues[key] = values[key] })

        setLoading(true)
        submitApplication(filteredValues).then(res => {
          if (res.status === 200) {
            setFormStatus('success')
            sendTxtMsg(formik.values.name)
            sendAdminEmail(filteredValues)
          } else {
            setFormStatus('failure')
          }
        })
      },
  });

  // useEffect(() => console.log(formik.values))

  return (
    <form onSubmit={formik.handleSubmit} className='apply__form'>
        <h2>Tell us about yourself</h2>
        <div className='basic_info'>
          <Field type='text' name='name' label='Name' required={true}
            change={formik.handleChange} value={formik.values.name} 
            placeholder='First Last'/>
          <Field type='email' name='email' label='Email Address' required={true}
            change={formik.handleChange} value={formik.values.email} 
            placeholder='Email Address'/>
          <Field type='text' name='discipline' label='Discipline' required={true}
            change={formik.handleChange} value={formik.values.discipline}
            placeholder='ie: Actor, Stage Manager, Music Director'/>
        </div>
        <h3>Region (check as many that apply):</h3>
        <div className='checkbox__grid'>
          {locations.map((city,i) => (<Field type='checkbox' name={`locations[${i}]`} label={locations[i]} change={formik.handleChange} value={formik.values.locations[i]} key={locations[i]} />))}
          <Field type='text' name='locationsOther' change={formik.handleChange} label='Other' value={formik.values.locationsOther} />
        </div>
        <h3>Unions & Affiliations (check as many that apply) [optional]:</h3>
        <div className='checkbox__grid'>
          {affiliations.map((aff,i) => (<Field type='checkbox' name={`affiliations[${i}]`} label={affiliations[i]} change={formik.handleChange} value={formik.values.affiliations[i]}/>))}
          <Field type='text' name='affiliationsOther' change={formik.handleChange} label='Other' value={formik.values.affiliationsOther} />
        </div>
        <div className='divider'></div>
        <h2>How do you identify?</h2>
        <div className='grid_2c-2r' style={{alignItems: 'flex-start', gap: '2em 1em'}}>
          <Field type='text' name='pronouns' label='Pronouns' required={true}
              change={formik.handleChange} value={formik.values.pronouns}
              placeholder='ie They / Them or She / Her'/>
          <Field type='text' name='genderIdentity' change={formik.handleChange} required={true}
            label='Gender Identity' value={formik.values.genderIdentity}
            placeholder='ie: Non-Binary, Cis, Gender Fluid'/>
          <Field type='text' name='sexualIdentity' change={formik.handleChange} required={true}
            label='Sexual Orientation' value={formik.values.sexualIdentity}
            placeholder='ie: Bisexual, Queer, Lesbian'/>
        </div>
        <div className='divider'></div>
        <h2>Just a little bit more...</h2>
        <Field type='text' name='website' label='Website URL [optional]' change={formik.handleChange} value={formik.values.website} />
        <div className='grid_2c-1r'>
          <Field type='file' name='headshot' label='Upload your headshot or picture'
            change={event => {
              formik.setFieldValue("headshot", event.currentTarget.files[0]);
            }} value={formik.values.headshot ? formik.values.headshot.fileName : ''}/>
          <Field type='file' name='resume' label='Upload your Resumé [optional]'
            change={event => {
              formik.setFieldValue("resume", event.currentTarget.files[0]);
            }} value={formik.values.resume ? formik.values.resume.fileName : ''}/>
        </div>
        <div className='grid_2c-1r'>
          <Field type='textarea' name='whyRok' label='Why do you want to be a Key?' required={true}
            change={formik.handleChange} value={formik.values.whyRok} />
          <Field type='textarea' name='referral' label='How did you learn about Ring of Keys?' required={true}
            change={formik.handleChange} value={formik.values.referral} />
        </div>
        <label className='privacy-consent'>
            <input type='checkbox' required />
            I agree with the&nbsp;<a href='/privacy' target='_blank' rel='noopener noreferrer'>Privacy Policy</a>&nbsp;and Terms of Use
        </label>
        <button type='submit' className={`btn bg_slate ${ formStatus }`} 
          disabled={ formStatus === 'sending' || formStatus === 'success'} style={{ padding: '.75em 3em', margin: '2em 0'}}>
            { formLabels[formStatus] }
        </button>
    </form>
  );
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


async function uploadFile(file) {
  const signedUrlsRes = await fetch('/.netlify/functions/createDatoImgUrl', {
      method: 'POST',
      body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
      }),
  }).catch(err => console.err(JSON.parse(err)))

  const datoUrlRes = await signedUrlsRes.json()

  console.log('datorUrlRes = ', datoUrlRes)

  const fileArray = await readFile(file)

  console.log('fileArray = ', fileArray)

  const uploadRes = await fetch(datoUrlRes.url, {
      method: 'PUT',
      headers: {
          'Content-Type': file.type,
      },
      body: fileArray,
  }).catch(err => console.err(err))

  // console.log('uploadRes = ', uploadRes)

  return [datoUrlRes, uploadRes]
}


function readFile(file) {
  const fr = new FileReader()

  return new Promise((resolve, reject) => {
    fr.onerror = () => {
      fr.abort();
      reject(new DOMException("Problem parsing input file."));
    };

    fr.onload = async () => {
      resolve(fr.result);
    };
    fr.readAsArrayBuffer(file);
  });
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