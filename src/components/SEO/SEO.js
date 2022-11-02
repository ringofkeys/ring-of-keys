import React from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { defaultSEO } from "./defaultSEO"

export default function SEO({ seoData }) {
    const { title, description, image } = seoData || defaultSEO
    const router = useRouter()
    const titleWithSuffix = title + " | Ring of Keys"

    return (
        <Head>
            <link rel="icon" type="image.png" href="./favicon-32x32.png" />

            {/* Primary Meta Tags */}
            <title>{titleWithSuffix}</title>
            <meta name="title" content={titleWithSuffix} />
            <meta name="description" content={description} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={router?.pathname} />
            <meta property="og:title" content={titleWithSuffix} />
            <meta property="og:description" content={description} />
            <meta
                property="og:image"
                content={image?.url || defaultSEO.image.url}
            />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={router?.pathname} />
            <meta property="twitter:title" content={titleWithSuffix} />
            <meta property="twitter:description" content={description} />
            <meta
                property="twitter:image"
                content={image?.url || defaultSEO.image.url}
            />
        </Head>
    )
}
