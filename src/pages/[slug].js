import Link from "next/link"
import IconHeadingLabel from "components/IconHeadingLabel"
import Carousel from "components/Carousel"
import { request, requestAll } from "lib/datocms"
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
    const data = await request({
        query: pageQuery,
        variables: {
            slug: params.slug,
        },
    })

    const pageSpecificQueries = [getPageSpecificQueries(params.slug), ...getComponentSpecificQueries(data.page.content)]
        .filter((query => query && query !== null))
    let pageSpecificData = {}

    console.log({ pageSpecificQueries  })

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
            ...data.page,
            pageSpecificData,
            sidebarData,
        },
    }
}

const Page = ({ sidebarData, ...pageProps }) => {
    // const { keySteps, homepageBody } = data.homepage
    // const { quoteAttribution, quoteTextNode } = homepageBody[0]

    return (
        <>
            <Layout sidebarData={sidebarData} className={pageProps.layout}>
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
