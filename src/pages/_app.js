import { SessionProvider, signIn, useSession } from 'next-auth/react'
import SEO from "components/SEO"
import "../styles/global.css"

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({
  Component,
  pageProps: { session, seo, ...pageProps } // This destructures the 'session' property out of the pageProps
}) {
  // getLayout pattern allows for per-page layouts: https://nextjs.org/docs/basic-features/layouts
  const getLayout = Component.getLayout || (page => page)

  return getLayout(<>
    <SEO seoData={ seo }/>
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  </>)
}