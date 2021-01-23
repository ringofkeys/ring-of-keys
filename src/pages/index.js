import React from "react"
import { graphql, Link } from 'gatsby'
import { renderHtmlToReact } from '../utils/renderHtmlToReact'
import Carousel from '../components/carousel'

import './index.css'
// import Img from 'gatsby-image'

import Layout from "../components/layout"
// import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = ({ data }) => {
  const  { keySteps, homepageBody } = data.allDatoCmsHomepage.nodes[0]
  const { edges: newsItems } = data.allDatoCmsNews

  const { quoteAttribution, quoteTextNode } = homepageBody[0]

  quoteTextNode.childMarkdownRemark.htmlAst.children[0].tagName = 'blockquote'

  keySteps.forEach(step => { // Markdown wraps everything in <p> tags but I want these in h3's
    const ast = step.headingNode.childMarkdownRemark.htmlAst
    ast.children[0].tagName = 'h3'
  })

  return (
    <Layout classNames={['fullwidth']} footerQuoteText={ renderHtmlToReact(quoteTextNode.childMarkdownRemark.htmlAst) }
      footerQuoteAttribution={ quoteAttribution } footerQuoteBgColor='var(--rok-copper-1_hex)' footerQuoteTextColor='white'>
      <SEO title="Home" />
      <div className='index_hero'>
        <h1><span>
          <span>Q</span>
          <span>u</span>
          <span>e</span>
          <span>e</span>
          <span>r</span>
          </span> The Stage</h1>
<<<<<<< HEAD
        <div class='index_hero__right-col'>
        Ring of Keys is an artist service organization that fosters community and visibility for musical theatre professionals - onstage and off 
        - who self-identify as queer women, transgender, and gender non-conforming artists.
=======
        <div className='index_hero__right-col'>
        Ring of Keys is an arts advocacy organization that promotes the hiring of musical 
        theatre professionals - onstage and off - who self-identify as queer women, transgender, 
        and gender non-conforming artists.
>>>>>>> stripe
          <Link to='/about' className='btn btn__learn-more'>Learn More</Link>
        </div>
      </div>
      <div className='section_icon-heading-labels'>
        {keySteps.map((step, i) => (
          <div className='icon-heading-label' key={step.icon.url + i} alt={step.icon.alt}>
            <img src={ step.icon.url } alt={ step.icon.alt} key={step.icon.alt + i} />
            { renderHtmlToReact(step.headingNode.childMarkdownRemark.htmlAst) }
            { renderHtmlToReact(step.labelNode.childMarkdownRemark.htmlAst) }
          </div>
        ))}
      </div>
      <div className='section_news'>
        <Carousel heading="News" itemList={ newsItems } recordType='news' />
      </div>
    </Layout>
  )
}
export default IndexPage

export const query = graphql`
  query HomepageQuery {
    allDatoCmsHomepage {
      nodes {
        homepageBody {
          quoteTextNode {
            childMarkdownRemark {
              htmlAst
            }
          }
          quoteAttribution
        }
        keySteps {
          icon {
            url
            alt
          }
          headingNode {
            childMarkdownRemark {
              htmlAst
            }
          }
          labelNode {
            childMarkdownRemark {
              htmlAst
            }
          }
        }
      }
    } allDatoCmsNews(limit: 10, sort: {fields: publishDate, order: DESC}) {
      edges {
        node {
          title
          externalUrl
          publishDate(formatString: "LL")
          featuredImage {
            url
          }
          bodyNode {
            childMarkdownRemark {
              excerptAst(truncate: true, pruneLength: 100)
            }
          }
          slug
        }
      }
    }
  }
`