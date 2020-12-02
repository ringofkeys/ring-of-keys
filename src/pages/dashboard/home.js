import React, { useReducer } from 'react'
import parse from 'html-react-parser'
import { Link, graphql, useStaticQuery } from 'gatsby'
import MessageBlock from '../../components/MessageBlock'
import dashboardReducer from './dashboardReducer'
import KeyshipPopup from '../../components/KeyshipPopup'

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

    const initialState = {
      popupOpen: '',
    }

    const [ state, dispatch ] = useReducer(dashboardReducer, initialState)
  
    return (<>
      <h1>Dashboard</h1>
      <div className='block block_intro'>
        <div>
          <h2>{ user.name }</h2>
          { parse(data.dashboard.bodyNode.childMarkdownRemark.html) }
          <Link to={ '/keys/' + user.slug } className='btn btn-link_ghost'>View / Edit Profile</Link>
          <button className='btn btn_message' onClick={ () => dispatch({ action: 'TOGGLE_POPUP', name: 'keyship' }) }>Manage Keyship</button>
        </div>
    { user.headshot && <img src={ user.headshot.url+'?fit=facearea&faceindex=1&facepad=5&mask=ellipse&w=140&h=140&' } alt={ user.headshot.title } className='avatar' /> }
      </div>
      <MessageBlock messages={ messages } />
      { data.dashboard.contentBlocks.map((block, i) => (
        <section className={'block' + (block.area ? ` block_${ block.area }` : '')} key={'block'+i}>
          <h2>{ block.blockTitle }</h2>
          { parse(block.content) }
        </section>
      )) }
      <KeyshipPopup isOpen={ state.popupOpen === 'keyship' } />
  </>)
  }
export default Home  