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
import Helmet from 'react-helmet'
import Footer from "./footer"

const Layout = ({ path, children, classNames }) => {

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
      <Header siteTitle={data.site.siteMetadata.title} path={path} />
        <main className={classNames && classNames.join(' ')}>{children}</main>
      <Footer />
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
