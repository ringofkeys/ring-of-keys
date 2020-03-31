import React from 'react'
import { renderHtmlToReact } from '../utils/renderHtmlToReact'
import './donate.css'
import SidebarLayout from "../components/sidebarlayout"
import './apply.css'
import { element } from 'prop-types'

const Donate = ({ data }) => {
    const bodyContent = data.pageContent.bodyNode.childMarkdownRemark.htmlAst

    // add in Blockquote classes
    const blockQuotes = bodyContent.children.filter(elem => elem.tagName === 'blockquote')
    if (blockQuotes.length > 0) {
        blockQuotes.forEach(quote => quote.properties.class = 'quote_graphic-bar')
    }

    // add Donate link styles
    const donateLink = bodyContent.children.find(elem => elem.type === 'element' && elem.children.length > 0
        && elem.children[0].tagName === 'a' && elem.children[0].children.length > 0 && elem.children[0].children[0].value.toLowerCase().includes('donate'))
    donateLink.children[0].properties = Object.assign(donateLink.children[0].properties, {
       class: donateLink.children[0].properties.class + ' btn bg_slate',
       rel: 'norefferrer noopener',
       target: '_blank',
    })

    return (
        <SidebarLayout classNames={['donate']} title='Donate' description={`Your tax-deductible donation supports Ring of Key's mission to promote the hiring of self-identifying 
        queer women and TGNC artists in the musical theatre industry.`}>
            <h1>Donate</h1>
            { renderHtmlToReact(bodyContent) }
        </SidebarLayout>
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
        }
    }
`