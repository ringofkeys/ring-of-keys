import { newsItemQuery } from "queries/news"
import { request, requestLayoutProps } from "lib/datocms"
// import Img from 'gatsby-image'
import Layout from "components/Layout"
import { MarkdownRenderer, parseMarkdown } from "lib/markdown"

export default function News({ layoutData, news }) {
    const { title, featuredImage, description } = news
    const ast = parseMarkdown(description)

    return (
        <Layout layoutData={layoutData}>
            <h1>{title}</h1>
            {featuredImage && (
                <img src={featuredImage.url} alt={featuredImage.alt} />
            )}
            <MarkdownRenderer ast={ast} />
        </Layout>
    )
}

export async function getStaticPaths() {
    const data = await request({
        query: `query AllNewsQuery {
            allNews(filter: {externalUrl: {isBlank: true}}) {
              slug
            }
          }`,
    })

    return {
        paths: data.allNews
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
        query: newsItemQuery,
        variables: {
            slug: context.params.slug,
        },
    })

    return {
        props: {
            layoutData,
            news: data.news,
        },
    }
}
