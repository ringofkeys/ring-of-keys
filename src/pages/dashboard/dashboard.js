import React from 'react'
import { graphql } from 'gatsby'
import { Router } from '@reach/router'
import { login, isAuthenticated, getProfile } from '../../utils/auth.js'
import Layout from '../../components/layout'
import Home from './home'
import ROKMosaic_Dashboard from '../../images/ROKMosaic_Dashboard.jpg'
import Dashboard_Mobile from '../../images/Dashboard_Mobile.jpg'
import './dashboard.css'

const homeDir = '/dashboard'

const Events = ({ user }) => <h1>Events</h1>

const Dashboard = ({ data }) => {
    let userProfile = getProfile()
    let user = data.allDatoCmsKey.edges.filter(({node}) => node.name === userProfile.name)


    if (!userProfile || !isAuthenticated() || !user.length || (user.length > 0 && !user[0].node)) {
      login()
      return <Layout>
        <p>Redirecting to login..</p>
      </Layout>
    } else {
      localStorage.setItem('hasEmailSignup', 'true')
      console.log('userProfile = ', userProfile)
      user = user[0].node
    }

    return (
    <Layout classNames={['dashboard', 'fullwidth']}
      title={`Dashboard - ${ user.name }`} description='User dashboard for your Ring of Keys profile'>
        <div className='dashboard_container'>
          <Router>
              <Home path={homeDir} user={ user } />
              <Events path={homeDir+'/events'} user={ user } />
          </Router>
          { (window.innerWidth > 700)
            ? <img src={ ROKMosaic_Dashboard } alt='mosaic of dozens of RoK members' className='img_desktop'/>
            : <img src={ Dashboard_Mobile } alt='mosaic of dozens of RoK members' className='img_mobile'/>}
        </div>
    </Layout>
    )
}
export default Dashboard

export const query = graphql`
query DashboardQuery {
  allDatoCmsKey{
    edges {
      node {
        name
        headshot {
          url
        }
        slug
      }
    }
  }
}
`
