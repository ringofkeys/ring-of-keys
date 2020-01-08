import React, { useEffect } from 'react'
import Layout from "../components/layout"
import Helmet from 'react-helmet';

const Donate = () => {
    useEffect(() => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.innerHTML = `
        jQuery(document).ready(function(){
            artfully.widgets.cart();
            artfully.widgets.donation().display(7244, []);
            artfully.widgets.cart().display();
        });
        `
        document.body.appendChild(script)
    })

    return (
    <Layout>
        <h1>Donate</h1>
        <Helmet>
            <link href='https://artfully-herokuapp-com.global.ssl.fastly.net/assets/themes/default.css' media='screen' rel='stylesheet' type='text/css' />
            <script src='https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js' type='text/javascript'></script>
            <script src='https://artfully-herokuapp-com.global.ssl.fastly.net/assets/artfully-v3.js' type='text/javascript'></script>
        </Helmet>
    </Layout>
    )
}

export default Donate