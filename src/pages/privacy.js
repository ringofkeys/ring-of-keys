import React from 'react'
import { renderHtmlToReact } from '../utils/renderHtmlToReact'
import Layout from '../components/layout'

const Privacy = ({ data }) => {
    const bodyContent = data.pageContent.bodyNode.childMarkdownRemark.htmlAst

    return (<Layout title='Privacy Policy' description='The privacy policy of Ring of Keys organization.'>
        <h1 style={{ margin: '2em 0' }}>Privacy Policy</h1>
        
        { renderHtmlToReact(bodyContent) }
    </Layout>)
}

export const query = graphql`
    query PrivacyPolicy {
        pageContent: datoCmsLandingPage(title: { eq: "Privacy Policy" }) {
            bodyNode {
                childMarkdownRemark {
                    htmlAst
                }
            }
        }
    }
`

export default Privacy