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
    const [keyshipPopupOpen, setKeyshipPopupOpen] = useState(false)

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
                setUser(data.user)
                setNewsfeed(data.page.newsfeed)
                setSpotlight(data.page.communitySpotlight)
                setMessages([])

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
                const eventData = await res.json()
                const events = (eventData && eventData.events)
                    ? eventData.events
                        .filter(e => new Date(e.start.utc).getTime() > Date.now())
                        .sort((a, b) => new Date(a.start.utc).getTime() - new Date(b.start.utc).getTime())
                    : []
                setWorkshops(events)
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
                                {user?.stripeId ? (
                                <>
                                    <p className="text-xs">Thank you for donating to support our programming! You can manage your donations here.</p>
                                    <button
                                        className={`block mt-4 ${styles.dashboardButton}`}
                                        onClick={() => createPortalSession(user.stripeId)}
                                    >
                                        Manage Keyship
                                    </button>
                                </>
                                    ) : (
                                <>
                                    <p className="text-xs">Ring of Keys is a 501c3 non-profit that runs on member donations. Please consider donating if you are able!</p>
                                    <button onClick={() => setKeyshipPopupOpen(true)} className={`block mt-4 ${styles.dashboardButton}`}>
                                        Donate Now
                                    </button>
                                </>
                                )}
                                {user.stripeId && stripeData && accountNeedsReview(stripeData.customer) && 
                                    <p className="p-2 mt-4 text-xs text-red-700 rounded bg-red-50">❗️ Something appears to be wrong with your billing, please review by clicking above.</p>
                                }
                            </div>
                        </div>
                        <div className={styles.workshopList}>
                            {workshops?.length
                                ? workshops.map(workshop => (
                                    <a className={styles.workshopItem} href={workshop?.url} target="_blank" rel="nofollower">
                                        <h3>{workshop?.name?.text}</h3>
                                        <p className={styles.subtitle}>{workshop?.summary}</p>
                                        <p>{new Date(workshop?.start?.local).toLocaleString()}</p>
                                    </a>
                                ))
                                : <p className="text-center my-4 bg-blue-50 px-5 py-4 text-sm">
                                    No Workshops scheduled right now! If you'd like to run your own, we'll help you set one up. Just fill out <a href="https://docs.google.com/forms/d/e/1FAIpQLSd_cPfNXpX8SIHGlnB_Cc38RnfNMsQwrpZir3-xjvh21Wge5w/viewform?usp=sf_link" target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:text-blue-700">this Google Form.</a>
                                </p>
                            }
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
                                : <p className="text-center my-4 bg-blue-50 px-5 py-4 text-sm">
                                    No messages just yet! Messages will be sent through the form on <Link href={"/keys/" + user.slug} className="text-blue-800 hover:text-blue-700">your profile</Link>.
                                </p>
                            }
                        </div>
                    </section>
                </div>
                {messages?.length > 0 && <Popup isOpen={!!popupMessage} onClose={() => setPopupMessage(false)}>
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
                {!user.stripeId && (
                    <Popup isOpen={keyshipPopupOpen} onClose={() => setKeyshipPopupOpen(false)}>
                        <StripeUnsubscribed userId={user.id} />
                    </Popup>
                )}
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

function getFakeWorkshops() {
    return [
        {
            name: { text: 'Build an ADHD-Friendly Creative Practice' },
            summary: 'In this 2-hour workshop, you’ll learn tricks and tips for building a creative practice that works for YOU.',
            location: `Joe's Pub`,
            start: { utc: '2023-02-21T00:00:00Z' }
        },
        {
            name: { text: 'Meet the Queer Literary Agents!' },
            summary: "Are you a musical theater writer, composer, director, or designer interested in learning more about what agents do? Join us for this panel!",
            location: 'Virtual',
            start: { utc: `2022-08-24T23:00:00Z` },
        },
        {
            name: { text: 'The Resilient Audition' },
            summary: "In this experiential brain training workshop, you will learn a series of mental practices to rewire your relationship with auditions.",
            location: 'Virtual',
            start: { utc: `2022-07-18T23:00:00Z` },
        },
    ]
}