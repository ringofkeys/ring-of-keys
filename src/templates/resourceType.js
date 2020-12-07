import React from 'react'
import Layout from '../components/layout'
import ResourceCard from '../components/resourcecard'
import './resourceType.css'
const resourceThemes = [
    'var(--rok-gold-1_hex)',
    'var(--rok-pale-green-1_hex)',
    'var(--rok-slate-blue_hex)',
    'var(--rok-peach-1_hex)',
    'var(--rok-copper-1_hex)',
    '#494949',
]

const ResourceType = ({ pageContext: context }) => {

    return (
        <Layout title={`Resources - ${ context.resourceType }`} description={`We've compiled a list of ${ context.resources.length } ${ context.resourceType.toLowerCase() } resources for LGBT+ theatremakers to access.`}>
            { context.resourceType && <h1>{ context.resourceType }</h1>}
            <div class='resource-grid'>
                { context.resources && context.resources.map(resource => (
                    <ResourceCard title={ resource.title } description={ resource.description } href={ resource.link }
                        color={ resourceThemes[ context.typeIndex % (resourceThemes.length-1) ] } />
                ))}
            </div>
        </Layout>
    )
}
export default ResourceType