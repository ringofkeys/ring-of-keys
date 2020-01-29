import React from 'react'
import { Link, useStaticQuery } from 'gatsby'
import './sidebar.css'

const Sidebar = () => {
    const data = useStaticQuery(graphql`
    query SidebarQuery {
        events: allDatoCmsEvent(limit: 4, sort: {fields: startTime, order: ASC}) {
          edges {
            node {
              title
              startTime
              slug
            }
          }
        }
        team: allDatoCmsKey(
          filter: {
              keyTeamMember: {
              eq: true
            }
          }) {
          edges {
            node {
              name
              slug
              keyTeamPosition
              keyTeamOrder
              pronouns
            }
          }
        }
        ambassadors:allDatoCmsKey(limit: 8, filter: {
          isMeetupAmbassador: {
            eq: true
          }
        }) {
          edges {
            node {
              name
              pronouns
              locations
              slug
            }
          }
        }
      }
    `)

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    function getMonth(dateString) {
      const dateObj = new Date(dateString)
      return months[dateObj.getMonth()].slice(0,3)
    }

    function getDate(dateString) {
        const dateObj = new Date(dateString)
        return dateObj.getDate()
    }

    return (
        <aside className='sidebar'>
            <h2 className='visually-hidden'>Sidebar</h2>
            <h3>Upcoming Events</h3>
            {data.events.edges.map(({ node }) => (
                <Link to={`/events/${node.slug}`} className='event' key={node.slug}>
                    <div className='date'>
                      <span className='month'>{ getMonth(node.startTime) }</span> 
                      <span className='day'>{ getDate(node.startTime) }</span>
                    </div>
                    <h4>{ node.title }</h4>
                </Link>
            ))}
            <h3>Key Volunteer Team</h3>
            {data.team.edges.sort((a,b) => a.node.keyTeamOrder - b.node.keyTeamOrder)
            .map(({ node }) => (
                <Link to={`/keys/${node.slug}`} className='teammate' key={node.slug}>
                  <strong>{ node.name }</strong> <em>({ node.pronouns })<br/>{ node.keyTeamPosition }</em>
                </Link>
            ))}
            <h3>Meetup Ambassadors</h3>
            {data.ambassadors.edges.map(({ node }) => (
              <Link to={`/keys/${node.slug}`} className='ambassador' key={node.slug}>
                <strong>{ node.name }</strong> ({ node.pronouns.toLowerCase() }) <br/>{ node.locations.substr(0, ((node.locations.indexOf(',') > 0) ? node.locations.indexOf(',') : node.locations.length)) }
              </Link>
            ))}
        </aside>
    )
}

export default Sidebar