import React from 'react'
import { graphql, Link } from 'gatsby'
import SidebarLayout from "../components/SidebarLayout"
import { renderHtmlToReact } from '../utils/renderHtmlToReact'
import './consultancy.css'

const Consultancy = ({ data }) => (
    <SidebarLayout>
        <h1>Ring of Keys Consultancy</h1>
        <blockquote class='quote_graphic-bar'>
            The Ring of Keys Consultancy is a resource for producers, casting directors,
            and theatremakers who are in need of a Gender Consultant
            or Queer Consultant for their theatrical projects.
        </blockquote>
        <p>
            As part of our mission to promote the hiring of queer women, trans, and gender non-conforming
            artists, our consultancy services provide our theatre community with the necessary
            resources for projects with queer & trans themes, while also advocating for our Members. While
            no individual could ever represent the entirety of the queer or transgender communities, these 
            artists are adept at supporting producers in creating these project in an informed and thoughtful way.
        </p>
        <h2 class='txt_center'>What does a gender consultant do?</h2>
        <section className='flex_center' style={{ margin: '1em 0' }}>
            <div className='icon-heading-label' style={{ margin: '1em auto', width: '40%' }}>
                <div className='icon_placeholder'></div>
                <h3>Speaks the Language</h3>
                <p>Provides language support for casting notices, press releases, etc.</p>
            </div>
            <div className='icon-heading-label'>
                <div className='icon_placeholder'></div>
                <h3>Impacts Truth</h3>
                <p>Gives your production the greatest impact to telling a truthful story.</p>
            </div>
            <div className='icon-heading-label'>
                <div className='icon_placeholder'></div>
                <h3>Provides Support</h3>
                <p>Supports playwright / director / dramaturg</p>
            </div>
            <div className='icon-heading-label'>
                <div className='icon_placeholder'></div>
                <h3>Educates</h3>
                <p>Communicates gruidance and provides education for your institution at large, including marketing,
                    company management, front of house, etc.
                </p>
            </div>
            <div className='icon-heading-label'>
                <div className='icon_placeholder'></div>
                <h3>Creates Safe Space</h3>
                <p>Facilitates a safe and supportive environment for queer artists in your production so they can do
                    their best work.
                </p>
            </div>    
        </section>
        {data.allDatoCmsKey.edges.map(({ node }) => (
            <div className='consultant_bio-group'>
                { node.headshot && node.slug
                ? <Link to={`/keys/${ node.slug }`} className='consultant_bio-img'>
                    <img src={ node.headshot.url + '?fit=facearea&faceindex=1&facepad=15&mask=ellipse&w=200&h=200&' } alt={ node.headshot.title } />
                  </Link>
                : <div className='avatar_placeholder'></div> }
                <div className='consultant_bio-heading'>
                    { node.slug && 
                      <Link to={`/keys/${ node.slug }`} className='h2_conversational'>
                        <h2 className='has-arrow'>Meet { node.name }</h2>
                      </Link>
                    }
                    <p>{ node.keyTeamMember ? 'Ring of Keys ' + node.keyTeamPosition : 'Independent Gender Consultant' }</p>
                    { node.website &&
                        <p><a href={ node.website } rel='noopener noreferrer' target='_blank'>
                        { node.website.substr(node.website.indexOf('//')+2, node.website.length) }</a></p>
                    }
                    { node.location && <p><strong>Location: </strong>{ node.location }</p> }
                    { renderHtmlToReact(node.genderconsultantbioNode.childMarkdownRemark.htmlAst) }
                </div>
            </div>
        ))}
        <p>Our Key Consultants have a variety of life experiences, expertise, and experiences consulting in theatre settings.
            They have all been vetted by our Consultancy Director Josephine Kearns. If you are a casting director, theatremaker,
            or producer working on a production that requires a Gender / Queer Consultant, or are looking for a consultant with a
            particular area of expertise or with particular theatrical experience, fill out our form!
        </p>
        <form>
            <label>
                Name
                <input type='text' />
            </label>
            <label>
                Email Address
                <input type='email' />
            </label>
            <fieldset className='pronoun_checkbox-group'>
                <legend>Pronouns (check as many that apply)</legend>
                <label>
                    <input type='checkbox' />
                    She / Her
                </label>
                <label>
                    <input type='checkbox' />
                    They / Them
                </label>
                <label>
                    <input type='checkbox' />
                    Ze / Zir
                </label>
                <label>
                    <input type='checkbox' />
                    He / Him
                </label>
                <label>
                    <input type='checkbox' />
                    Ze / Hir
                </label>
                <label>
                    <input type='checkbox' />
                    Xe / Xir
                </label>
            </fieldset>
            <label>
                Tell us more about the scope of your project and the kind of support your looking for?
                <textarea />
            </label>
            <label></label>
            <button className='btn btn-link_ghost btn_grayed'>Cancel</button>
            <button className='btn btn_has-arrow bg_slate'>Submit</button>
        </form>
        
    </SidebarLayout>
)

export default Consultancy

export const query = graphql`
    query ConsultantsQuery {
        allDatoCmsKey(filter: {isGenderConsultant: {eq: true}}) {
            edges {
                node {
                    name
                    pronouns
                    bio
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
`