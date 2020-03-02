import React from 'react'
import { graphql, Link } from 'gatsby'
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
    const resourceTypes = []

    console.log('data = ', data.allDatoCmsResource.edges)
    const resources = data.allDatoCmsResource.edges.reduce((acc, { node }) => {
        if (!resourceTypes.find(el => el === node.resourceType)) {
            resourceTypes.push(node.resourceType)
            acc.push([ node ])
        } else {
            acc[acc.findIndex(el => el[0].resourceType === node.resourceType)].push(node)
        }
        return acc
    }, [])
    console.log('resources = ', resources)

    return (
        <Layout title='Resources' description='A compiled list of resources for LGBT+ theatremakers.' classNames={['fullwidth']}>
            <div className='resources-intro'>
                <h1>Resources</h1>
                <p>Ring of Keys offers the resources provided below as an educational tool for the professional theatre community at 
                    large, with a focus on queer and trans issues for/about queer women, trans, and gender non-conforming artists. 
                    This is by no means a complete list of resources - if you have something you’d like to add, please contact us 
                    at <a href='mailto:info@ringofkeys.org'>info@ringofkeys.org</a>. Happy reading, listening, watching, and action taking!
                </p>
            </div>
            { resourceTypes &&
                resourceTypes.map((type, i) => (
                <Carousel classNames={['resource-carousel']}>
                    <div className='resource-title'
                        style={{ '--theme-color': resourceThemes[ i % resourceThemes.length ] }}>
                        <h2>{ type }</h2>
                        <Link to={ `/resources/${ slugify(type) }` } className='category-link'>Explore Category</Link>
                        <p style={{color: 'white', textTransform: 'none'}}>{ resources[i].length } Resources</p>
                    </div>
                    { resourceTypes &&
                        resources[i].map(resource => (
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