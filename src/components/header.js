import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import rok_logo from '../images/rok_logo.png'
import './header.css'

const Header = ({ siteTitle }) => (
  <header>
    <nav className='top-nav' >
      <Link to='/' className='site-logo' >
        <img src={ rok_logo } alt='Ring of Keys' />
      </Link>
      <div>
        <div className='nav__login'>
          <Link to='/apply'>Apply to be a key</Link>
          <Link to='/dashboard' id='btn__login' >Log In</Link>  
        </div>
        <div className='nav__main'>
          <Link to='/artists'>Directory</Link>
          <Link to='/news'>News</Link>
          <Link to='/consultancy'>Consultancy</Link>
          <Link to='/resources'>Resources</Link>
          <Link to='/donate'>Donate</Link>
        </div>
      </div>
    </nav>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
