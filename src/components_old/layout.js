/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import Header from "./header"
import SEO from './seo'
import Helmet from 'react-helmet'
import Footer from "./footer"

const Layout = ({ path, children, classNames, title, description, image,
  footerQuoteText, footerQuoteAttribution, footerQuoteBgColor, footerQuoteTextColor }) => {

  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
      datoCmsSite {
        faviconMetaTags {
          tags
        }
      }
    }
  `)
  const { tags } = data.datoCmsSite.faviconMetaTags

  return (
    <>
      <Helmet link={tags.filter(tag => tag.tagName === 'link').map(tag => tag.attributes)}
        meta={tags.filter(tag => tag.tagName === 'meta').map(tag => tag.attributes)} />
      { (title || description) &&
        <SEO title={ title ? title : 'Home' } 
          description={description ? description 
          : `Ring of Keys is dedicated to supporting theatremakers that identify as queer women,
             transgender, or gender non-conforming artists.`}
          image={ image ? image : null} />
      }
      <Header siteTitle={data.site.siteMetadata.title} path={path} />
        <main className={classNames && classNames.join(' ')}>
          <a id='main-content' href='#' className='visually-hidden'>Main content.</a>
          {children}
        </main>
      <Footer footerQuoteText={footerQuoteText} footerQuoteAttribution={footerQuoteAttribution}
        footerQuoteBgColor={footerQuoteBgColor} footerQuoteTextColor={footerQuoteTextColor} />
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
