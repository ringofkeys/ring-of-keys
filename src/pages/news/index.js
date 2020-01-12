import React from 'react'
import { graphql } from 'gatsby'
import Layout from "../../components/layout"
import Carousel from '../../components/carousel'
import './news.css'

const News = ({ data }) => (
    <Layout classNames={['fullwidth']}>
        <div className='view-all_nav'>
            <h1>News</h1>
            <nav>
                <a href='#'>All</a>
                <a href='#'>RoK News</a>
                <a href='#'>Press</a>
                <a href='#'>Events</a>
            </nav>
        </div>
        <div className='section_news bg_white'>
            <h2>Industry News</h2>
            <Carousel itemList={ data.industryNews.edges } classNames={['carousel__gray']} />
        </div>
        <div className='section_news bg_white'>
            <h2>Press Releases</h2>
            <Carousel itemList={ data.pressReleases.edges } recordType='news' classNames={['carousel__gray']} />
        </div>
        <div className='section_news bg_white'>
            <h2>Events</h2>
            <Carousel itemList={ data.events.edges } recordType='events' classNames={['carousel__gray']} />
        </div>
    </Layout>
)
export default News

export const query = graphql`
    query NewsPageQuery {
        industryNews: allDatoCmsNews(filter: {isExternalNews: {eq: true}}, limit: 10) {
            edges {
              node {
                isExternalNews
                externalUrl
                bodyNode {
                    childMarkdownRemark {
                        excerptAst(truncate: true, pruneLength: 100)
                    }
                }
                title
                    featuredImage {
                        url
                    }
                }
            }
        }
        pressReleases: allDatoCmsNews(filter: {isExternalNews: {eq: false}}, limit: 10) {
            edges {
              node {
                isExternalNews
                externalUrl
                bodyNode {
                    childMarkdownRemark {
                        excerptAst(truncate: true, pruneLength: 100)
                    }
                }
                title
                featuredImage {
                    url
                }
                slug
                }
            }
        }
        events: allDatoCmsEvent(limit: 10, sort: {fields: startTime, order: ASC}) {
            edges {
                node {
                    descriptionNode {
                        childMarkdownRemark {
                            excerptAst(pruneLength: 100, truncate: false)
                        }
                    }
                    featuredImage {
                        url
                    }
                    title
                    startTime(formatString: "D MMM YYYY")
                    slug
                }
            }
        }
    }
`