import React from "react"
import { Link, graphql } from "gatsby"
// import Img from 'gatsby-image'

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = ({ data }) => (
  <Layout>
    <SEO title="Home" />
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
    <Link to="/page-2/">Go to page 2</Link>
    {data.allDatoCmsArtist.edges.map(({ node: artist }) => (
      <div className='artist__card'>
        <figure>
          <Link to={`/artists/${artist.slug}`} className='card__image'>
            <img src={ artist.headshot.url } alt={ artist.name +' headshot' } />
          </Link>
          <figcaption>
    <h3 className='card__title'>{ artist.name }</h3>
          </figcaption>
        </figure>
      </div>
    ))}
  </Layout>
)

export default IndexPage

export const query = graphql`
  query IndexQuery {
    allDatoCmsArtist {
      edges {
        node {
          slug
          name
          headshot {
            url
          }
        }
      }
    }
  }
`