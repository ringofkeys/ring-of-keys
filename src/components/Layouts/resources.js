import React from 'react'
import { useStaticQuery, graphql, Link } from 'gatsby'
import Carousel from '../carousel'
import ResourceCard from '../resourcecard'
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


const Resources = ({ intro, outro }) => {
    const data = useStaticQuery(graphql`
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
    `)

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

    return (<>
            <div className='resources-intro'>
                <h1>Resources</h1>
                { intro }
            </div>
            { resources &&
                resources.map(({ type, resources: resourceList }, i) => (
                <Carousel classNames={['resource-carousel']} style={{ '--theme-color': resourceThemes[ i % resourceThemes.length ] }}>
                    <div className='resource-title' style={{ '--theme-color': resourceThemes[ i % resourceThemes.length ] }}>
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
            <section className='resource-annotation'>
                { outro }
            </section>
    </>)
}
export default Resources
