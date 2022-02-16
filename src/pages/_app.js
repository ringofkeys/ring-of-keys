import { SessionProvider, signIn, useSession } from 'next-auth/react'
import "../styles/global.css"

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({
  Component,
  pageProps: { session, ...pageProps } // This destructures the 'session' property out of the pageProps
}) {
  // getLayout pattern allows for per-page layouts: https://nextjs.org/docs/basic-features/layouts
  const getLayout = Component.getLayout || (page => page)

  return getLayout(
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}