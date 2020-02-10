import React from "react"
import { handleAuthentication } from "../utils/auth"
import Layout from '../components/layout'

const Callback = () => {
  handleAuthentication()

  return <Layout>
    <p>Loading...</p>
  </Layout>
}

export default Callback