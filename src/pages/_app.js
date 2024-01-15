import { SessionProvider, signIn, useSession } from "next-auth/react"
import Script from 'next/script'
import SEO from "components/SEO"
import "../styles/global.css"
import SiteBanner from "components/SiteBanner"

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({
    Component,
    pageProps: { session, seo, ...pageProps }, // This destructures the 'session' property out of the pageProps
}) {
    // getLayout pattern allows for per-page layouts: https://nextjs.org/docs/basic-features/layouts
    const getLayout = Component.getLayout || ((page) => page)

    return getLayout(
        <>
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-G84MVGVJWR"
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', 'G-G84MVGVJWR');
                `}
            </Script>
            <SEO seoData={seo} />
            <SessionProvider session={session}>
                {/* <SiteBanner /> */}
                <Component {...pageProps} />
            </SessionProvider>
        </>
    )
}
