import { SessionProvider, signIn, useSession } from "next-auth/react"
import SEO from "components/SEO"
import "../styles/global.css"
import Head from "next/head"

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({
    Component,
    pageProps: { session, seo, ...pageProps }, // This destructures the 'session' property out of the pageProps
}) {
    // getLayout pattern allows for per-page layouts: https://nextjs.org/docs/basic-features/layouts
    const getLayout = Component.getLayout || ((page) => page)

    return getLayout(
        <>
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
                <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Raleway:ital,wght@0,400;0,600;0,900;1,400&display=swap" rel="stylesheet"/>
            </Head>
            <SEO seoData={seo} />
            <SessionProvider session={session}>
                <Component {...pageProps} />
            </SessionProvider>
        </>
    )
}
