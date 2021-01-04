import React from 'react'
// import Img from 'gatsby-image'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import PageBlock from '../components/PageBlock.js'
import './event.css'
import SidebarLayout from '../components/sidebarlayout'

export default ({ data: { datoCmsPage: page } }) => {
    console.log('API data', page)
    const footerQuote = page.content.find(block => block.__typename === 'DatoCmsQuote')

    groupIconBlocks(page.content)

    console.log(footerQuote)

    let layoutProps = {
        classNames: ['landing-page', 'title', page.slug],
    }
    
    if (page.seo) {
        layoutProps.title = page.seo.title
        layoutProps.description = page.seo.description
    }
    if (footerQuote) {
        layoutProps = { ...layoutProps,
            footerQuoteAttribution: footerQuote.quoteAttribution,
            footerQuoteText: <blockquote>{ footerQuote.quoteText }</blockquote>,
            footerQuoteBgColor: (footerQuote.backgroundColor) ? footerQuote.backgroundColor.hex : '',
            footerTextColor: (footerQuote.textColor) ? footerQuote.textColor.hex : '',
        }
    }

    const content = <>
        { page.content.filter(block => block.__typename !== 'DatoCmsQuote').map(block => <PageBlock { ...block } />) }
    </>

    return ((!page.hasSidebar)
        ? <Layout { ...layoutProps }>{ content }</Layout>
        : <SidebarLayout { ...layoutProps }>{ content }</SidebarLayout>
    )
}

// Group up Icon Heading Label blocks together (allows proper programmatic layout)
function groupIconBlocks(blocks) {
    let streak = false, setIndex = 0
    let iconSets = []
    blocks.forEach((block, i) => {
        if (block.__typename === 'DatoCmsIconHeadingLabel' && !streak) {
            streak = true
            iconSets[setIndex] = []
            iconSets[setIndex][0] = i
        } else if (block.__typename !== 'DatoCmsIconHeadingLabel' && streak) {
            streak = false
            iconSets[setIndex][1] = i
        }
    })

    iconSets.forEach(([start, end]) => {
        const blockGroup = blocks.slice(start, end)
        blocks.splice(start, end-start, { __typename: 'DatoCmsIconHeadingLabel', blockGroup })
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
                    id
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
            }
            hasSidebar
            id
            title
            slug
            seo {
                title
                description
            }
        }
    }
`