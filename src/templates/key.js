import React, { useState } from 'react'
// import Img from 'gatsby-image'
import { graphql, Link } from 'gatsby'
import Layout from '../components/layout'
import MessagePopup from '../components/messagepopup'
import { renderHtmlToReact } from '../utils/renderHtmlToReact'

import './key.css'
import icon_youtube from '../images/social-icons/icon_youtube.svg'
import icon_instagram from '../images/social-icons/icon_instagram.svg'
import icon_facebook from '../images/social-icons/icon_facebook.svg'
import icon_twitter from '../images/social-icons/icon_twitter.svg'
import icon_linkedin from '../images/social-icons/icon_linkedin.svg'
const socialIcons = {
    youtube: icon_youtube,
    instagram: icon_instagram,
    facebook: icon_facebook,
    twitter: icon_twitter,
    linkedin: icon_linkedin,
}

const colors = ['slate-blue', 'peach-1', 'copper-1', 'gold-1', 'pale-green-1']

export default ({ data }) => {
    const { name,
            id,
            pronouns,
            website,
            socialMedia,
            headshot,
            featuredImage,
            genderIdentity,
            sexualIdentity,
            mainLocation,
            vocalRange,
            discipline,
            bioNode,
            resume,
        } = data.datoCmsKey

    const bodyFields = [
        {label: 'Gender Identity', data: genderIdentity},
        {label: 'Sexual Identity', data: sexualIdentity},
        {label: 'Vocal Range', data: vocalRange},
        {label: 'Discipline', data: discipline},
        {label:'Website', data: website},
    ]

    const [isMessageOpen, setMessageOpen] = useState(false)

    return (
        <Layout classNames={['fullwidth']}>
            <div className='artist_hero'
                style={{ '--grad-rot': Math.random()*360+'deg', '--grad-col-1': `var(--rok-${colors[Math.floor(Math.random()*colors.length)]}_hex)` }}>
                <img src={ headshot.url+'?fit=facearea&faceindex=1&facepad=5&mask=ellipse&w=180&h=180&' } alt={ headshot.title } className='avatar' />
                <div className='artist_bio'>
                    <h1>{ name }</h1>
                    { mainLocation && <p>Based in {mainLocation.replace(', ', ' · ')}</p> }
                    <p>{ pronouns }</p>
                    <button className='btn btn_message' onClick={() => {
                        console.log('attempting to open!')
                        setMessageOpen(true)}}>Message</button>
                </div>
                {socialMedia && (<div className='artist_social-icons'>
                    {socialMedia.map(socialObj => {
                        const mediaPlatform = Object.keys(socialIcons).filter((key) => socialObj.socialMediaLink.includes(key))[0]
                        return (
                        <a href={socialObj.socialMediaLink} rel='noopener noreferrer' target='_blank' className='social-icon' key={mediaPlatform}>
                            <img src={ socialIcons[mediaPlatform] } alt={`${mediaPlatform} icon`} />
                        </a>
                        )}
                    )}
                </div>)}
                { featuredImage && <img src={ featuredImage.url } alt={ featuredImage.alt } className='featured_image' /> }
                <Link to='/directory' className='back_link'><span>Back to Directory</span></Link>
            </div>
            <section className='artist_body'>
                <div className='my_story'>
                    <h2>My Story</h2>
                    { renderHtmlToReact(bioNode.childMarkdownRemark.htmlAst) }
                </div>
                {bodyFields.map(({data, label}) => data && (<>
                    <h3>{ label }</h3>
                    <p>{ !data.includes('http') ? data
                         : <a href={data} rel='noopener noreferrer' target='_blank'>{data}</a> }</p>
                </>))}
                { resume && resume.url && <a className='btn btn_resume' href={ resume.url } rel='noopener noreferrer' target='_blank'>View Resume</a> }
            </section>
            <MessagePopup isOpen={isMessageOpen} artistId={id} onClose={() => setMessageOpen(false)} />
        </Layout>
    )
}

export const query = graphql`
    query KeyQuery($slug: String!) {
        datoCmsKey(slug: { eq: $slug }) {
            name
            id
            pronouns
            headshot {
                url
                title
            }
            featuredImage {
                url
                alt
            }
            email
            website
            socialMedia {
                socialMediaLink
            }
            genderIdentity
            sexualIdentity
            mainLocation
            vocalRange
            discipline
            bioNode {
                childMarkdownRemark {
                    htmlAst
                }
            }
            resume {
                url
            }
        }
    }
`