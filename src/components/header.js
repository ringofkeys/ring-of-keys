import { Link, useStaticQuery, graphql } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import rok_logo from '../images/rok_logo_beta.png'
import './header.css'
import { getProfile, isAuthenticated, logout } from "../utils/auth"

const Header = ({ path }) => {
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
      <Link to='/apply'>Apply to be a key</Link>
      <Link to='/dashboard' id='btn__login' >Log In</Link>  
    </div>
  )

  if (isAuthenticated() === true) {
    const profile = getProfile()
    const artist = users.data.edges.filter(({node}) => node.name === profile.name)[0].node

    console.log('artist = ', artist)

    secondaryNav = (
      <div className='nav__login'>
        <Link to={'/keys/'+artist.slug} className='login_avatar'>
        <img src={ artist.headshot.url + '?fit=facearea&faceindex=1&facepad=5&mask=ellipse&w=100&h=100&'} alt={ artist.name +' headshot' } />
          { profile.name }
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
        <div>
          { secondaryNav }
          <div className='nav__main'>
            <Link to='/directory' className={ path === '/directory' ? 'active' : '' }>Directory</Link>
            <Link to='/news' className={ path === '/news' ? 'active' : '' }>News</Link>
            <Link to='/consultancy' className={ path === '/consultancy' ? 'active' : '' }>Consultancy</Link>
            {/* <Link to='/resources' className={ path === '/resources' ? 'active' : '' }>Resources</Link> */}
            <Link to='/donate' className={ path === '/donate' ? 'active' : '' }>Donate</Link>
            { (isAuthenticated() === true) ? (
            <div className='dropdown-group'>
              <Link to='/dashboard' className='has-dropdown'>Dashboard</Link>
              <nav className='nav__dropdown'>
                <Link to='/dashboard/settings'>Settings</Link>
              </nav>
            </div>) : (<></>) }
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
