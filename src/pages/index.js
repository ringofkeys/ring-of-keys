import React from "react"
import { graphql } from 'gatsby'
import { renderHtmlToReact } from '../utils/renderHtmlToReact'

import './index.css'
// import Img from 'gatsby-image'

import Layout from "../components/layout"
// import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = ({ data }) => {
  const  { keySteps, homepageBody } = data.allDatoCmsHomepage.nodes[0]

  const { quoteAttribution, quoteTextNode } = homepageBody[0]

  keySteps.forEach(step => { // Markdown wraps everything in <p> tags but I want these in h3's
    const ast = step.headingNode.childMarkdownRemark.htmlAst
    ast.children[0].tagName = 'h3'
  })

  const quoteAst = quoteTextNode.childMarkdownRemark.htmlAst
  quoteAst.children[0].tagName = 'blockquote'

  return (
    <Layout>
      <SEO title="Home" />
      <div className='hero'></div>
      <div className='bar__learn-more'>
        <div>
          <h1 className='heading__inline'>Ring of Keys</h1> is a national network of queer women, trans, and gender non-conforming artists working on and offstage in musical theatre.
        </div>
        <a href='#learn-more' className='btn btn__learn-more'>Learn More</a>
      </div> 
      <div className='section_icon-heading-labels'>
        {keySteps.map(step => (
          <div className='icon-heading-label'>
            <img src={ step.icon.url } alt={ step.icon.alt} />
            { renderHtmlToReact(step.headingNode.childMarkdownRemark.htmlAst) }
            { renderHtmlToReact(step.labelNode.childMarkdownRemark.htmlAst) }
          </div>
        ))}
      </div>
      <div className='section_quote-block'>
        { renderHtmlToReact(quoteAst) }
        <p>— { quoteAttribution }</p>
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
    }
  }
`