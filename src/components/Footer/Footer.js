import Link from "next/link"
import EmailSignupBar from "components/EmailSignupBar"
// import "./footer.css"
// import QuoteBlock from "./quoteblock"
import socialLinkData from './socialLinkData'
import styles from './Footer.module.css'

const Footer = ({
  footerQuoteText: quoteText,
  footerQuoteAttribution: quoteAttribution,
  footerQuoteBgColor: quoteBgColor,
  footerQuoteTextColor: quoteTextColor,
}) => {
  return (
      <footer id="footer" className={styles.footer}>
        <nav>
          <div>
            <p className="visible_mobile">Menu</p>
            <Link href="/directory" className="visible_mobile"><a>Directory</a></Link>
            <Link href="/news"><a>News</a></Link>
            <Link href="/consultancy"><a>Consultancy</a></Link>
            <Link href="/resources"><a>Resources</a></Link>
            <Link href="/donate"><a>Donate</a></Link>
          </div>
          <div>
            <p>About Us</p>
            <Link className="visible_mobile invisible_desktop" href="/about">
              <a>About Us</a>
            </Link>
            <Link href="/about"><a>Our Story</a></Link>
            <Link href="/about#who-are-we"><a>Who We Are</a></Link>
            <Link href="/about#what-we-do"><a>What We Do</a></Link>
          </div>
          <div>
            <p>Contact Us</p>
            <Link className="visible_mobile invisible_desktop" href="/contact">
              <a>Contact Us</a>
            </Link>
            <Link href="/contact/?subject=general"><a>General</a></Link>
            <Link href="/contact/?subject=job-submission"><a>Job Submissions</a></Link>
            <Link href="/contact/?subject=hiring"><a>Hiring</a></Link>
            <Link href="/contact/?subject=volunteer"><a>Volunteer</a></Link>
            <Link href="/contact/?subject=technical"><a>Technical Issues</a></Link>
          </div>
          <div className="account_nav">
            <p>Log In</p>
            <Link className="visible_mobile invisible_desktop" href="/dashboard">
              <a>Account</a>
            </Link>
            <Link href="/dashboard"><a>Sign In</a></Link>
            <Link className="visible_mobile" href="/apply">
              <a>Apply to be a Key</a>
            </Link>
            <a
              className="visible_mobile"
              href="https://docs.google.com/forms/d/e/1FAIpQLSdddSOlVOFaJf-4no9U0yZLnq4rYf_SppxPmvYct3tbvLmySg/viewform?fbclid=IwAR3kIoqje7TuxztVPP2XlldpKPzHSX9CKmpm1VBBcYLZwvnENFWgEW4Ic7I"
            >
              Help
            </a>
          </div>
          <div className="visible_mobile">
            <p className="visible_mobile">Follow Us</p>
            <div className={styles.socialLinks + " visible_mobile"}>
              {socialLinkData.map((link, i) => (
                <a
                  className={styles.socialLink + " visible_mobile"}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={'socialLink' + link.label}
                >
                  {link.icon(styles['icon'+link.label])}
                  <span className={styles.socialLinkLabel}>{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </nav>
        <div className={styles.footerEnd}>
          <EmailSignupBar />
          <span>
            © 2021 Ring of Keys Coalition, Inc. |{" "}
            <Link href="/privacy"><a>Privacy Policy</a></Link> | Designed by{" "}
            <a
              href="https://megelliott.design"
              target="_blank"
              rel="noopener noreferrer"
            >
              Meg Elliott
            </a>
            , built by{" "}
            <a
              href="https://franknoirot.co"
              target="_blank"
              rel="noopener noreferrer"
            >
              Frank Noirot
            </a>
            .
          </span>
        </div>
      </footer>
  )
}
export default Footer
