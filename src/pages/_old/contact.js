import React from "react"
import Layout from "../components/layout"
import ContactForm from "../components/contactform"
import peachIcons from "../images/social-icons/peachIcons"
import "./contact.css"

const Contact = () => {
  return (
    <Layout
      title="Contact Us"
      description="Get in touch with the Ring of Keys team to post jobs, hire our services, or ask any questions."
    >
      <section className="contact_page">
        <div className="contact_header">
          <h1>Contact Us</h1>
          <p>Let's queer the stage.</p>
        </div>
        <ContactForm />
        <h2>Follow Us</h2>
        <div className="social-row">
          {Object.keys(peachIcons).map(key => (
            <a
              href={peachIcons[key].href}
              rel="noopener noreferrer"
              target="_blank"
            >
              <img src={peachIcons[key].src} alt={key} />
            </a>
          ))}
        </div>
      </section>
    </Layout>
  )
}
export default Contact
