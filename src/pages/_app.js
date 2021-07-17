import '../styles/global.css'

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
    // getLayout pattern allows for per-page layouts: https://nextjs.org/docs/basic-features/layouts
    const getLayout = Component.getLayout || ((page) => page)

    return getLayout(<Component {...pageProps} />)
}