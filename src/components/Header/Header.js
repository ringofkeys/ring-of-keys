import { useState } from "react"
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from "next/link"
import styles from "./header.module.css"

// TODO: Reimplement Auth as context
// import { getProfile, isAuthenticated, logout } from "../utils/auth"
// import { decodeHtmlEntity } from '../utils/htmlEntity.js'

const Header = ({ path }) => {
  const [isNavOpen, setNavOpen] = useState(false)

  let secondaryNav = (
    <div className={styles["nav__login"]}>
      <Link href="/apply" className={isNavOpen ? "btn btn-link_ghost" : ""}>
        <a>Apply to be a key</a>
      </Link>
      <button onClick={() => signIn('auth0', { callbackUrl: 'http://localhost:3000/dashboard' })} id="btn__login">
        Log In
      </button>
    </div>
  )

  // TODO: reimplement authentication states
  // if (isAuthenticated() === true) {
  //   const profile = getProfile()
  //   if (profile.name) {
  //     profile.name = decodeHtmlEntity(profile.name)
  //   }
  //   const artistsFiltered = users.data.edges.filter(({node}) => node.name === profile.name)
  //   const artist = artistsFiltered[0] ? artistsFiltered[0].node : ''

  //   secondaryNav = (
  //     <div className='nav__login'>
  //       <div className='login_wrap'>
  //         <Link to='/dashboard' className='login_avatar'>
  //           {artist &&
  //             <img src={ artist.headshot.url + '?fit=facearea&faceindex=1&facepad=5&mask=ellipse&w=100&h=100&'} alt={ artist.name +' headshot' } />
  //           }
  //           { profile.name }
  //           <span className='tooltip'>My Account</span>
  //         </Link>
  //         <a href='#logout' onClick={e => {
  //             logout()
  //             e.preventDefault()
  //         }}>Log Out</a>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <header className={styles.header}>
      <button
        className="visually-hidden"
        onClick={() => document.querySelector("#main-content").focus()}
      >
        Skip to main content
      </button>
      <nav
        className={`${styles["top-nav"]} ${
          styles[isNavOpen ? "open" : "closed"]
        }`}
      >
        <div className={styles["top__inner"]}>
          <Link href="/">
            <a className={styles["site-logo"]}>
              <img src="/img/rok_logo.png" alt="Ring of Keys" />
            </a>
          </Link>
          {/* <MenuIcon onClick={() => setNavOpen(!isNavOpen)} className={styles['hamburger']} /> */}
        </div>
        <div className={styles["nav__mobile-wrap"]}>
          {secondaryNav}
          <div className={styles["nav__main"]}>
            <Link
              href="/directory"
              className={path === "/directory" ? "active" : ""}
            >
              <a>Directory</a>
            </Link>
            <Link href="/news" className={path === "/news" ? "active" : ""}>
              <a>News</a>
            </Link>
            <Link
              href="/consultancy"
              className={path === "/consultancy" ? "active" : ""}
            >
              <a>Consultancy</a>
            </Link>
            <Link
              href="/resources"
              className={path === "/resources" ? "active" : ""}
            >
              <a>Resources</a>
            </Link>
            <Link href="/donate" className={path === "/donate" ? "active" : ""}>
              <a>Donate</a>
            </Link>
            <Link
              href="/contact"
              className={path === "/contact" ? "active" : ""}
            >
              <a>Contact</a>
            </Link>
            {/* { (isAuthenticated() === true) 
              ? <Link href='/dashboard' className='has-dropdown'>Dashboard</Link>
              : ''
            } */}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
