import React from 'react'
import { graphql } from 'gatsby'
// import Img from 'gatsby-image'
import Layout from '../components/Layout'
import { renderHtmlToReact } from '../utils/renderHtmlToReact'

export default ({ data }) => {
    const { title, featuredImage, descriptionNode } = data.datoCmsNews
    return (
        <Layout>
            <h1>{ title }</h1>
            { featuredImage && (<img src={ featuredImage.url } alt={featuredImage.alt}/>) }
            { descriptionNode && renderHtmlToReact(descriptionNode.childMarkdownRemark.htmlAst) }
        </Layout>
    )
}

export const query = graphql`
    query NewsPieceQuery($slug: String!) {
        datoCmsNews(slug: { eq: $slug }) {
            title
            featuredImage {
                url
                alt
            }
            bodyNode {
                childMarkdownRemark {
                    htmlAst
                }
            }
        }
    }
`