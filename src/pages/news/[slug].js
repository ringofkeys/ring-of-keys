import { newsItemQuery } from "queries/news"
import React from "react"
// import Img from 'gatsby-image'
import Layout from "../components/layout"
import { renderHtmlToReact } from "../utils/renderHtmlToReact"

export default function NewsEntry({ data }) {
  const { title, featuredImage, description } = data.event
  return (
    <Layout>
      <h1>{title}</h1>
      {featuredImage && 
        <img src={featuredImage.url} alt={featuredImage.alt} /> }
      {description && description }
    </Layout>
  )
}

export async function getStaticProps(context) {
  const data = await request({
    query: newsItemQuery,
    variables: {
      slug: context.params.slug,
    },
  })

  console.log(data)

  return {
    props: data,
  }
}