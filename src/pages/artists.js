import React from 'react'
import Layout from "../components/layout"
import { Link, graphql } from "gatsby"
import './artists.css'

const Artists = ({ data }) => (
    <Layout>
        <h1>Artists</h1>
        <section className='key__grid'>
            {data.allDatoCmsKey.edges.map(({ node: key }, i) => (
                <Link to={`/keys/${key.slug}`} className='key__card' key={'key-'+i}>
                    <figure>
                        <div className='card__img'>
                            <img src={ key.headshot.url + '?fit=facearea&faceindex=1&facepad=5&mask=ellipse&w=130&h=130&'} alt={ key.name +' headshot' } />
                        </div>
                        <figcaption>
                            <h3 className='card__title'>{ key.name }</h3>
                        </figcaption>
                    </figure>
                </Link>
            ))}
        </section>
    </Layout>
)

export default Artists


export const query = graphql`
  query IndexQuery {
    allDatoCmsKey {
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