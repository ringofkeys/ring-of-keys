import Link from "next/link"
import IconHeadingLabel from "components/IconHeadingLabel"
// import Carousel from "components/Carousel"
import { request } from "lib/datocms"
import styles from "styles/home.module.css"
import Layout from "components/Layout"
import { pageQuery } from 'queries/page.js'
import PageContent from "components/PageContent"
// import SEO from "../components/SEO"

export async function getStaticProps({ params }) {
  const data = await request({
    query: pageQuery,
    variables: {
      slug: ""
    },
  })

  return {
    props: {
      data,
    },
  }
}

const IndexPage = ({ data }) => {
  // const { keySteps, homepageBody } = data.homepage
  // const { quoteAttribution, quoteTextNode } = homepageBody[0]

  return (
    <Layout>
      {/* <Layout classNames={['fullwidth']} footerQuoteText={ renderHtmlToReact(quoteTextNode.childMarkdownRemark.htmlAst) }
         footerQuoteAttribution={ quoteAttribution } footerQuoteBgColor='var(--rok-copper-1_hex)' footerQuoteTextColor='white'> */}
      <PageContent content={ data?.page?.content } />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Layout>
  )
}
export default IndexPage
