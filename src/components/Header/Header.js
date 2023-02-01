import React, { useEffect, useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { request } from "lib/datocms"
import { DASHBOARD_NAV_QUERY, NAV_MENU_QUERY } from "queries/nav"
import styles from "./Header.module.css"
import tooltipStyles from "styles/tooltip.module.css"

// TODO: Reimplement Auth as context
// import { getProfile, isAuthenticated, logout } from "../utils/auth"
// import { decodeHtmlEntity } from '../utils/htmlEntity.js'

const Header = ({ path, menu }) => {
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
                    <Link href="/" className={styles["site-logo"]}>
                            <img src="/img/rok_logo.png" alt="Ring of Keys" />
                    </Link>
                    <button className={styles.menuIconWrapper} onClick={() => setNavOpen(!isNavOpen)}>
                        <span className={styles.menuIcon}></span>
                    </button>
                </div>
                <div className={styles["nav__mobile-wrap"]}>
                    <SecondaryNav session={session} navOpen={isNavOpen} />
                    <div className={styles["nav__main"]}>
                        {menu.children
                          .sort((a, b) => a.position - b.position)
                          .map((menu, i) => (
                            <NavLink path={path} {...menu} key={"navlink-" + i} />
                          ))}
                        {session && (<NavLink path={path} label={"Dashboard"} link={"/dashboard"} />)}
                    </div>
                </div>
            </nav>
        </header>
    )
}

function NavLink({ path, label, link, children = [] }) {
  return (
    <li className={styles.dropdownWrapper}>
      <Link href={link} className={styles.hasDropdown + " " + (path === link ? styles.active : "")}>
            {label}&nbsp;
            {children.length ? (
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
      {children.length > 0 && (
        <div
          className={styles.dropdown}
          style={{ "--cols": children.length }}
        >
          {children.map((navItem) => (
            <Link href={navItem.link} key={navItem.link} className={styles.dropdownItem}>
                  <div className={styles.dropdownItemImgWrap}>
                    <img src={navItem.image.url} alt={navItem.image.alt} />
                  </div>
                  <div className={styles.dropdownItemContent}>
                    <p className={styles.dropdownItemTitle}>{navItem.label}</p>
                    <p className={styles.dropdownItemDescription}>
                      {navItem.description}
                    </p>
                    <p className={styles.dropdownItemCta}>{navItem.ctaText}</p>
                  </div>
            </Link>
          ))}
        </div>
      )}
    </li>
  )
}

function SecondaryNav({ session, navOpen }) {
    const [user, setUser] = useState(false)

    useEffect(() => {
        if (session) {
            getUserData(session.token.datoId).then(({ user: userData }) => {
                console.log({session,userData})
                setUser(userData)
            })
        }
    }, [session])

    return (
        <div className={styles["nav__login"]}>
            {!session ? (
                <>
                    <Link href="/apply" className={navOpen ? "btn btn-link_ghost" : ""}>
                        Apply to be a key
                    </Link>
                    <button
                        className={styles.loginBtn}
                        onClick={() => {
                            const callbackUrl = location.origin + "/dashboard"
                            console.log("about to sign in!", signIn, callbackUrl)

                            // // signIn()
                            signIn("auth0", {
                                callbackUrl,
                            })
                        }}
                    >
                        Log In
                    </button>
                </>
            ) : (
                <div className={styles["login_wrap"]}>
                    <Link href="/dashboard" className={styles["login_avatar"]}>
                            {user && (
                                <>
                                    <img
                                        src={
                                            user.headshot.url +
                                            "?fit=facearea&faceindex=1&facepad=5&mask=ellipse&w=100&h=100&"
                                        }
                                        alt={user.name + " headshot"}
                                    />
                                    {user.name}
                                </>
                            )}
                            <span className={tooltipStyles.tooltip}>
                                My Account
                            </span>
                    </Link>
                    <button
                        className={styles.logout}
                        onClick={() =>
                            signOut({ callbackUrl: (process.env.NODE_ENV == "development") ? "http://localhost:3000/" : "https://ringofkeys.org/" })
                        }
                    >
                        Log Out
                    </button>
                </div>
            )}
        </div>
    )
}

async function getUserData(datoId) {
    return await request({
        query: DASHBOARD_NAV_QUERY,
        variables: { id: datoId },
    })
}

export default React.memo(Header)



