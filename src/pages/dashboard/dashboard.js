import React from 'react'
// import { Link } from 'gatsby'
import { Router } from '@reach/router'
import { login, isAuthenticated, getProfile } from '../../utils/auth.js'
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
        <pre>{JSON.stringify(user, null, 2)}</pre>
        <Router>
            <Home path={homeDir} />
            <Events path={homeDir+'/events'} />
        </Router>
    </Layout>
    )
}
export default Dashboard
