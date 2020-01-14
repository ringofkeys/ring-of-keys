import React, { useState } from 'react';
import { useFormik } from 'formik';
import slugify from '../utils/slugify'
import { Field } from './formfields'
let locations = [
  "Chicago", "Los Angeles", "Philadelphia", "Northern California", "Minneapolis / St. Paul", "Colorado", "Florida",
  "Washington, D.C. / Baltimore", "Seattle", "Oregon", "Boston", "New York City", "Louisville", "St. Louis", "Las Vegas", "Austin",
  "Salt Lake City", "Toronto", "London",
]
locations = locations.sort()
let affiliations = [
  'AEA', 'EMC', 'SAG / AFTRA', 'BMI', 'ASCAP', 'SDC (Society of Stage Directors and Choreographers)', 'Non-Union',
  'CSA (Casting Society of America)', 'AGMA', 'AGVA', 'SAFD (Society of American Fight Directors)', 'LMDA (Literary Managers and Dramaturgs of the Americas!)',
  'AFM (American Federation Of Musicians)',
]
affiliations = affiliations.sort()
let pronouns = [
  'She/Her', 'He/Him', 'They/Them', 'Ze/Hir', 'Ze/Zir', 'Xe/Xir'
]

const ApplyForm = () => {
  const [results, setResults] = useState(undefined)

  const initialValues = {
      name: '',
      email: '',
      discipline: '',
      locations: [...locations.map(c => false)],
      locationsOther: '',
      affiliations: [...affiliations.map(a => false)],
      affiliationsOther: '',
      pronouns: [...pronouns.map(p => false)],
      pronounsOther: '',
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
        const arrayFields = [
          {ref:locations,name:'locations'},
          {ref:affiliations,name:'affiliations'},
          {ref:pronouns,name:'pronouns'}]

        arrayFields.forEach(field => {
          values[field.name] = [...field.ref.filter((c, i) => values[field.name][i])].join(', ')
          if (values[field.name+'Other']) { values[field.name] += ', '+values[field.name+'Other'] }
        })
        const filteredValues = {}
        Object.keys(values).filter(key => !key.includes('Other') && values[key]).forEach(key => { filteredValues[key] = values[key] })

        submitApplication(filteredValues).then(user => setResults(user))
      },
  });

  // useEffect(() => console.log(formik.values))

  return (
    <form onSubmit={formik.handleSubmit} className='apply__form'>
        <h2>Tell us about yourself</h2>
        <div className='basic_info'>
          <Field type='text' name='name' label='Name' required={true}
            change={formik.handleChange} value={formik.values.name} />
          <Field type='email' name='email' label='Email' required={true}
            change={formik.handleChange} value={formik.values.email} />
          <Field type='text' name='discipline' label='Discipline' required={true}
            change={formik.handleChange} value={formik.values.discipline}
            placeholder='ex. "Actor / Singer / Dramaturg"'/>
        </div>
        <h3>Locations you work in</h3>
        <div className='checkbox__grid'>
          {locations.map((city,i) => (<Field type='checkbox' name={`locations[${i}]`} label={locations[i]} change={formik.handleChange} value={formik.values.locations[i]} key={locations[i]} />))}
          <Field type='text' name='locationsOther' change={formik.handleChange} label='Other' value={formik.values.locationsOther} />
        </div>
        <h3>Union affiliations</h3>
        <div className='checkbox__grid'>
          {affiliations.map((aff,i) => (<Field type='checkbox' name={`affiliations[${i}]`} label={affiliations[i]} change={formik.handleChange} value={formik.values.affiliations[i]}/>))}
          <Field type='text' name='affiliationsOther' change={formik.handleChange} label='Other' value={formik.values.affiliationsOther} />
        </div>
        <div className='divider'></div>
        <h2>How do you identify?</h2>
        <div className='grid_2c-2r' style={{alignItems: 'flex-start'}}>
          <div className='checkbox__grid' style={{gridTemplateColumns: '1fr 1fr'}}>
            {pronouns.map((aff,i) => (<Field type='checkbox' name={`pronouns[${i}]`} label={pronouns[i]} change={formik.handleChange} value={formik.values.pronouns[i]}/>))}
            <Field type='text' name='pronounsOther' change={formik.handleChange} label='Other' value={formik.values.pronounsOther} />
          </div>
          <Field type='text' name='genderIdentity' change={formik.handleChange} required={true}
            label='Gender Identity' value={formik.values.genderIdentity}
            placeholder='ex. "Transgender masc" or "Non-binary"'/>
          <Field type='text' name='sexualIdentity' change={formik.handleChange} required={true}
            label='Sexual Identity' value={formik.values.sexualIdentity}
            placeholder='ex. "lesbian", "pansexual", "queer"'/>
        </div>
        <div className='divider'></div>
        <h2>Just a little bit more...</h2>
        <Field type='text' name='website' label='Website URL' change={formik.handleChange} value={formik.values.website} />
        <div className='grid_2c-1r'>
          <Field type='file' name='headshot' label='Upload your headshot'
            change={event => {
              formik.setFieldValue("headshot", event.currentTarget.files[0]);
<<<<<<< HEAD
            }} value={typeof formik.values.headshot === 'object' ? formik.values.headshot.fileName : ''}/>
          <Field type='file' name='resume' label='Upload your Resumé'
            change={event => {
              formik.setFieldValue("resume", event.currentTarget.files[0]);
            }} value={typeof formik.values.resume === 'object' ? formik.values.resume.fileName : ''}/>
=======
            }} value={formik.values.headshot.fileName}/>
          <Field type='file' name='resume' label='Upload your Resumé'
            change={event => {
              formik.setFieldValue("resume", event.currentTarget.files[0]);
            }} value={formik.values.resume.fileName}/>
>>>>>>> 2f541aa4eb1ebc0c91649fa642f0a13b892b290c
        </div>
        <div className='grid_2c-1r'>
          <Field type='textarea' name='whyRok' label='Why do you want to be a Key?' required={true}
            change={formik.handleChange} value={formik.values.whyRok} />
          <Field type='textarea' name='referral' label='How did you learn about Ring of Keys?' required={true}
            change={formik.handleChange} value={formik.values.referral} />
        </div>
        <button type="submit" className='btn has-arrow bg_slate'>Submit</button>
        {!!results && JSON.stringify(results, null, 2)}
    </form>
  );
};
export default ApplyForm


async function submitApplication(data) {
  const newUser = {
      ...data,
      slug: slugify(data.name),
  }

  const headshotRes = await uploadFile(data.headshot)
  let resumeUrl = ''
  if (data.resume) {
    resumeUrl = await uploadFile(data.resume)
  }

  newUser.headshot = headshotRes[0].id
  newUser.resume = resumeUrl.url

  console.log('newUser = ', newUser)

  const newUserRes = await fetch('/.netlify/functions/createDatoUser', {
      method: 'POST',
      body: JSON.stringify(newUser)
  })

  return await newUserRes.json().catch(err => err)
}


async function uploadFile(file) {
  const signedUrlsRes = await fetch('/.netlify/functions/createDatoImgUrl', {
      method: 'POST',
      body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
      }),
  })

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

  console.log('uploadRes = ', uploadRes)

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