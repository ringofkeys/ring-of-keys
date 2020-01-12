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
import Footer from "./footer"
import Sidebar from './sidebar'

const SidebarLayout = ({ path, children }) => {

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
      <Header siteTitle={data.site.siteMetadata.title} path={path} />
        <main className='has-sidebar' >
          <div>
            {children}
          </div>
          <Sidebar />
        </main>
      <Footer />
    </>
  )
}

SidebarLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default SidebarLayout
