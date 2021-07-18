import Link from 'next/link'
import IconHeadingLabel from '../components/IconHeadingLabel'
import Carousel from '../components/carousel'
import { request } from '../lib/datocms'
import styles from '../styles/home.module.css'
import Layout from "../components/Layout"
// import SEO from "../components/seo"

export const HOMEPAGE_QUERY = `
query HomepageQuery($limit: IntType) {
 homepage {
   homepageBody {
     quoteText
     quoteAttribution
   }
   keySteps {
     icon {
       url
       alt
     }
     heading
     contentRich {
       value
     }
     label
   }
 }
  allNews(orderBy: publishDate_DESC, filter: { position: { lte: $limit }}) {
    title
    externalUrl
    publishDate
    featuredImage {
      url
    }
    body(markdown:true)
    slug
  }
}`

export async function getStaticProps() {
  const data = await request({
    query: HOMEPAGE_QUERY,
    variables: {
      limit: 10,
    }
  })

  return {
    props: {
      data,
    }
  }
}

const IndexPage = ({ data }) => {
  const  { keySteps, homepageBody } = data.homepage
  const { quoteAttribution, quoteTextNode } = homepageBody[0]

  return (<Layout>
       {/* <Layout classNames={['fullwidth']} footerQuoteText={ renderHtmlToReact(quoteTextNode.childMarkdownRemark.htmlAst) }
         footerQuoteAttribution={ quoteAttribution } footerQuoteBgColor='var(--rok-copper-1_hex)' footerQuoteTextColor='white'> */}
        <div className={styles.index_hero}>
          <h1><span>
            <span>Q</span>
            <span>u</span>
            <span>e</span>
            <span>e</span>
            <span>r</span>
            </span> The Stage</h1>
          <div className={styles["index_hero__right-col"]}>
          Ring of Keys is an artist service organization that fosters community and visibility for musical theatre artists - onstage and off 
          - who self-identify as queer women, transgender, and gender non-conforming artists.
            <Link href='/about' className='btn btn__learn-more'>
              <a>
                Learn More
              </a>
            </Link>
          </div>
        </div>
        <section className={styles['section_icon-heading-labels']}>
           { keySteps.map((step, i) => (
              <IconHeadingLabel key={step.icon.url + i} {...step} />
            ))}
         </section>
         <div className={styles['section_news']}>
           <Carousel heading="News" itemList={ data.allNews } recordType='news' />
         </div>
        <pre>
          { JSON.stringify(data, null, 2) }
        </pre>
  </Layout>)
}
export default IndexPage