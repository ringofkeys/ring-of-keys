import React from "react"
// import Img from 'gatsby-image'
import { graphql } from "gatsby"
import Helmet from "react-helmet"
import Layout from "../components/layout"
import Donate from "../components/Layouts/donate"
import Resources from "../components/Layouts/resources"
import Dashboard from "../components/Layouts/dashboard"
import Home from "../components/Layouts/home"
import PageBlock from "../components/PageBlock.js"
import "./event.css"
import SidebarLayout from "../components/sidebarlayout"

const specialLayouts = {
  donate: {
    Component: Donate,
    layoutClasses: "",
  },
  resources: {
    Component: Resources,
    layoutClasses: "",
  },
  dashboard: {
    Component: Dashboard,
    layoutClasses: "",
  },
  home: {
    Component: Home,
    layoutClasses: "fullwidth",
  },
}

const Page = ({ data: { datoCmsPage: page } }) => {
  const SpecialLayout = page.slug
    ? specialLayouts[page.slug]
    : specialLayouts["home"]

  const footerQuote = page.content.find(
    block => block.__typename === "DatoCmsQuote"
  )

  groupBlocks("DatoCmsIconHeadingLabel", page.content)
  groupBlocks("DatoCmsTeammateItem", page.content)

  let layoutProps = {
    classNames: [
      "landing-page",
      page.slug,
      SpecialLayout ? SpecialLayout.layoutClasses : "",
    ],
  }

  if (page.seo) {
    layoutProps.title = page.seo.title
    layoutProps.description = page.seo.description
  }
  if (footerQuote) {
    layoutProps = {
      ...layoutProps,
      footerQuoteAttribution: footerQuote.quoteAttribution,
      footerQuoteText: <blockquote>{footerQuote.quoteText}</blockquote>,
      footerQuoteBgColor: footerQuote.backgroundColor
        ? footerQuote.backgroundColor.hex
        : "",
      footerTextColor: footerQuote.textColor ? footerQuote.textColor.hex : "",
    }
  }

  const content = page.content
    .filter(block => block.__typename !== "DatoCmsQuote")
    .map((block, i) => <PageBlock key={"block-" + i} {...block} />)

  let specialLayoutProps
  if (SpecialLayout) {
    specialLayoutProps = Object.fromEntries(
      content.map((block, i) => {
        return [block.props.area || `block-${i}`, block]
      })
    )
  }

  return (
    <>
      {page.noindexNofollow && (
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
      )}
      {!page.hasSidebar ? (
        <Layout {...layoutProps}>
          {SpecialLayout ? (
            <SpecialLayout.Component {...specialLayoutProps} />
          ) : (
            content
          )}
        </Layout>
      ) : (
        <SidebarLayout {...layoutProps}>
          {SpecialLayout ? (
            <SpecialLayout.Component {...specialLayoutProps} />
          ) : (
            content
          )}
        </SidebarLayout>
      )}
    </>
  )
}

export default Page

// Group up blocks of the same type together (allows proper programmatic layout)
function groupBlocks(typename, blocks) {
  let streak = false,
    setIndex = 0
  let sets = []
  blocks.forEach((block, i) => {
    if (block.__typename === typename && !streak) {
      streak = true
      sets[setIndex] = []
      sets[setIndex][0] = i
    } else if (block.__typename !== typename && streak) {
      streak = false
      sets[setIndex][1] = i
      setIndex++
    }
  })

  sets.reverse().forEach(([start, end]) => {
    const blockGroup = blocks.slice(start, end)
    blocks.splice(start, end - start, { __typename: typename, blockGroup })
  })

  return blocks
}

export const query = graphql`
  query SinglePageQuery($slug: String!) {
    datoCmsPage(slug: { eq: $slug }) {
      content {
        ... on DatoCmsIconHeadingLabel {
          id
          icon {
            blurhash
            url
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
          centered
          columns
        }
        ... on DatoCmsQuote {
          id
          quoteText
          quoteAttribution
          backgroundColor {
            hex
          }
          textColor {
            hex
          }
        }
        ... on DatoCmsBasicBlock {
          idHref
          contentNode {
            childMarkdownRemark {
              htmlAst
            }
          }
          area
        }
        ... on DatoCmsButton {
          id
          url
          text
          solid
          color {
            hex
          }
        }
        ... on DatoCmsShortcode {
          id
          name
        }
        ... on DatoCmsHero {
          id
          heroType
          description
          linkText
          linkUrl
        }
        ... on DatoCmsTeammateItem {
          name
          contentNode {
            childMarkdownRemark {
              htmlAst
            }
          }
          linkUrl
        }
        ... on DatoCmsImageArray {
          images {
            url
            customData
          }
          columns
        }
        ... on DatoCmsCarousel {
          contentType
          selectionType
          items {
            ... on DatoCmsNews {
              id
              slug
            }
            ... on DatoCmsEvent {
              id
              slug
            }
            ... on DatoCmsResource {
              id
              link
            }
            ... on DatoCmsKey {
              id
              slug
            }
          }
          id
        }
      }
      hasSidebar
      usesQueries
      noindexNofollow
      id
      title
      slug
      seo {
        title
        description
        image {
          url
        }
      }
    }
  }
`
