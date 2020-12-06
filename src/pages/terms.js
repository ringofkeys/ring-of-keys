import React from 'react'
import { graphql } from 'gatsby'
import { renderHtmlToReact } from '../utils/renderHtmlToReact'
import Layout from '../components/layout'

const Terms = ({ data }) => {
    const bodyContent = data.pageContent.bodyNode.childMarkdownRemark.htmlAst

    const h1Headings = bodyContent.children.filter(elem => elem.tagName === 'blockquote')
    h1Headings.forEach(heading => heading.style = `margin: 2em 0;`)
    
    return (<Layout title='Terms & Conditions' description='The membership terms & conditions for the Ring of Keys organization.'>
        { renderHtmlToReact(bodyContent) }
    </Layout>)
}

export const query = graphql`
    query TermsService {
        pageContent: datoCmsLandingPage(title: { eq: "Terms and Conditions" }) {
            bodyNode {
                childMarkdownRemark {
                    htmlAst
                }
            }
        }
    }
`

export default Terms