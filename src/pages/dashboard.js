import React, { useEffect, useState } from 'react'
import { graphql } from 'gatsby'
import { Router } from '@reach/router'
import { login, isAuthenticated, getProfile, silentAuth } from '../utils/auth.js'
import { decodeHtmlEntity } from '../utils/htmlEntity.js'
import Layout from '../components/layout'
import Home from '../components/dashboard/home'
import ROKMosaic_Dashboard from '../images/ROKMosaic_Dashboard.jpg'
import Dashboard_Mobile from '../images/Dashboard_Mobile.jpg'
import './dashboard.css'

const homeDir = '/dashboard'

const Dashboard = ({ data }) => {
    const [ user, setUser ] = useState(false)
    useEffect(() => {
      async function fetchUser(id) {
        const res = await getDatoProfile(id)
        setUser(res.data.key)
      }

      let auth0Profile = getProfile()
  
      if (!auth0Profile || !auth0Profile.name ||  !isAuthenticated) {
        login()
        return <p>Redirecting to login</p>
      }
  
      console.log({auth0Profile})
  
      if (auth0Profile.name) {
        auth0Profile.name = decodeHtmlEntity(auth0Profile.name)
      }
  
      localStorage.setItem('hasEmailSignup', 'true') // ensure logged-in users don't receive popups
    
      const datoId = auth0Profile["https://ringofkeys.org/user_metadata"].entity_id
      fetchUser(datoId)
    },[])


    return (
    <Layout classNames={['dashboard', 'fullwidth']}
      title={`Dashboard - ${ user.name }`} description='User dashboard for your Ring of Keys profile'>
        { user && <div className='dashboard_container'>
          {user && 
          <Router basepath={ homeDir }>
              <Home path='/' user={ user } />
          </Router>}
          { (window.innerWidth > 700)
            ? <img src={ ROKMosaic_Dashboard } alt='mosaic of dozens of RoK members' className='img_desktop'/>
            : <img src={ Dashboard_Mobile } alt='mosaic of dozens of RoK members' className='img_mobile'/>}
        </div>}
    </Layout>
    )
}
export default Dashboard

async function getDatoProfile(id) {
   return await fetch('https://graphql.datocms.com/',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${ process.env.GATSBY_DATO_READ_ONLY_TOKEN }`,
      },
      body: JSON.stringify({
        query: `{
          key(filter: {id: {eq: "${ id }"}}) {
              id
              name
              headshot {
                url
              }
              slug
              stripeId
              isBetaUser
          }
        }`
      }),
    }
  ).then(res => res.json())
  .catch((error) => {
    console.log(error);
  });
} 
