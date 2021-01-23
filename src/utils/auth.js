import auth0 from "auth0-js"
import { navigate } from "gatsby"

const isBrowser = typeof window !== "undefined"

let auth = isBrowser
  ? new auth0.WebAuth({
    domain: process.env.GATSBY_AUTH0_DOMAIN,
    clientID: process.env.GATSBY_AUTH0_CLIENTID,
    redirectUri: process.env.GATSBY_AUTH0_CALLBACK,
    responseType: "token id_token",
    scope: "openid profile email https://ringofkeys.org/user_metadata",
  }) : {}

const tokens = {
  accessToken: false,
  idToken: false,
  expiresAt: false,
}

let user = {}

const protectedRoutes = [`/dashboard`, `/callback`];
const isProtectedRoute = isBrowser && protectedRoutes
  .map(route => window.location.pathname.includes(route))
  .some(route => route)

export const hasEmailSignup = () => {
  if (!isBrowser) return

  return localStorage.getItem("hasEmailSignup") === "true"
}

export const isAuthenticated = () => {
  if (!isBrowser) {
    return
  }

  return localStorage.getItem("isLoggedIn") === "true"
}

export const login = () => {
  if (!isBrowser) {
    return
  }

  auth.authorize()
}

const setSession = (cb = () => {}) => (err, authResult) => {
  if (err) {
    if (isAuthenticated() && !isProtectedRoute) {
      localStorage.setItem("isLoggedIn", false)
    } else {
      login()
    }
  }
  
  if (authResult && authResult.accessToken && authResult.idToken) {
    console.log('authResult from auth.js', authResult)

    let expiresAt = authResult.expiresIn * 1000 + new Date().getTime()
    tokens.accessToken = authResult.accessToken
    tokens.idToken = authResult.idToken
    tokens.expiresAt = expiresAt
    user = authResult.idTokenPayload
    localStorage.setItem("isLoggedIn", true)
    
    
    if (isProtectedRoute) {
      navigate("/dashboard")
    }
  }

  cb()
}

export const silentAuth = cb => {
  if (!isAuthenticated()) {
    return cb()
  }
  auth.checkSession({}, setSession(cb))
}

export const handleAuthentication = () => {
  if (!isBrowser) {
    return
  }

  auth.parseHash(setSession())
}

export const getProfile = () => {
  return user
}

export const logout = () => {
  localStorage.setItem("isLoggedIn", false)
  auth.logout()
}