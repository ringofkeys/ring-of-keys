import React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import { Router } from '@reach/router'
import { login, isAuthenticated, getProfile } from '../../utils/auth.js'
import Layout from '../../components/layout'
import './dashboard.css'

const homeDir = '/dashboard'

const Events = ({ user }) => <h1>Events</h1>
const Home = ({ user }) => (<>
    <h1>Dashboard</h1>
    <div className='block_intro'>
        <h2>{ user.name }</h2>
        <img src={ user.headshot.url+'?fit=facearea&faceindex=1&facepad=5&mask=ellipse&w=140&h=140&' } alt={ user.headshot.title } className='avatar' />
        <Link to={ '/keys/' + user.slug }>View / Edit Profile</Link>
    </div>
</>)

const Dashboard = ({ data }) => {
    if (!isAuthenticated()) {
        login()

        return <p>Redirecting to login...</p>
    }

    const userProfile = getProfile()

    const user = data.allDatoCmsKey.edges.filter(({node}) => node.name === userProfile.name)[0].node

    return (
    <Layout classNames={['dashboard']}>
        {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
        <Router>
            <Home path={homeDir} user={ user } />
            <Events path={homeDir+'/events'} user={ user } />
        </Router>
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
