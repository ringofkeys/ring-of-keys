import React from 'react'
import parse from 'html-react-parser'
import { Link, graphql, useStaticQuery } from 'gatsby'
import MessageBlock from '../../components/MessageBlock'
import RoKBadge_Web from '../../images/RoKBadge_Web.png'

const Home = ({ user = { name: '', slug: '/directory', headshot: { url: '', title: '' }} }) => {
    const data = useStaticQuery(graphql`
      query MessagesQuery {
        dashboard: datoCmsLandingPage(originalId: { eq: "4610845"}) {
          bodyNode {
            childMarkdownRemark {
              html
            }
          }
          contentBlocks {
            ... on DatoCmsDashboardBlock {
              blockTitle
              content
              area
            }
          }
        }
        allDatoCmsMessage(sort: { fields: meta___firstPublishedAt, order: DESC }) {
          nodes {
            fromEmail
            fromName
            message
            toArtist {
              name
            }
            meta {
              timeDiff: firstPublishedAt(difference: "days")
              timeSince: firstPublishedAt(fromNow: true)
              timeString:firstPublishedAt(formatString: "MM/DD/YY")
            }
          }
        }
      }
    `)
  
    let messages = []
    if (user) {
      messages = data.allDatoCmsMessage.nodes.filter(node => node.toArtist.name === user.name)
    }
  
    return (<>
      <h1>Dashboard</h1>
      <div className='block block_intro'>
        <div>
          <h2>{ user.name }</h2>
          { parse(data.dashboard.bodyNode.childMarkdownRemark.html) }
          <Link to={ '/keys/' + user.slug } className='btn btn-link_ghost'>View / Edit Profile</Link>
        </div>
    { user.headshot && <img src={ user.headshot.url+'?fit=facearea&faceindex=1&facepad=5&mask=ellipse&w=140&h=140&' } alt={ user.headshot.title } className='avatar' /> }
      </div>
      <MessageBlock messages={ messages } />
      <div className='block block_badge'>
        <h2>Ring of Keys Badge</h2>
        <p>
          Click to download your Ring of Keys badge for both web (optimized to use on your 
          website or digital resume) and print (optimized to be printed at 1.5” square on your paper resume or print materials).
        </p>
        <img src={ RoKBadge_Web } alt='Ring of Keys Badge for web' />
        <div className='divider'></div>
        <div className='section_btns'>
          <a href='./RoKBadge_Web.png' className='btn btn-link_ghost bg_copper' download>For Web</a>
          <a href='./RoKBadge_Print.jpg' className='btn' download>For Print</a>
        </div>
      </div>
      <div className='block'>
        <h2>Facebook</h2>
        <p>
          Join our private facebook group for Keys only.
        </p>
        <div className='divider'></div>
        <a href='https://www.facebook.com/groups/141065616564104/' className='btn btn-link_ghost bg_copper' target="_blank" rel='noopener noreferrer'>Go to Facebook</a>
      </div>
      <div className='block'>
        <h2>Key Spotlight</h2>
        <p>
        Submit news on an upcoming job to have featured on the Ring of Keys social platforms at our Key Member News Submission Portal.
        </p>
        <div className='divider'></div>
        <a href='https://forms.gle/gnjjZJ69JDMSYtW8A' className='btn btn-link_ghost bg_copper' target="_blank" rel='noopener noreferrer'>Submit News</a>
      </div>
      <div className='block'>
        <h2>Casting Letter</h2>
        <p>
          Use our Casting Letter to submit to theatre organizations to help advocate for authentic representation and queer the stage.
        </p>
        <div className='divider'></div>
        <a href='https://docs.google.com/document/d/1jQ5rl1SUrvPqGhBkWj_eR1tBIUURjAcxy3-1KQ5-Zls/edit#' className='btn btn-link_ghost bg_copper' target="_blank" rel='noopener noreferrer'>Go to Google Docs</a>
      </div>
      <div className='block'>
        <h2>RoK News</h2>
        <p>
        Stay up to date with our Exclusive Key Monthly Workshop Series and Monthly Meetups by visiting our News page. 
        </p>
        <div className='divider'></div>
        <Link to='/news' className='btn btn-link_ghost bg_copper'>Go to RoK News</Link>
      </div>
      <div className='block flex-center'>
        <h2>More features coming soon!</h2>
        <p>Email <a href='mailto:info@ringofkeys.org'>info@ringofkeys.org</a> if you have any feedback, questions, or concerns!</p>
      </div>
      {/* { data.dashboard.contentBlocks.map((block, i) => (
        <section className={'block' + (block.area ? ` block_${ block.area }` : '')} key={'block'+i}>
          <h2>{ block.blockTitle }</h2>
          { parse(block.content) }
        </section>
      )) } */}
  </>)
  }
export default Home  