import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import rok_logo from '../images/rok_logo.png'
import './header.css'
import { getProfile, isAuthenticated, logout } from "../utils/auth"

const Header = ({ siteTitle, isLoggedIn }) => {
  let secondaryNav = (
    <div className='nav__login'>
      <Link to='/apply'>Apply to be a key</Link>
      <Link to='/dashboard' id='btn__login' >Log In</Link>  
    </div>
  )

  if (isAuthenticated() === true) {
    const profile = getProfile()

    secondaryNav = (
      <div className='nav__login'>
        <span>
          { profile.name }
        </span>
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
      <nav className='top-nav' >
        <Link to='/' className='site-logo' >
          <img src={ rok_logo } alt='Ring of Keys' />
        </Link>
        <div>
          { secondaryNav }
          <div className='nav__main'>
            <Link to='/artists'>Directory</Link>
            <Link to='/news'>News</Link>
            <Link to='/consultancy'>Consultancy</Link>
            <Link to='/resources'>Resources</Link>
            <Link to='/donate'>Donate</Link>
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
}

Header.defaultProps = {
  siteTitle: ``,
  isLoggedIn: false,
}

export default Header
