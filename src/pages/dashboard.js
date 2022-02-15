import { useSession } from 'next-auth/react'
import Layout from "components/Layout"

export default function Dashboard() {
    const { data: session } = useSession()
    // TODO: Add Auth0 user_metadata to returned session data so that we can fetch their user info.

    return <Layout>
        <h1>Dashboard</h1>
        <pre>
            { JSON.stringify(session, null, 2) } 
        </pre>
    </Layout>
}