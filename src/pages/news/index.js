import React from 'react'
import { graphql } from 'gatsby'
import Layout from "../../components/layout"
import Carousel from '../../components/carousel'
import './news.css'

const News = ({ data }) => (
    <Layout classNames={['fullwidth'] } title='News' description='Get the latest news from around the Ring of Keys theatre world.'
    footerQuoteAttribution='Kristin Kelly, Key Member (she/her)'
    footerQuoteText={
        <blockquote>
            With networks like Ring of Keys, I feel like my queer singing heart has a place 
            and community and I can make work as a queer director.
        </blockquote>
    }>
        {/* <div className='view-all_nav' >
            <h1>News</h1>
            <nav styl={{display: 'none'}}>
                <a href='/'>All</a>
                <a href='/'>RoK News</a>
                <a href='/'>Press</a>
                <a href='/'>Events</a>
            </nav>
        </div> */}
        <div className='section_news bg_white'>
            <h2>Ring of Keys Newsletter</h2>
            <Carousel itemList={ data.newsletters.edges } classNames={['carousel__gray']} />
        </div>
        <div className='section_news bg_white'>
            <h2>Events</h2>
            <Carousel itemList={ data.events.edges } recordType='events' classNames={['carousel__gray']} />
        </div>
        <div className='section_news bg_white'>
            <h2>Press</h2>
            <Carousel itemList={ data.pressReleases.edges } recordType='news' classNames={['carousel__gray']} />
        </div>
    </Layout>
)
export default News

export const query = graphql`
    query NewsPageQuery {
        industryNews: allDatoCmsNews(filter: {newsType: {eq: "industry"}}, limit: 10) {
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
                        alt
                    }
                }
            }
        }
        pressReleases: allDatoCmsNews(filter: {newsType: {eq: "press"}}, limit: 10) {
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
                    alt
                }
                slug
                }
            }
        }
        newsletters: allDatoCmsNews(filter: {newsType: {eq: "newsletter"}}, sort: {fields: publishDate, order: DESC}, limit: 10) {
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
                    alt
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
                        alt
                    }
                    title
                    startTime(formatString: "D MMM YYYY")
                    slug
                }
            }
        }
    }
`