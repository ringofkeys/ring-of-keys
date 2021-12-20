import React, { useState } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import PropTypes from "prop-types"
import { decodeHtmlEntity } from "../utils/htmlEntity.js"
import rok_logo from "../images/rok_logo.png"
import MenuIcon from "./menuicon"
import "./header.css"
import { getProfile, isAuthenticated, logout } from "../utils/auth"

const Header = ({ path }) => {
  const [isNavOpen, setNavOpen] = useState(false)

  const { users, menu } = useStaticQuery(graphql`
    query HeaderUserQuery {
      users: allDatoCmsKey {
        edges {
          node {
            name
            headshot {
              url
            }
            slug
          }
        }
      }
      menu: datoCmsMenu(label: { eq: "Top Nav" }) {
        id
        treeChildren {
          id
          label
          link
          position
          treeChildren {
            id
            label
            link
            position
            image {
              url
              alt
            }
            description
            ctaText
          }
        }
      }
    }
  `)

  let secondaryNav = (
    <div className="nav__login">
      <Link to="/apply" className={isNavOpen ? "btn btn-link_ghost" : ""}>
        Apply to be a key
      </Link>
      <Link to="/dashboard" id="btn__login">
        Log In
      </Link>
    </div>
  )

  if (isAuthenticated() === true) {
    const profile = getProfile()
    if (profile.name) {
      profile.name = decodeHtmlEntity(profile.name)
    }
    const artistsFiltered = users.edges.filter(
      ({ node }) => node.name === profile.name
    )
    const artist = artistsFiltered[0] ? artistsFiltered[0].node : ""

    secondaryNav = (
      <div className="nav__login">
        <div className="login_wrap">
          <Link to="/dashboard" className="login_avatar">
            {artist && (
              <img
                src={
                  artist.headshot.url +
                  ((artist.headshot.url.indexOf("?") > -1) ? "&" : "?") +
                  "fit=facearea&faceindex=1&facepad=5&mask=ellipse&w=100&h=100&"
                }
                alt={artist.name + " headshot"}
              />
            )}
            {profile.name}
            <span className="tooltip">My Account</span>
          </Link>
          <a
            href="#logout"
            onClick={e => {
              logout()
              e.preventDefault()
            }}
          >
            Log Out
          </a>
        </div>
      </div>
    )
  }

  return (
    <header>
      <button
        className="visually-hidden"
        onClick={() => document.querySelector("#main-content").focus()}
      >
        Skip to main content
      </button>
      <nav className={"top-nav " + (isNavOpen ? "open" : "closed")}>
        <div className="top__inner">
          <Link to="/" className="site-logo">
            <img src={rok_logo} alt="Ring of Keys" />
          </Link>
          <MenuIcon
            onClick={() => setNavOpen(!isNavOpen)}
            className="hamburger"
          />
        </div>
        <div className={"nav__mobile-wrap"}>
          {secondaryNav}
          <ul className="nav__main">
            {menu.treeChildren
              .sort((a, b) => a.position - b.position)
              .map((menu, i) => (
                <NavLink path={path} {...menu} key={"navlink-" + i} />
              ))}
            {isAuthenticated() === true ? (
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
            ) : (
              ""
            )}
          </ul>
        </div>
      </nav>
    </header>
  )
}

function NavLink({ path, label, link, treeChildren }) {
  return (
    <li className="nav__dropdown-wrapper">
      <Link
        to={link}
        className={"has-dropdown " + (path === link ? "active" : "")}
      >
        {label}&nbsp;
        {treeChildren.length ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            viewBox="0 0 10 7"
            fill="none"
          >
            <path
              d="M4.71471 6.7608L9.42199 0.760803H0.00744629L4.71471 6.7608Z"
              fill="currentColor"
            />
          </svg>
        ) : (
          ""
        )}
      </Link>
      {treeChildren.length > 0 && (
        <div
          className="nav__dropdown"
          style={{ "--cols": treeChildren.length }}
        >
          {treeChildren.map((navItem, j) => (
            <Link to={navItem.link} className="dropdown-item">
              <div className="dropdown-item-img-wrap">
                <img src={navItem.image.url} alt={navItem.image.alt} />
              </div>
              <div className="dropdown-item-content">
                <p className="dropdown-item-title">{navItem.label}</p>
                <p className="dropdown-item-description">
                  {navItem.description}
                </p>
                <p className="dropdown-item-cta">{navItem.ctaText}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </li>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
  isLoggedIn: PropTypes.bool,
  path: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
  isLoggedIn: false,
  path: "",
}

export default Header
