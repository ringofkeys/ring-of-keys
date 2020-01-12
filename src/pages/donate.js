import React from 'react'
import Layout from "../components/layout"

const Donate = () => {
    return (
    <Layout>
        <h1>Donate</h1>
        <iframe src='/static/donation-widget.html' width='100%' height='300' />
    </Layout>
    )
}

export default Donate