import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import Link from "next/link"
import Layout from "components/Layout"
import { request, requestLayoutProps } from "../lib/datocms"
import parse from "html-react-parser"
import styles from 'styles/dashboard.module.css'
import MessageBlock from "components/MessageBlock"
import PageBlock from "components/PageContent/PageBlock"
import { StripeSubscribed, StripeUnsubscribed } from "components/StripeBlocks"
import Head from "next/head"


export async function getStaticProps() {
  const layoutData = await requestLayoutProps()

  return {
    props: {
      layoutData,
    }
  }
}

export default function Dashboard({ layoutData }) {
    const [dashboardData, setDashboardData] = useState(false)
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            signIn("auth0", { callbackUrl: (process.env.NODE_ENV == "development") ? "http://localhost:3000/dashboard" : "https://ringofkeys.org/dashboard" })
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

    return (<>
        <Head>
            <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
        </Head>
        <Layout className={"fullwidth"} layoutData={layoutData}>
            {dashboardData ? (
                <div className={styles.dashboardGrid}>
                    <section className={styles.personalInfo}>
                        <div className={styles.avatarWrapper}>
                            <img
                                src={`${dashboardData.user.headshot.url}?fit=facearea&faceindex=1&facepad=5&w=140&h=140&`}
                                alt={dashboardData.user.headshot.title}
                                className="avatar"
                            />
                        </div>
                        <div className={styles.infoContent}>
                            <h1>{dashboardData.user.name}</h1>
                            <p className="text-xs">{dashboardData.user.pronouns} · Member since {dashboardData.user.memberSince}</p>
                            <Link href={"/keys/" + dashboardData.user.slug} className={`mt-4 ${styles.dashboardButton}`}>
                                Edit Public Profile
                            </Link>
                        </div>
                    </section>
                    <section className={styles.workshops}>
                        <h2>Workshops</h2>
                    </section>
                    {/* <div className={styles.block +' '+ styles.blockIntro}>
                        <div>
                            <h2>{dashboardData.user.name}</h2>
                            <p className="my-4">{ parse(dashboardData.page.content.find(block => block.area === 'intro')?.content)
                                || "Welcome to the Key Member dashboard! Here you can find access to Members Only content like our Proud Member: Ring of Keys badges to use on your website, resumé, or portfolio."
                            }</p>
                            <Link href={"/keys/" + dashboardData.user.slug} className="my-4 btn btn-link_ghost">
                                View / Edit Profile
                            </Link>
                            {dashboardData.user?.stripeId && <StripeSubscribed stripeId={dashboardData.user.stripeId} />}
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
                    {!dashboardData.user?.stripeId && <StripeUnsubscribed userId={dashboardData.user?.id} />}
                    <section className={styles.block}>
                        <MessageBlock messages={dashboardData.messages} />
                    </section>
                    {dashboardData.page.content.filter(block => block.area !== "intro").map((block, i) => {
                        return (
                            <section
                                className={
                                    styles.block +
                                    (block.area ? " " + styles[`block_${block.area}`] : "")
                                }
                                key={"block" + i}
                            >
                                {block.__typename ===
                                "DashboardBlockRecord" ? (
                                    <>
                                        <h2>{block.blockTitle}</h2>
                                        {parse(block.content)}
                                    </>
                                ) : (
                                    <PageBlock {...block} />
                                )}
                            </section>
                        )
                    })} */}
                </div>
            ) : (
                <Loading />
            )}
        </Layout>
    </>)
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
                pronouns
                memberSince
                slug
                headshot {
                    url
                    title
                }
                stripeId
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
                        __typename
                        area
                        content
                        id
                    }
                    
                    ... on DashboardBlockRecord {
                        __typename
                        blockTitle
                        content
                        area
                        id
                    }
                    
                    ... on ShortcodeRecord {
                        __typename
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