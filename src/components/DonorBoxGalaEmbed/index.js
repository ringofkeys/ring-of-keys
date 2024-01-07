import Head from "next/head"

const DonorBoxGalaEmbed = () => (
    <>
        <Head>
            <script
                src="https://donorbox.org/widget.js"
                paypalExpress="true"
            ></script>
        </Head>
        <iframe
            src="https://donorbox.org/embed/queering-the-gala-sponsorships"
            name="donorbox"
            allowpaymentrequest="allowpaymentrequest"
            seamless="seamless"
            frameborder="0"
            scrolling="no"
            height="900px"
            width="100%"
            style={{
                maxWidth: "500px",
                minWidth: "250px",
                maxHeight: "none!important",
            }}
        ></iframe>
    </>
)

export default DonorBoxGalaEmbed
