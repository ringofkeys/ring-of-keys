import NextAuth from 'next-auth'
import Auth0Provider from 'next-auth/providers/auth0'

export default NextAuth({
    providers: [
        Auth0Provider({
            clientId: process.env.AUTH0_NEXT_CLIENT_ID,
            clientSecret: process.env.AUTH0_NEXT_CLIENT_SECRET,
            issuer: process.env.AUTH0_NEXT_ISSUER,
        })
    ]
})