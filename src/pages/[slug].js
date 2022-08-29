import Link from "next/link"
import IconHeadingLabel from "components/IconHeadingLabel"
import Carousel from "components/Carousel"
import { request, requestAll, requestLayoutProps } from "lib/datocms"
import styles from "styles/home.module.css"
import Layout from "components/Layout"
import { pageQuery } from "queries/page.js"
import { sidebarQuery } from "queries/sidebar.js"
import PageContent from "components/PageContent"
import { getComponentSpecificQueries, getPageSpecificQueries } from "queries"

const unincludedPages = [
    "dashboard",
    "donate",
]

export async function getStaticPaths() {
    const slugs = await request({
        query: "query AllPageQuery { allPages { slug }}",
    })

    return {
        paths: slugs.allPages
            .filter(({ slug }) => slug && unincludedPages.indexOf(slug) < 0) // filters out the home page, which has an empty slug.
            .map(({ slug }) => ({
                params: { slug },
            })), // https://nextjs.org/docs/basic-features/data-fetching#the-paths-key-required
        fallback: false,
    }
}

export async function getStaticProps({ params }) {
    // Global CMS-powered items like the nav
    const layoutData = await requestLayoutProps()

    const data = await request({
        query: pageQuery,
        variables: {
            slug: params.slug,
        },
    })

    // Find and filter out the QuoteBlock if it's present
    const quoteBlockIndex = data.page.content.findIndex(block => block.__typename === 'QuoteRecord')
    let quoteBlock = false
    if (quoteBlockIndex >= 0) {
        quoteBlock = data.page.content.find(block => block.__typename === 'QuoteRecord')
        data.page.content = [...data.page.content.slice(0, quoteBlockIndex), ...data.page.content.slice(quoteBlockIndex + 1, 0)]
    }

    console.log({quoteBlock, content: data.page.content })

    const pageSpecificQueries = [getPageSpecificQueries(params.slug), ...getComponentSpecificQueries(data.page.content)]
        .filter((query => query && query !== null))
    let pageSpecificData = {}

    if (pageSpecificQueries.length) {
        for (const {name, query, variables, isRepeating} of pageSpecificQueries) {
            pageSpecificData[name] = !isRepeating
                ? await request({ query, variables })
                : await requestAll({ query, variables })
        }
    }

    let sidebarData = false
    if (data?.page?.hasSidebar) {
        sidebarData = await request({
            query: sidebarQuery,
            variables: {},
        })
    }

    return {
        props: {
            layoutData,
            ...data.page,
            pageSpecificData,
            sidebarData,
            quoteBlock,
        },
    }
}

const Page = ({ layoutData, sidebarData, ...pageProps }) => {
    // const { keySteps, homepageBody } = data.homepage
    // const { quoteAttribution, quoteTextNode } = homepageBody[0]

    return (
        <>
            <Layout
                layoutData={layoutData}
                sidebarData={sidebarData}
                className={pageProps.layout}
                quote={pageProps.quoteBlock}>
                {/* <Layout classNames={['fullwidth']} footerQuoteText={ renderHtmlToReact(quoteTextNode.childMarkdownRemark.htmlAst) }
         footerQuoteAttribution={ quoteAttribution } footerQuoteBgColor='var(--rok-copper-1_hex)' footerQuoteTextColor='white'> */}
                <PageContent
                    content={pageProps.content}
                    pageSpecificData={pageProps.pageSpecificData}
                />
                {/* { (pageProps.pageSpecificData) && <pre>{ JSON.stringify(pageProps.pageSpecificData, null, 2) }</pre> } */}
            </Layout>
        </>
    )
}
export default Page
