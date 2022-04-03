import React from "react"
import { graphql } from "gatsby"
import { renderHtmlToReact } from "../utils/renderHtmlToReact"
import "./donate.css"
import Layout from "../components/layout"
import DonorBoxWidget from "../components/DonorBoxWidget"
import "./apply.css"

const Donate = ({ data }) => {
  const bodyContent = data.pageContent.bodyNode.childMarkdownRemark.htmlAst
  const blocks = data.pageContent.contentBlocks
  const quote = blocks.find(el => el.area === "big-quote").contentNode
    .childMarkdownRemark.htmlAst
  const rightCol = blocks.find(el => el.area === "right-col").contentNode
    .childMarkdownRemark.htmlAst

  console.log({ quote })

  // add in Blockquote class
  quote.children[0].properties.class = "quote_graphic-bar"

  // add Donate link styles
  const donateLink = rightCol.children.find(
    elem =>
      elem.type === "element" &&
      elem.children.length > 0 &&
      elem.children[0].tagName === "a" &&
      elem.children[0].children.length > 0 &&
      elem.children[0].children[0].value.toLowerCase().includes("donation")
  )
  donateLink.children[0].properties = Object.assign(
    donateLink.children[0].properties,
    {
      class: donateLink.children[0].properties.class + " btn bg_slate",
      rel: "norefferrer noopener",
      target: "_blank",
    }
  )

  return (
    <Layout
      classNames={["donate"]}
      title="Donate"
      description={`Your tax-deductible donation supports Ring of Key's mission to promote the hiring of self-identifying 
        queer women and TGNC artists in the musical theatre industry.`}
    >
      <h1>Donate</h1>
      {renderHtmlToReact(quote)}
      <section
        style={{ display: "flex", flexWrap: "wrap-reverse", gap: "2rem" }}
      >
        <DonorBoxWidget />
        <div style={{ flex: "30%" }}>{renderHtmlToReact(rightCol)}</div>
      </section>
    </Layout>
  )
}
export default Donate

export const query = graphql`
  query DonateQuery {
    pageContent: datoCmsLandingPage(title: { eq: "Donate" }) {
      bodyNode {
        childMarkdownRemark {
          htmlAst
        }
      }
      contentBlocks {
        ... on DatoCmsBasicBlock {
          area
          contentNode {
            childMarkdownRemark {
              htmlAst
            }
          }
        }
      }
    }
  }
`
