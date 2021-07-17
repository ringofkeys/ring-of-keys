import React from 'react'
import Helmet from 'react-helmet'

const DonorBoxWidget = () => (<>
    <Helmet>
        <script src="https://donorbox.org/widget.js" paypalExpress="true"></script>
    </Helmet>
    <iframe
        allowPaymentRequest=""
        frameBorder="0"
        height="900px"
        name="donorbox"
        scrolling="no"
        seamless="seamless"
        src="https://donorbox.org/embed/ringofkeysorg"
        style={{maxWidth: '500px', minWidth: '250px', maxHeight: 'none!important'}}
        width="100%"></iframe>
</>)

export default DonorBoxWidget