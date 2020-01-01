import React from "react"

import './index.css'
// import Img from 'gatsby-image'

import Layout from "../components/layout"
// import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <div className='hero'></div>
    <div className='bar__learn-more'>
      <div>
        <h1 className='heading__inline'>Ring of Keys</h1> is a national network of queer women, trans, and gender non-conforming artists working on and offstage in musical theatre.
      </div>
      <a href='#learn-more' className='btn btn__learn-more'>Learn More</a>
    </div>
  </Layout>
)

export default IndexPage