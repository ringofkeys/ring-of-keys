import React from 'react'
import { Link, graphql, useStaticQuery } from 'gatsby'
import RoKBadge_Web from '../../images/RoKBadge_Web.png'

const Home = ({ user = { name: '', slug: '/directory', headshot: { url: '', title: '' }} }) => {
    const data = useStaticQuery(graphql`
      query MessagesQuery {
        allDatoCmsMessage {
          edges {
            node {
              fromEmail
              fromName
              message
              toArtist {
                name
              }
            }
          }
        }
      }
    `)
  
    let messages = []
    if (user) {
      messages = data.allDatoCmsMessage.edges.filter(({ node }) => node.toArtist.name === user.name)
    }
  
    return (<>
      <h1>Dashboard</h1>
      <div className='block block_intro'>
        <div>
          <h2>{ user.name }</h2>
          <p>
            Welcome to the Key Member dashboard! Here you can find access to Members Only content like our Proud Member: 
            Ring of Keys badges to use on your website, resumé, or portfolio.
          </p>
          <Link to={ '/keys/' + user.slug } className='btn btn-link_ghost'>View / Edit Profile</Link>
        </div>
        <img src={ user.headshot.url+'?fit=facearea&faceindex=1&facepad=5&mask=ellipse&w=140&h=140&' } alt={ user.headshot.title } className='avatar' />
      </div>
      <div className='block block_messages'>
        <h2>Messages</h2>
        { (messages.length > 0)
        ? messages.map(({node: message}) => (
          <div className='message'>
            <h3>From: { message.fromName }</h3>
            <a href={`mailto:${ message.fromEmail }`}>{ message.fromEmail }</a>
            <p>{ message.message }</p>
          </div>
        ))
        : <p>No messages yet!</p>
        }
      </div>
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
  </>)
  }
export default Home  