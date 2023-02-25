import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import Link from "next/link"
import Layout from "components/Layout"
import { StructuredText } from 'react-datocms';
import { request, requestLayoutProps } from "../lib/datocms"
import parse from "html-react-parser"
import styles from 'styles/dashboard.module.css'
import MessageBlock from "components/MessageBlock"
import PageBlock from "components/PageContent/PageBlock"
import { StripeSubscribed, StripeUnsubscribed } from "components/StripeBlocks"
import Head from "next/head"
import Icon from "components/Icon"
import Popup from "components/Popup";
import { accountNeedsReview, createPortalSession, getCurrentSubscription, getCustomer, getLastPayment, stripeProducts } from "lib/stripe";

export async function getStaticProps() {
  const layoutData = await requestLayoutProps()

  return {
    props: {
      layoutData,
    }
  }
}

export default function Dashboard({ layoutData }) {
    const [user, setUser] = useState(false)
    const [workshops, setWorkshops] = useState(false)
    const [spotlight, setSpotlight] = useState(false)
    const [newsfeed, setNewsfeed] = useState(false)
    const [messages, setMessages] = useState(false)
    const [stripeData, setStripeData] = useState(false)
    const [popupMessage, setPopupMessage] = useState(false)

    const validTier = (stripeData) => stripeData?.tier >= 0 && stripeData?.tier !== null;

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
            getDashboardContent(session.token.datoId).then(async (data) => {
                const workshops = getWorkshops();
                
                setUser(data.user)
                setWorkshops(workshops)
                setNewsfeed(data.page.newsfeed)
                setSpotlight(data.page.communitySpotlight)
                setMessages(data.messages)

                console.log(data)

                if (data.user.stripeId) {
                    const customer = await getCustomer(data.user.stripeId)
                    const tier = getCurrentSubscription(customer)
                    const lastPayment = getLastPayment(customer)

                    console.log({ customer, tier, lastPayment })
                    setStripeData({ customer, tier, lastPayment })
                }
            })

            fetch('/api/getEvents').then(async (res) => {
                console.log({res})
                const data = await res.json()
                console.log({eventData: data})
                setEvents(data)
            })
        }
    }, [session])

    async function updateKey(data) {
        const newData = await fetch('/api/updateKey', {
            method: 'POST',
            body: JSON.stringify({
                id: user.id,
                ...data,
            }),
            Headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => res.json())
        .catch(e => {
            console.error(e)
            return e
        })

        setUser({...Object.assign(user, newData)})
    }


    return (<>
        <Head>
            <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
        </Head>
        <Layout className={"fullwidth " + styles.layout} layoutData={layoutData}>
            {(user && newsfeed) ? (<>
                <div className={styles.dashboardGrid}>
                    <section className={styles.infoSection}>
                        <div className={styles.avatarWrapper}>
                            <img
                                src={`${user?.headshot?.url}?fit=facearea&faceindex=1&facepad=5&w=140&h=140&`}
                                alt={user?.headshot?.title}
                                className="avatar"
                            />
                        </div>
                        <div className={styles.infoContent}>
                            <h1>{user.name}</h1>
                            <p className="text-xs">{user.pronouns} · Member since {user.memberSince}</p>
                            <Link href={"/keys/" + user.slug} className={`mt-4 ${styles.dashboardButton}`}>
                                Edit Public Profile
                            </Link>
                        </div>
                    </section>
                    <section className={styles.workshopsSection}>
                        <div className={styles.contentBar}>
                            <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Icon type="workshop" className="w-4" fill="var(--rok-slate-blue_hex)" />
                                <h2>Workshops</h2>
                            </div>
                                <p className="text-xs">Exclusive professional development events for Keys.</p>
                            </div>
                            <div>
                                <p className="text-xs">You have <strong>3</strong> more free slots for workshops this year as a part of your <strong>{validTier(stripeData) ? stripeProducts[stripeData.tier]?.label : 'Basic'}</strong> Keyship.</p>
                                {user.stripeId && <button href={"/keys/" + user.slug}
                                    className={`block mt-4 ${styles.dashboardButton}`}
                                    onClick={() => createPortalSession(user.stripeId)}
                                >
                                    Manage Keyship
                                </button>}
                                {user.stripeId && stripeData && accountNeedsReview(stripeData.customer) && 
                                    <p className="p-2 mt-4 text-xs text-red-700 rounded bg-red-50">❗️ Something appears to be wrong with your billing, please review by clicking above.</p>
                                }
                            </div>
                        </div>
                        <div className={styles.workshopList}>
                            {workshops?.length
                                ? workshops.map(workshop => (
                                    <a className={styles.workshopItem}>
                                        <h3>{workshop.title}{workshop.subtitle 
                                            ? (<>:<br/><span className={styles.subtitle}>{workshop.subtitle}</span></>)
                                            : ''}
                                        </h3>
                                        <p>{workshop.eventStart}</p>
                                    </a>
                                ))
                                : <p>No Workshops</p>}
                        </div>
                    </section>
                    <section className={styles.newsSection} >
                        <div className="flex items-center gap-2">
                            <Icon type="news" className="w-4" fill="var(--rok-pale-green-1_hex)" />
                            <h2>News</h2>
                        </div>
                        <div className={styles.newsList}>
                            {newsfeed?.length && newsfeed.map((block, i) => (<div className={styles.newsItem}>
                                {block.image && <img src={block.image.url} alt={block.image.altText} className="max-w-[120px]" /> }
                                <h3 className="mt-4">{block.blockTitle}</h3>
                                <StructuredText data={block.description} />
                                <div className="flex gap-2 mt-auto">
                                {block.primaryLinkUrl &&
                                    <a href={block.primaryLinkUrl} rel="noopener noreferrer" target="_blank" className={styles.newsLink}>{block.primaryLinkText || "Get Started"}</a>}
                                {block.secondaryLinkUrl &&
                                    <a href={block.secondaryLinkUrl} rel="noopener noreferrer" target="_blank" className={styles.newsLink +' '+ styles.newsLinkSecondary}>{block.secondaryLinkText || "Get Started"}</a>}
                                </div>
                            </div>))}
                        </div>
                    </section>
                    {spotlight && 
                    <section className={styles.communitySpotlight}>
                        <div className="flex items-center gap-2 mb-2">
                            <Icon type="lightbulb" className="w-4" fill="var(--rok-peach-1_hex)" />
                            <h2>Community Spotlight</h2>
                        </div>
                        <a href={`/keys/${spotlight.slug}`} className={styles.memberCard}>
                            <div className="object-scale-down overflow-hidden rounded w-fit" style={{gridArea: 'img'}}>
                                <img src={spotlight.headshot.url + '?fit=facearea&faceindex=1&facepad=5&w=140&h=140&'} alt={`member's portrait`}/>
                            </div>
                            <div>
                                <h3>{spotlight.name}</h3>
                                <p className={styles.disciplineAndLocation}>
                                    {spotlight.pronouns} · {spotlight.discipline} in {spotlight.mainLocation}</p>
                            </div>
                            <p className="font-normal" style={{gridArea: 'message'}}>{spotlight.communitySpotlightMessage}</p>
                        </a>
                    </section>
                    }
                    <section className={styles.messagesSection}>
                        <div className={styles.contentBar}>
                            <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Icon type="message" className="w-4" fill="#494949" />
                                <h2>Messages</h2>
                            </div>
                                <p className="text-xs">Outreach from industry professionals through your public profile.</p>
                            </div>
                            <div>
                                <p className="text-xs">Our team screens your messages for harassment. We can see initial outreach, but not your response via email.</p>
                                <label className="flex items-center gap-2 my-2 font-normal">
                                    <input type="checkbox" name="moderateMessages"
                                        checked={user?.moderateMessages}
                                        onChange={() => updateKey({moderateMessages: !user.moderateMessages })} />
                                    Screen messages for harassment
                                </label>
                                <label className="flex items-center gap-2 my-2 font-normal">
                                    <input type="checkbox" name="hideMessageButton"
                                        checked={user?.hideMessageButton}
                                        onChange={() => updateKey({hideMessageButton: !user.hideMessageButton })} />
                                    Hide message button on profile
                                </label>
                            </div>
                        </div>
                        <div className="overflow-y-auto">
                            {messages?.length
                                ? messages.map(message => (
                                    <div className="max-w-full mb-4">
                                        <h3>{message.fromName}</h3>
                                        <p className="text-xs" style={{color: "#888888"}}>
                                            {new Date(message._firstPublishedAt).toLocaleString('en-us')}
                                        </p>
                                        <button className={styles.messageBlock}
                                            onClick={() => setPopupMessage(message)}>
                                            <p className="p-0 m-0">
                                                {message.message}
                                            </p>
                                        </button>
                                    </div>
                                ))
                                : <p>No Messages</p>}
                        </div>
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
                {messages?.length && <Popup isOpen={!!popupMessage} onClose={() => setPopupMessage(false)}>
                    <h2>{popupMessage.fromName}</h2>
                    <a
                        href={`mailto:${popupMessage.fromEmail}`}
                        style={{ marginBlockEnd: "1em" }}
                    >
                        {popupMessage.fromEmail}
                    </a>
                    <p>Sent {new Date(popupMessage._firstPublishedAt).toLocaleString('en-us')}</p>
                    <p class={styles.messageBody}>{popupMessage.message}</p>
                    <a
                        className="btn bg_slate"
                        href={"mailto:" + popupMessage.fromEmail}
                        rel="noopener noreferrer"
                    >
                        Reply
                    </a>
                </Popup>}
            </>) : (
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
                hideMessageButton
                moderateMessages
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

            page: dashboard {
                communitySpotlight {
                    name
                    id
                    slug
                    pronouns
                    discipline
                    mainLocation
                    headshot {
                        url
                    }
                    communitySpotlightMessage
                }
                newsfeed {
                    ...on DashboardBlockRecord {
                        blockTitle
                        description { 
                            value
                        }
                        image {
                            alt
                            url
                        }
                        primaryLinkText
                        primaryLinkUrl
                        secondaryLinkText
                        secondaryLinkUrl
                    }
                }
            }
        }`

    return await request({
        query: DASHBOARD_QUERY,
        variables: { id: datoId },
    })
}

function getWorkshops() {
    return [
        {
            title: 'An Artist’s Financial Rebound',
            subtitle: 'Aligning Finances With Goals',
            location: 'Virtual',
            eventStart: 'Monday, March 8, 2021 3:30 PM ET',
        },
        {
            title: 'Antiracism and the American Theatre',
            subtitle: 'with Lindsay Roberts',
            location: `Joe's Pub`,
            eventStart: 'Monday, February 22, 2021 3:30 PM',
        },
        {
            title: 'The Art of the Pivot',
            subtitle: "with Multify's Caitlin Donohue",
            location: 'Virtual',
            eventStart: `Friday, February 12, 2021 8:00 AM`,
        },
        {
            title: 'The Art of the Pivot',
            subtitle: "with Multify's Caitlin Donohue",
            location: 'Virtual',
            eventStart: `Friday, February 12, 2021 8:00 AM`,
        },
    ]
}