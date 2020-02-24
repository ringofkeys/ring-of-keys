import React, { useState } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import PropTypes from "prop-types"
import rok_logo from '../images/rok_logo.png'
import MenuIcon from './menuicon'
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
    const artistsFiltered = users.data.edges.filter(({node}) => node.name === profile.name)
    const artist = artistsFiltered[0] ? artistsFiltered[0].node : ''

    secondaryNav = (
      <div className='nav__login'>
        <div className='login_wrap'>
          <Link to='/dashboard' className='login_avatar'>
            {artist && 
              <img src={ artist.headshot.url + '?fit=facearea&faceindex=1&facepad=5&mask=ellipse&w=100&h=100&'} alt={ artist.name +' headshot' } />
            }
            { profile.name }
            <span className='tooltip'>My Account</span>
          </Link>
          <a href='#logout' onClick={e => {
              logout()
              e.preventDefault()
          }}>Log Out</a>
        </div>
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
        <MenuIcon onClick={() => setNavOpen(!isNavOpen)} className='hamburger' />
        <div className={'nav__mobile-wrap ' + (isNavOpen ? 'open' : 'closed')}>
          { secondaryNav }
          <div className='nav__main'>
            <Link to='/directory' className={ path === '/directory' ? 'active' : '' }>Directory</Link>
            <Link to='/news' className={ path === '/news' ? 'active' : '' }>News</Link>
            <Link to='/consultancy' className={ path === '/consultancy' ? 'active' : '' }>Consultancy</Link>
            <Link to='/resources' className={ path === '/resources' ? 'active' : '' }>Resources</Link>
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
