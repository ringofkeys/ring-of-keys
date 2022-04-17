import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import Link from "next/link"
import Layout from "components/Layout"
import { request } from "../lib/datocms"

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState(false)
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            signIn("auth0", { callbackUrl: "http://localhost:3000/dashboard" })
            return <Redirecting />
        },
    })

    useEffect(() => {
        if (session) {
            getDashboardContent(session.token.datoId).then((data) =>
                setDashboardData(data)
            )
        }
    }, [session])

    return (
        <Layout>
            <h1>Dashboard</h1>
            {dashboardData ? (
                <>
                    <div className="block block_intro">
                        <div>
                            <h2>{dashboardData.user.name}</h2>
                            <Link
                                href={"/keys/" + dashboardData.user.slug}
                                className="btn btn-link_ghost"
                            >
                                <a>View / Edit Profile</a>
                            </Link>
                            {/* {dashboardData.user.stripeId && <StripeSubscribed stripeId={dashboardData.user.stripeId} />} */}
                        </div>
                        {dashboardData.user.headshot && (
                            <img
                                src={
                                    dashboardData.user.headshot.url +
                                    "?fit=facearea&faceindex=1&facepad=5&mask=ellipse&w=140&h=140&"
                                }
                                alt={dashboardData.user.headshot.title}
                                className="avatar"
                            />
                        )}
                    </div>
                    {/* {!user.stripeId && <StripeUnsubscribed userId={user.id} />} */}
                    {/* <MessageBlock messages={messages} /> */}
                    <pre>{JSON.stringify(dashboardData.messages, null, 2)}</pre>
                    {dashboardData.page.content.map((block, i) => {
                        return (
                            <section
                                className={
                                    "block" +
                                    (block.area ? ` block_${block.area}` : "")
                                }
                                key={"block" + i}
                            >
                                {block.__typename ===
                                "DatoCmsDashboardBlock" ? (
                                    <>
                                        <h2>{block.blockTitle}</h2>
                                        {parse(block.content)}
                                    </>
                                ) : (
                                    <></>
                                    // <PageBlock {...block} />
                                )}
                            </section>
                        )
                    })}
                </>
            ) : (
                <Loading />
            )}
        </Layout>
    )
}

function Redirecting() {
    return <div>Redirecting to login...</div>
}

function Loading() {
    return <div>Loading dashboard content...</div>
}

async function getDashboardContent(datoId) {
    const DASHBOARD_QUERY = `
        query DASHBOARD($id: ItemId) {
            user: key(filter: { id: { eq: $id}}) {
                id
                name
                slug
                headshot {
                    url
                    title
                }
            }

            messages: allMessages(filter: { toArtist: { eq: $id }}, orderBy: _firstPublishedAt_DESC) {
                fromEmail
                fromName
                message
                toArtist {
                    name
                }
                _firstPublishedAt
            }

            page(filter: { id: { eq: "65961427" } }) {
                content {
                    ... on BasicBlockRecord {
                        area
                        content
                        id
                    }
                    
                    ... on DashboardBlockRecord {
                        blockTitle
                        content
                        area
                        id
                    }
                
                    ... on ShortcodeRecord {
                        id
                        name
                    }
                }
            }
        }`

    return await request({
        query: DASHBOARD_QUERY,
        variables: { id: datoId },
    })
}
