import { eventItemQuery } from "queries/news"
import { request, requestLayoutProps } from "lib/datocms"
// import Img from 'gatsby-image'
import Layout from "components/Layout"
import { toDateTime } from "lib/utils"
import { MarkdownRenderer, parseMarkdown } from "lib/markdown"

export default function Event({ layoutData, event }) {
    const { title, featuredImage, description, startTime } = event
    const ast = parseMarkdown(description)

    return (
        <Layout layoutData={layoutData}>
            <h1>{title}</h1>
            <h4>{toDateTime(new Date(startTime))}</h4>
            {featuredImage && (
                <img src={featuredImage.url} alt={featuredImage.alt} />
            )}
            <MarkdownRenderer ast={ast} />
        </Layout>
    )
}

export async function getStaticPaths() {
    const data = await request({
        query: "query AllEventsQuery { allEvents { slug }}",
    })

    return {
        paths: data.allEvents
            .filter(({ slug }) => slug) // filters out any events that for some reason have an empty slug.
            .map(({ slug }) => {
                return {
                    params: { slug },
                }
            }), // https://nextjs.org/docs/basic-features/data-fetching#the-paths-key-required
        fallback: false,
    }
}

export async function getStaticProps(context) {
    const layoutData = await requestLayoutProps()

    const data = await request({
        query: eventItemQuery,
        variables: {
            slug: context.params.slug,
        },
    })

    return {
        props: {
            layoutData,
            event: data.event,
        },
    }
}
