import React from 'react'
// import Img from 'gatsby-image'
import { graphql } from 'gatsby'
import Layout from '../components/layout'

export default ({ data }) => {
    const { name, pronouns, email, headshot } = data.datoCmsKey
    return (
        <Layout>
            <h1>{ name }</h1>
            <p>{ pronouns }</p>
            <p>{ email}</p>
            <img src={ headshot.url } alt={ headshot.alt } />
        </Layout>
    )
}

export const query = graphql`
    query KeyQuery($slug: String!) {
        datoCmsKey(slug: { eq: $slug }) {
            name
            pronouns
            headshot {
                url
                alt
            }
        }
    }
`