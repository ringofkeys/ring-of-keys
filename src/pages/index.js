import React, { useState } from "react"
import { graphql, Link } from 'gatsby'
import { renderHtmlToReact } from '../utils/renderHtmlToReact'
import SEO from "../components/seo"
import Layout from "../components/Layout"
import Carousel from '../components/Carousel'
import './index.css'
// import Img from 'gatsby-image'
// import Image from "../components/image"

const IndexPage = ({ data }) => {
  const  { keySteps, homepageBody } = data.allDatoCmsHomepage.nodes[0]
  const { edges: newsItems } = data.allDatoCmsNews

  const { quoteAttribution, quoteTextNode } = homepageBody[0]

  keySteps.forEach(step => { // Markdown wraps everything in <p> tags but I want these in h3's
    const ast = step.headingNode.childMarkdownRemark.htmlAst
    ast.children[0].tagName = 'h3'
  })

  const quoteAst = quoteTextNode.childMarkdownRemark.htmlAst
  quoteAst.children[0].tagName = 'blockquote'

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
          <a href='#learn-more' className='btn btn__learn-more has-arrow'>Learn More</a>
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
      <div className='section_quote-block'>
        <div>
          { renderHtmlToReact(quoteAst) }
          <p>— { quoteAttribution }</p>
        </div>
      </div>
      <div className='section_news'>
        <h2>Industry News</h2>
        <Carousel itemList={ newsItems } recordType='news' />
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