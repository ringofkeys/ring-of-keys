import React from "react"
import Layout from "components/Layout"
import SEO from "components/SEO"
// import peachIcons from "../images/social-icons/peachIcons"
import styles from "styles/contact.module.css"
import Contactform from "components/ContactForm"
import { useRouter } from "next/router"

const SocialIcon = (props) => (
  <a
    href={props.href}
    rel="noopener noreferrer"
    target="_blank"
    className="hover:opacity-70"
  >
    <img src={props.src} alt={props.label} />
  </a>
)

const Contact = () => {
    const { query } = useRouter()

    return (
        <Layout>
            <SEO
                seoData={{
                    title: "Contact Us",
                    description:
                        "Get in touch with the Ring of Keys team to post jobs, hire our services, or ask any questions.",
                }}
            />
            <section className={styles.contactPage}>
                <div className={styles.contactHeader}>
                    <h1>Contact Us</h1>
                    <p className="mb-2">Let's queer the stage.</p>
                </div>
                <Contactform subject={query.subject} />
                <h2 className="mb-2 text-2xl">Follow Us</h2>
                <div className={styles.socialRow}>
                  <SocialIcon label="Instagram" href="https://www.instagram.com/ringofkeysorg/" src="/img/social-icons/icon_instagram_peach.svg" />
                  <SocialIcon label="Facebook" href="https://www.facebook.com/RingofKeysOrg/" src="/img/social-icons/icon_facebook_peach.svg" />
                  <SocialIcon label="Twitter" href="https://twitter.com/ringofkeysorg" src="/img/social-icons/icon_twitter_peach.svg" />
                  <SocialIcon label="Youtube" href="https://www.youtube.com/channel/UCwrpjtLgs1K7A8bHxScfoGg" src="/img/social-icons/icon_youtube_peach.svg" />
                  <SocialIcon label="LinkedIn" href="https://www.linkedin.com/company/ring-of-keys/about/" src="/img/social-icons/icon_linkedin_peach.svg" />
                </div>
            </section>
        </Layout>
    )
}
export default Contact
