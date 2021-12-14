import React from "react"
import { graphql, useStaticQuery } from "gatsby"
// import { renderHtmlToReact } from '../utils/renderHtmlToReact'
import Carousel from "../carousel"
import "./home.css"
import Layout from "../layout"

export default function HomeLayout(props) {
  const {
    allDatoCmsNews: { edges: newsItems },
  } = useStaticQuery(graphql`
    query HomepageCarouselQuery {
      allDatoCmsNews(limit: 10, sort: { fields: publishDate, order: DESC }) {
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
  `)

  return (
    <>
      {Object.values(props)}
      <div className="section_news">
        <Carousel heading="News" itemList={newsItems} recordType="news" />
      </div>
    </>
  )
}
