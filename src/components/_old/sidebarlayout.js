/**
 * SidebarLayout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import Header from "./header"
import SEO from "./seo"
import Footer from "./footer"
import Sidebar from "./sidebar"

const SidebarLayout = ({
    path,
    children,
    title,
    description,
    classNames,
    footerQuoteText,
    footerQuoteAttribution,
    footerQuoteBgColor,
    footerQuoteTextColor,
}) => {
    const data = useStaticQuery(graphql`
        query SidebarLayoutQuery {
            site {
                siteMetadata {
                    title
                }
            }
        }
    `)

    return (
        <>
            {(title || description) && (
                <SEO
                    title={title ? title : "Home"}
                    description={
                        description
                            ? description
                            : `Ring of Keys is dedicated to supporting theatremakers that identify as queer women,
             transgender, or gender non-conforming artists.`
                    }
                />
            )}
            <Header siteTitle={data.site.siteMetadata.title} path={path} />
            <main
                className={`has-sidebar ${
                    classNames ? classNames.join(" ") : ""
                }`}
            >
                <div>{children}</div>
                <Sidebar />
            </main>
            <Footer
                footerQuoteText={footerQuoteText}
                footerQuoteAttribution={footerQuoteAttribution}
                footerQuoteBgColor={footerQuoteBgColor}
                footerQuoteTextColor={footerQuoteTextColor}
            />
        </>
    )
}

SidebarLayout.propTypes = {
    children: PropTypes.node.isRequired,
}

export default SidebarLayout
