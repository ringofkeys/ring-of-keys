import NextAuth from "next-auth"
import Auth0Provider from "next-auth/providers/auth0"

const options = {
    site: "http://localhost:3000",
    providers: [
        Auth0Provider({
            clientId: process.env.AUTH0_NEXT_CLIENT_ID,
            clientSecret: process.env.AUTH0_NEXT_CLIENT_SECRET,
            issuer: process.env.AUTH0_NEXT_ISSUER,
            authorization: {
                params: {
                    scope: "openid profile email https://ringofkeys.org/user_metadata",
                },
            },
        }),
    ],
    callbacks: {
        // The JWT callback is called any time a token is written to
        jwt: async (auth0Token, oAuthProfile) => {
            // * The first argument is the NextAuth.js token.
            // * The second argument is the full profile returned by the Provider.
            //   The second argument is only present on the first write (token)
            //   If tokenId is used (must be supported by the provider) it will be the
            //   the contents of the token from the provider.

            const isSignIn = oAuthProfile ? true : false
            //   console.log('NextAuth.js JWT', auth0Token, { token: auth0Token.token, profile: auth0Token.profile })
            //   console.log('Provider profile', oAuthProfile)

            if (auth0Token.profile) {
                auth0Token.token.datoId =
                    auth0Token.profile[
                        "https://ringofkeys.org/user_metadata"
                    ]?.entity_id
            }

            // Return the object you want to be stored in the token here
            // e.g. `token.auth0 = oAuthProfile`
            // Note: Try to only store information you need in the JWT to avoid the
            // cookie size growing too large (should not exceed 4KB)
            return Promise.resolve(auth0Token.token)
        },
        // The session callback is called before a session object is returned to the client
        session: async (session, token) => {
            // The first object is the default session contents that is returned
            // The second object is the NextAuth.js JWT (aways passed if JWT enabled)

            //   console.log('NextAuth.js session and token', session, token)

            // As with the JWT, you can add properties to the 'session' object
            // from the 'token' here (e.g. `session.someProperty = token.someProperty`)
            session.datoId = token?.datoId

            return Promise.resolve(session)
        },
    },
}

export default (req, res) => NextAuth(req, res, options)
