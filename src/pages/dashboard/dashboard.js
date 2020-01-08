import React from 'react'
// import { Link } from 'gatsby'
import { Router } from '@reach/router'
import { login, isAuthenticated, getProfile } from '../../utils/auth.js'
import Settings from './settings.js'
import Layout from '../../components/layout'

const homeDir = '/dashboard'

const Events = () => <h1>Events</h1>
const Home = () => <h1>Dashboard</h1>

const Dashboard = () => {
    if (!isAuthenticated()) {
        login()

        return <p>Redirecting to login...</p>
    }

    const user = getProfile()

    return (
    <Layout>
        <Router>
            <Home path={homeDir} />
            <Settings path={homeDir+'/settings'} user={user} />
            <Events path={homeDir+'/events'} />
        </Router>
    </Layout>
    )
}
export default Dashboard
