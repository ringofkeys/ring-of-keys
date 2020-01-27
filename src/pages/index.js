import React, { useState } from "react"
import { graphql, Link } from 'gatsby'
import { renderHtmlToReact } from '../utils/renderHtmlToReact'
import Carousel from '../components/carousel'
import icon_key from '../images/icon_key.svg'

import './index.css'
// import Img from 'gatsby-image'

import Layout from "../components/layout"
// import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = ({ data }) => {
  const  { keySteps, homepageBody } = data.allDatoCmsHomepage.nodes[0]
  const { edges: newsItems } = data.allDatoCmsNews

  const { quoteAttribution, quoteText } = homepageBody[0]

  keySteps.forEach(step => { // Markdown wraps everything in <p> tags but I want these in h3's
    const ast = step.headingNode.childMarkdownRemark.htmlAst
    ast.children[0].tagName = 'h3'
  })

  const [currIndex, setIndex] = useState(0)

  return (
    <Layout classNames={['fullwidth']}>
      <SEO title="Home" />
      <div className='index_hero'>
        <h1><span>
          <span>Q</span>
          <span>u</span>
          <span>e</span>
          <span>e</span>
          <span>r</span>
          </span> The Stage</h1>
        <div class='index_hero__right-col'>
          Ring of Keys is a national network of queer women, trans, and gender non-conforming artists working on and offstage 
          in musical theatre.
          <Link to='/about' className='btn btn__learn-more has-arrow'>Learn More</Link>
        </div>
      </div>
      <div className='section_icon-heading-labels'>
        {keySteps.map(step => (
          <div className='icon-heading-label' key={step.icon.url} alt={step.icon.alt}>
            <img src={ step.icon.url } alt={ step.icon.alt} key={step.icon.alt} />
            { renderHtmlToReact(step.headingNode.childMarkdownRemark.htmlAst) }
            { renderHtmlToReact(step.labelNode.childMarkdownRemark.htmlAst) }
          </div>
        ))}
      </div>
      <div className='section_news'>
        <h2>News</h2>
        <Carousel itemList={ newsItems } recordType='news' />
      </div>
      <div className='section_quote-block'>
        <img className='icon_key' src={ icon_key } alt='key icon' />
        <div>
          <blockquote>{ quoteText }</blockquote>
          <p>— { quoteAttribution }</p>
        </div>
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
          quoteText
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
    } allDatoCmsNews(limit: 10, sort: {fields: meta___publishedAt, order: DESC}) {
      edges {
        node {
          title
          isExternalNews
          externalUrl
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