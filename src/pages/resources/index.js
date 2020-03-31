import React from 'react'
import { graphql, Link } from 'gatsby'
import { renderHtmlToReact } from '../../utils/renderHtmlToReact'
import Layout from "../../components/layout"
import Carousel from '../../components/carousel'
import ResourceCard from '../../components/resourcecard'
import slugify from '../../utils/slugify'
import './resources.css'
const resourceThemes = [
    'var(--rok-gold-1_hex)',
    'var(--rok-pale-green-1_hex)',
    'var(--rok-slate-blue_hex)',
    'var(--rok-peach-1_hex)',
    'var(--rok-copper-1_hex)',
    '#494949',
]


const Resources = ({ data }) => {
    const resourceTypes = ['Advocacy & Access', 'Reading', 'Podcasts', 'Videos', 'Tools & Directories', 'Organizations']

    const resources = data.allDatoCmsResource.edges.reduce((acc, { node }) => {
        if (!resourceTypes.find(el => el === node.resourceType)) {
            resourceTypes.push(node.resourceType)
            acc.push({ type: node.resourceType, resources: [node]})
        } else {
            acc[acc.findIndex(resource => resource.type === node.resourceType)].resources.push(node)
        }
        return acc
    }, resourceTypes.map(val => { return { type: val, resources: [] } }))

    const numResources = resources && resources.reduce((acc, r) => acc + r.resources.length, 0)
    const approxNumResources = numResources && (numResources - numResources % 5)

    return (
        <Layout title='Resources' description={`A curated list of ${ approxNumResources ? approxNumResources : 50 }+ queer resources for theatremakers.`} classNames={['fullwidth']}>
            <div className='resources-intro'>
                <h1>Resources</h1>
                { renderHtmlToReact(data.pageContent.bodyNode.childMarkdownRemark.htmlAst) }
            </div>
            { resources &&
                resources.map(({ type, resources: resourceList }, i) => (
                <Carousel classNames={['resource-carousel']}>
                    <div className='resource-title'
                        style={{ '--theme-color': resourceThemes[ i % resourceThemes.length ] }}>
                        <h2>{ type }</h2>
                        <Link to={ `/resources/${ slugify(type) }` } className='category-link'>Explore Category</Link>
                        <p style={{color: 'white', textTransform: 'none'}}>{ resourceList.length } Resources</p>
                    </div>
                    { resourceList &&
                        resourceList.map(resource => (
                            <ResourceCard title={ resource.title } description={ resource.description } href={ resource.link }
                            color={ resourceThemes[ resourceTypes.findIndex(el => el === resource.resourceType) % resourceThemes.length ] }/>
                        ))
                    }
                </Carousel>
            ))}
            <p className='resource-annotation'>
                This list was compiled by Key Member <Link to='/keys/devon-hayakawa'>Devon Hayakawa</Link>, 
                a Chicago-based Performer, playwright, and dramaturg. 
            </p>
        </Layout>
    )
}
export default Resources

export const query = graphql`
query ResourceQuery {
    pageContent: datoCmsLandingPage(title: { eq: "Resources" }) {
        bodyNode {
            childMarkdownRemark {
                htmlAst
            }
        }
    }
    allDatoCmsResource {
        edges {
            node {
                title
                description
                link
                resourceType
            }
        }
    }
}
`