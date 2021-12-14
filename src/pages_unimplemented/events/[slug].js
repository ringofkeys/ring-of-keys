import React from "react"
// import Img from 'gatsby-image'
import { graphql } from "gatsby"
import Layout from "../components/layout"
import { renderHtmlToReact } from "../utils/renderHtmlToReact"
import "./event.css"

export default ({ data }) => {
  const { title, featuredImage, descriptionNode, startTime } = data.datoCmsEvent
  return (
    <Layout classNames={["event"]}>
      <h1>{title}</h1>
      <p>{startTime}</p>
      {featuredImage && (
        <img
          src={featuredImage.url}
          alt={featuredImage.alt}
          class="featured-image"
        />
      )}
      {descriptionNode &&
        renderHtmlToReact(descriptionNode.childMarkdownRemark.htmlAst)}
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
