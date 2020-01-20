import React from 'react'
// import Img from 'gatsby-image'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import { renderHtmlToReact } from '../utils/renderHtmlToReact'

export default ({ data }) => {
    const { title, featuredImage, descriptionNode, startTime } = data.datoCmsEvent
    return (
        <Layout>
            <h1>{ title }</h1>
            <p>{ startTime }</p>
            { featuredImage && (<img src={ featuredImage.url } alt={featuredImage.alt} />) }
            { descriptionNode && renderHtmlToReact(descriptionNode.childMarkdownRemark.htmlAst) }
        </Layout>
    )
}

export const query = graphql`
    query EventQuery($slug: String!) {
        datoCmsEvent(slug: { eq: $slug }) {
            title
            featuredImage {
                url
                alt
            }
            descriptionNode {
                childMarkdownRemark {
                    htmlAst
                }
            }
            startTime(formatString: "LL")
            endTime
        }
    }
`