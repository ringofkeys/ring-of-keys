import React, { useReducer } from "react"
import parse from "html-react-parser"
import { parseBlock } from "../../utils/datoBlocks"
import { Link, graphql, useStaticQuery } from "gatsby"
import MessageBlock from "../../components/MessageBlock"
import dashboardReducer from "./dashboardReducer"
import {
    StripeSubscribed,
    StripeUnsubscribed,
} from "../../components/StripeBlocks"
import PageBlock from "../PageBlock"

const Home = ({
    user = { name: "", slug: "/directory", headshot: { url: "", title: "" } },
}) => {
    const data = useStaticQuery(graphql`
        query MessagesQuery {
            dashboard: datoCmsLandingPage(originalId: { eq: "4610845" }) {
                bodyNode {
                    childMarkdownRemark {
                        html
                    }
                }
                contentBlocks {
                    ... on DatoCmsDashboardBlock {
                        blockTitle
                        content
                        area
                    }

                    ... on DatoCmsShortcode {
                        id
                        name
                    }
                }
            }
            allDatoCmsMessage(
                sort: { fields: meta___firstPublishedAt, order: DESC }
            ) {
                nodes {
                    fromEmail
                    fromName
                    message
                    toArtist {
                        name
                    }
                    meta {
                        timeDiff: firstPublishedAt(difference: "days")
                        timeSince: firstPublishedAt(fromNow: true)
                        timeString: firstPublishedAt(formatString: "MM/DD/YY")
                    }
                }
            }
        }
    `)

    let messages = []
    if (user) {
        messages = data.allDatoCmsMessage.nodes.filter(
            (node) => node.toArtist.name === user.name
        )
    }

    const storedStripeId = localStorage.getItem("stripe_customer")
    if (!user.stripeId && storedStripeId) {
        user.stripeId = storedStripeId
    } else if (user.stripeId && storedStripeId) {
        localStorage.removeItem("stripe_customer") // once we know we're covered, remove the localStorage item in case the user deletes their subscription in future.
    }

    const initialState = {
        popupOpen: "",
    }

    const [state, dispatch] = useReducer(dashboardReducer, initialState)

    return (
        <>
            <h1>Dashboard</h1>
            <div className="block block_intro">
                <div>
                    <h2>{user.name}</h2>
                    {parse(data.dashboard.bodyNode.childMarkdownRemark.html)}
                    <Link
                        to={"/keys/" + user.slug}
                        className="btn btn-link_ghost"
                    >
                        View / Edit Profile
                    </Link>
                    {user.stripeId && (
                        <StripeSubscribed stripeId={user.stripeId} />
                    )}
                </div>
                {user.headshot && (
                    <img
                        src={
                            user.headshot.url +
                            "?fit=facearea&faceindex=1&facepad=5&mask=ellipse&w=140&h=140&"
                        }
                        alt={user.headshot.title}
                        className="avatar"
                    />
                )}
            </div>
            {!user.stripeId && <StripeUnsubscribed userId={user.id} />}
            <MessageBlock messages={messages} />
            {data.dashboard.contentBlocks.map((block, i) => {
                return (
                    <section
                        className={
                            "block" + (block.area ? ` block_${block.area}` : "")
                        }
                        key={"block" + i}
                    >
                        {block.__typename === "DatoCmsDashboardBlock" ? (
                            <>
                                <h2>{block.blockTitle}</h2>
                                {parse(block.content)}
                            </>
                        ) : (
                            <PageBlock {...block} />
                        )}
                    </section>
                )
            })}
        </>
    )
}
export default Home
