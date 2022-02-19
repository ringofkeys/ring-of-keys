import React from "react"
import Link  from "next/link"
import styles from "./Sidebar.module.css"

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const Sidebar = ({ data }) => {
  if (!data) return ''

  function getMonth(dateString) {
    const dateObj = new Date(dateString)
    return months[dateObj.getMonth()].slice(0, 3)
  }

  function getDate(dateString) {
    const dateObj = new Date(dateString)
    return dateObj.getDate()
  }

  return (
    <aside className={styles.sidebar}>
      <h2 className="visually-hidden">Sidebar</h2>
      <h3>Upcoming Events</h3>
      {data.events.map(event => (
        <Link href={`/events/${event.slug}`} key={event.slug}><a className={styles.event}>
          <div className={styles.date}>
            <span className={styles.month}>{getMonth(event.startTime)}</span>
            <span className={styles.day}>{getDate(event.startTime)}</span>
          </div>
          <h4 className={styles.eventTitle}>{event.title}</h4>
        </a></Link>
      ))}
      <h3>Key Volunteer Team</h3>
      {data.team
        .sort((a, b) => a.keyTeamOrder - b.keyTeamOrder)
        .map((teammate) => (
          <Link href={`/keys/${teammate.slug}`} key={teammate.slug}><a className={styles.teammate}>
            <strong>{teammate.name}</strong> <em>({teammate.pronouns})</em>
            <br />
            <em style={{ color: "#6d7278" }}>{teammate.keyTeamPosition}</em>
            </a></Link>
        ))}
      <h3>Meetup Ambassadors</h3>
      {data.ambassadors
        .sort(
          (a, b) => a.meetupAmbassadorOrder - b.meetupAmbassadorOrder
        )
        .map(ambassador => (
          <Link
            href={`/keys/${ambassador.slug}`}
            key={ambassador.slug}
          >
            <a className={styles.ambassador}>
              <strong>{ambassador.name}</strong> ({ambassador.pronouns.toLowerCase()}) <br />
              <em style={{ color: "#6d7278" }}>{getBestLocationVal(ambassador)}</em>
            </a>
          </Link>
        ))}
    </aside>
  )
}

export default Sidebar

function getBestLocationVal(node) {
  return node.mainLocation
    ? node.mainLocation
    : node.locations.substr(
        0,
        node.locations.indexOf(",") > 0
          ? node.locations.indexOf(",")
          : node.locations.length
      )
}
