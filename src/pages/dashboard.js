import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import Link from "next/link"
import Layout from "components/Layout"
import { request } from "../lib/datocms"
import styles from 'styles/dashboard.module.css'
import MessageBlock from "components/MessageBlock"

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState(false)
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            signIn("auth0", { callbackUrl: (process.env.NODE_ENV == "development") ? "http://localhost:3000/dashboard" : "https://nextjs-profile--ringofkeys.netlify.app/dashboard" })
            return <Redirecting />
        },
    })

    useEffect(() => {
        console.log({ session })

        if (session) {
            getDashboardContent(session.token.datoId).then((data) =>
                setDashboardData(data)
            )
        }
    }, [session])

    return (
        <Layout className={"fullwidth " + styles.dashboard}>
            <h1>Dashboard</h1>
            {dashboardData ? (
                <>
                    <div className={styles.block +' '+ styles.blockIntro}>
                        <div>
                            <h2>{dashboardData.user.name}</h2>
                            <p>Welcome to the Key Member dashboard! Here you can find access to Members Only content like our Proud Member: Ring of Keys badges to use on your website, resumé, or portfolio.</p>
                            <Link href={"/keys/" + dashboardData.user.slug}>
                                <a className="btn btn-link_ghost">View / Edit Profile</a>
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
                    <section className={styles.block}>
                        <MessageBlock messages={dashboardData.messages} />
                    </section>
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
