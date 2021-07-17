import React from 'react'
import { graphql, Link, useStaticQuery } from 'gatsby'
import { renderHtmlToReact } from '../utils/renderHtmlToReact'


const ConsultantBios = () => {
    const data = useStaticQuery(graphql`
        query ConsultantsQuery {
            allDatoCmsKey(filter: {isGenderConsultant: {eq: true}}, sort: {fields: genderConsultantOrder, order: ASC}) {
                edges {
                    node {
                        name
                        pronouns
                        bio
                        locations
                        keyTeamMember
                        keyTeamPosition
                        website
                        genderconsultantbioNode {
                            childMarkdownRemark {
                                htmlAst
                            }
                        }
                        headshot {
                            url
                            title
                        }
                        slug
                    }
                }
            }
        }
    `)
    
    return <section className='section_consultant-bios' >
        {data.allDatoCmsKey.edges.map(({ node }) => (
            <div className='consultant_bio-group'>
                { node.slug && 
                <Link to={`/keys/${ node.slug }`} className='consultant_bio-heading h2_conversational'>
                    {node.headshot && 
                    <img className='consultant_bio-img' src={ node.headshot.url + '?fit=facearea&faceindex=1&facepad=15&mask=ellipse&w=150&h=150&' } alt={ node.headshot.title } />
                    }
                    <div>
                        <h2>{ node.name }</h2>
                        <p>{ node.keyTeamMember ? 'Ring of Keys ' + node.keyTeamPosition : 'Ring of Keys Consultant' }</p>
                    </div>
                </Link>
                }
                <div className='consultant_bio-body'>
                    { node.pronouns &&
                        <p><strong>Pronouns:</strong> { node.pronouns }</p>
                    }
                    { node.locations && <p><strong>Location: </strong>{ node.locations }</p> }
                    { renderHtmlToReact(node.genderconsultantbioNode.childMarkdownRemark.htmlAst) }
                    { node.website &&
                        <p><a href={ node.website } rel='noopener noreferrer' target='_blank'>
                        { node.website.substr(node.website.indexOf('//')+2, node.website.length) }</a></p>
                    }
                </div>
            </div>
        ))}
    </section>
}

export default ConsultantBios