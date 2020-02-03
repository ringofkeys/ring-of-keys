import React, { useState } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import PropTypes from "prop-types"
import rok_logo from '../images/rok_logo_beta.png'
import './header.css'
import { getProfile, isAuthenticated, logout } from "../utils/auth"

const Header = ({ path }) => {
  const [isNavOpen, setNavOpen] = useState(false)

  const users = useStaticQuery(graphql`
    query HeaderLoggedInQuery {
      data: allDatoCmsKey{
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
    }
    `)

  let secondaryNav = (
    <div className='nav__login'>
      <Link to='/apply' className={isNavOpen ? 'btn btn-link_ghost' : ''}>Apply to be a key</Link>
      <Link to='/dashboard' id='btn__login' >Log In</Link>  
    </div>
  )

  if (isAuthenticated() === true) {
    const profile = getProfile()
    const artist = users.data.edges.filter(({node}) => node.name === profile.name)[0].node

    secondaryNav = (
      <div className='nav__login'>
        <Link to='/dashboard' className='login_avatar'>
          <img src={ artist.headshot.url + '?fit=facearea&faceindex=1&facepad=5&mask=ellipse&w=100&h=100&'} alt={ artist.name +' headshot' } />
          { profile.name }
          <span className='tooltip'>My Account</span>
        </Link>
        {/* <Link to='/dashboard' id='btn__login'>Dashboard</Link> */}
        <a href='#logout' onClick={e => {
            logout()
            e.preventDefault()
        }}>Log Out</a>
      </div>
    )
  }

  return (
    <header>
      <button className='visually-hidden' onClick={() => document.querySelector('#main-content').focus()}>Skip to main content</button>
      <nav className='top-nav' >
        <Link to='/' className='site-logo' >
          <img src={ rok_logo } alt='Ring of Keys' />
        </Link>
        <button className={'hamburger ' + (isNavOpen ? 'open' : 'closed')} onClick={() => setNavOpen(!isNavOpen)}>
          <svg viewBox="0 0 10 10">
            <path d="M 1 5, l 8 0"></path>
            <path d="M 1 1, l 8 0"></path>
            <path d="M 1 9, l 8 0"></path>
          </svg>
        </button>
        <div className={'nav__mobile-wrap ' + (isNavOpen ? 'open' : 'closed')}>
          { secondaryNav }
          <div className='nav__main'>
            <Link to='/directory' className={ path === '/directory' ? 'active' : '' }>Directory</Link>
            <Link to='/news' className={ path === '/news' ? 'active' : '' }>News</Link>
            <Link to='/consultancy' className={ path === '/consultancy' ? 'active' : '' }>Consultancy</Link>
            {/* <Link to='/resources' className={ path === '/resources' ? 'active' : '' }>Resources</Link> */}
            <Link to='/donate' className={ path === '/donate' ? 'active' : '' }>Donate</Link>
            { (isAuthenticated() === true) 
              ? <Link to='/dashboard' className='has-dropdown'>Dashboard</Link>
              : <Link to='/contact' className={ path === '/contact' ? 'active' : '' }>Contact</Link>
            }
          </div>
        </div>
      </nav>
    </header>
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
  path: '',
}

export default Header
