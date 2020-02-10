import React from 'react'
import { Link, graphql } from 'gatsby'
import { Router } from '@reach/router'
import { login, isAuthenticated, getProfile } from '../../utils/auth.js'
import Layout from '../../components/layout'
import ROKMosaic_Dashboard from '../../images/ROKMosaic_Dashboard.jpg'
import Dashboard_Mobile from '../../images/Dashboard_Mobile.jpg'
import './dashboard.css'
import RoKBadge_Print from '../../images/RoKBadge_Print.jpg'
import RoKBadge_Web from '../../images/RoKBadge_Web.png'
import { node } from 'prop-types'

const homeDir = '/dashboard'

const Events = ({ user }) => <h1>Events</h1>
const Home = ({ user, messages }) => (<>
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
    <div className='block block_messages'>
      <h2>Messages</h2>
      { (messages.length > 0)
      ? messages.map(message => (
        <div className='message'>
          <h3>From: { message.fromName }</h3>
          <a href={`mailto:${ message.fromEmail }`}>{ message.fromEmail }</a>
          <p>{ message.message }</p>
        </div>
      ))
      : <p>No messages yet!</p>
      }
    </div>
    <div className='block block_badge'>
      <h2>Ring of Keys Badge</h2>
      <p>
        Click to download your Ring of Keys badge for both web (optimized to use on your 
        website or digital resume) and print (optimized to be printed at 1.5” square on your paper resume or print materials).
      </p>
      <img src={ RoKBadge_Web } alt='Ring of Keys Badge for web' />
      <div className='divider'></div>
      <div className='section_btns'>
        <a href='./static/RoKBadge_Web.png' className='btn btn-link_ghost bg_copper' download>For Web</a>
        <a href='./static/RoKBadge_Print.jpg' className='btn' download>For Print</a>
      </div>
    </div>
    <div className='block flex-center'>
      <h2>More features coming soon!</h2>
      <p>Email <a href='mailto:info@ringofkeys.org'>info@ringofkeys.org</a> if you have any feedback, questions, or concerns!</p>
    </div>
</>)

const Dashboard = ({ data }) => {
    if (!isAuthenticated()) {
        login()

        return <Layout>
          <p>Redirecting to login...</p>
        </Layout>
    }

    let userProfile = getProfile()

    if (!userProfile) {
      login()
      userProfile = getProfile()
    }

    console.log('userProfile = ', userProfile)

    let user = data.allDatoCmsKey.edges.filter(({node}) => node.name === userProfile.name)
    let messages = data.allDatoCmsMessage.edges.filter(({node}) => node.toArtist.name === userProfile.name)

    if (user) {
      user = user[0].node
      messages = messages.map(({ node }) => node)
    }

    return (
    <Layout classNames={['dashboard', 'fullwidth']}
      title={`Dashboard - ${ user.name }`} description='User dashboard for your Ring of Keys profile'>
        <div className='dashboard_container'>
          <Router>
              <Home path={homeDir} user={ user } messages={ messages }/>
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
  allDatoCmsMessage {
    edges {
      node {
        fromEmail
        fromName
        message
        toArtist {
          name
        }
      }
    }
  }
}
`
