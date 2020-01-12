import React from 'react'
// import Img from 'gatsby-image'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import { renderHtmlToReact } from '../utils/renderHtmlToReact'

export default ({ data }) => {
    const { title, featuredImage, descriptionNode } = data.datoCmsNews
    return (
        <Layout>
            <h1>{ title }</h1>
            { featuredImage && (<img src={ featuredImage.url } />) }
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
            }
            bodyNode {
                childMarkdownRemark {
                    htmlAst
                }
            }
        }
    }
`