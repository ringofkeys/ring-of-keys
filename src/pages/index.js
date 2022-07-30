import Link from "next/link"
import IconHeadingLabel from "components/IconHeadingLabel"
// import Carousel from "components/Carousel"
import { request } from "lib/datocms"
import styles from "styles/home.module.css"
import Layout from "components/Layout"
import { pageQuery } from "queries/page.js"
import PageContent from "components/PageContent"
import Carousel from "components/Carousel"
import { homeNewsQuery } from "queries/news"
// import SEO from "../components/SEO"

export async function getStaticProps({ params }) {
    const data = await request({
        query: pageQuery,
        variables: {
            slug: "",
        },
    })

    const carouselData = await request({
        query: homeNewsQuery,
        variables: {},
    })

    // Find and filter out the QuoteBlock if it's present
    const quoteBlockIndex = data.page.content.findIndex(block => block.__typename === 'QuoteRecord')
    let quoteBlock = false
    if (quoteBlockIndex >= 0) {
        quoteBlock = data.page.content.find(block => block.__typename === 'QuoteRecord')
        data.page.content = [...data.page.content.slice(0, quoteBlockIndex), ...data.page.content.slice(quoteBlockIndex + 1, 0)]
    }

    return {
        props: {
            data,
            carouselData,
            quoteBlock,
        },
    }
}

const IndexPage = ({ data, carouselData, quoteBlock }) => {
    // const { keySteps, homepageBody } = data.homepage
    // const { quoteAttribution, quoteTextNode } = homepageBody[0]

    return (
        <Layout className={styles.base + " fullWidth " + data?.page?.layout} quote={quoteBlock}>
            {/* <Layout classNames={['fullwidth']} footerQuoteText={ renderHtmlToReact(quoteTextNode.childMarkdownRemark.htmlAst) }
         footerQuoteAttribution={ quoteAttribution } footerQuoteBgColor='var(--rok-copper-1_hex)' footerQuoteTextColor='white'> */}
            <PageContent content={data?.page?.content} />
            <div className="section_news">
                <Carousel heading="News" entryList={carouselData?.allNews} recordType="news" />
            </div>
            {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        </Layout>
    )
}
export default IndexPage
