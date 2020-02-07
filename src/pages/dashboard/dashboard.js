import React from 'react'
import { Link, graphql } from 'gatsby'
import { Router } from '@reach/router'
import { login, isAuthenticated, getProfile } from '../../utils/auth.js'
import Layout from '../../components/layout'
import ROKMosaic_Dashboard from '../../images/ROKMosaic_Dashboard.jpg'
import './dashboard.css'

const homeDir = '/dashboard'

const Events = ({ user }) => <h1>Events</h1>
const Home = ({ user }) => (<>
    <h1>Dashboard</h1>
    <div className='block block_intro'>
      <div>
        <h2>{ user.name }</h2>
        <p>
          Welcome to the Key Member dashboard! Here you can find access to Members Only content like our Proud Member: 
          Ring of Keys badges to use on your website, resumé, or portfolio.
        </p>
        <Link to={ '/keys/' + user.slug } className='btn btn-link_ghost'>View / Edit Profile</Link>
      </div>
      <img src={ user.headshot.url+'?fit=facearea&faceindex=1&facepad=5&mask=ellipse&w=140&h=140&' } alt={ user.headshot.title } className='avatar' />
    </div>
    <div className='block flex-center'>
      <h2>More features coming soon!</h2>
      <p>Email <a href='mailto:info@ringofkeys.org'>info@ringofkeys.org</a> if you have any feedback, questions, or concerns!</p>
    </div>
</>)

const Dashboard = ({ data }) => {
    if (!isAuthenticated()) {
        login()

        return <p>Redirecting to login...</p>
    }

    let userProfile = getProfile()

    if (!userProfile) {
      login()
      userProfile = getProfile()
    }

    console.log('userProfile = ', userProfile)

    let user = data.allDatoCmsKey.edges.filter(({node}) => node.name === userProfile.name)
    if (user) {
      user = user[0].node
    }

    return (
    <Layout classNames={['dashboard', 'fullwidth']}>
        <div className='dashboard_container'>
          <Router>
              <Home path={homeDir} user={ user } />
              <Events path={homeDir+'/events'} user={ user } />
          </Router>
          <img src={ ROKMosaic_Dashboard } alt='mosaic of dozens of RoK members' />
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
