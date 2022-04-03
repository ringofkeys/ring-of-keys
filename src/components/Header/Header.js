import React, { useEffect, useState } from "react"
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from "next/link"
import { request } from "lib/datocms"
import { NAV_QUERY } from "queries/nav"
import styles from "./header.module.css"
import tooltipStyles from 'styles/tooltip.module.css'

// TODO: Reimplement Auth as context
// import { getProfile, isAuthenticated, logout } from "../utils/auth"
// import { decodeHtmlEntity } from '../utils/htmlEntity.js'

const Header = ({ path }) => {
  const [isNavOpen, setNavOpen] = useState(false)
  const { data: session } = useSession()

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
          <SecondaryNav session={session} navOpen={isNavOpen} />
          <div className={styles["nav__main"]}>
            <Link href="/directory-2" className={path === "/directory" ? "active" : ""}>
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
            { session &&
              <Link href='/dashboard' className='has-dropdown'>
                <a>Dashboard</a>
              </Link> }
          </div>
        </div>
      </nav>
    </header>
  )
}

function NavLink({ href, children, path }) {
  return <Link href={href || ''} className={path === href ? "active": "" }>
    <a>{children}</a>
  </Link>
}

function SecondaryNav({ session, navOpen }) {
  const [user, setUser] = useState(false)

  useEffect(() => {
    if (session) {
      getUserData(session.token.datoId).then(({user: userData}) => setUser(userData))
    }
  }, [session])

  return <div className={styles["nav__login"]}>
    { (!session)
    ? (<>
      <Link href="/apply" className={navOpen ? "btn btn-link_ghost" : ""}>
        <a>Apply to be a key</a>
      </Link>
      <button onClick={() => signIn('auth0', { callbackUrl: 'http://localhost:3000/dashboard' })} id="btn__login">
        Log In
      </button>
    </>)
    : <div className={styles["login_wrap"]}>
        <Link href='/dashboard'>
          <a className={styles["login_avatar"]}>
            { user && (<>
              <img src={ user.headshot.url + '?fit=facearea&faceindex=1&facepad=5&mask=ellipse&w=100&h=100&'} alt={ user.name +' headshot' } />
              { user.name }
            </>)}
            <span className={tooltipStyles.tooltip}>My Account</span>
          </a>
        </Link>
        <button onClick={() => signOut({ callbackUrl: 'http://localhost:3000/'})}>Log Out</button>
      </div>
    }
  </div>
}

async function getUserData(datoId) {
    return await request({
      query: NAV_QUERY,
      variables: { id: datoId }
    })
}

export default React.memo(Header)
