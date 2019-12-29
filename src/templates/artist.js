import React from 'react'
// import Img from 'gatsby-image'
import { graphql } from 'gatsby'

export default ({ data }) => (
    <article>
        <h1>{ data.datoCmsArtist.name }</h1>
        <p>{ data.datoCmsArtist.pronouns }</p>
        <img src={ data.datoCmsArtist.headshot.url } alt={ data.datoCmsArtist.headshot.alt } />
    </article>
)

export const query = graphql`
    query ArtistQuery($slug: String!) {
        datoCmsArtist(slug: { eq: $slug }) {
            name
            pronouns
            headshot {
                url
                alt
            }
        }
    }
`