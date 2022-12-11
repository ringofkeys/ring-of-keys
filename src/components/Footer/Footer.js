import Link from "next/link"
import EmailSignupBar from "components/EmailSignupBar"
// import "./footer.css"
// import QuoteBlock from "./quoteblock"
import socialLinkData from "./socialLinkData"
import styles from "./Footer.module.css"

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
                    <p className={styles.visibleMobile}>Menu</p>
                    <Link href="/directory" className={styles.visibleMobile}>Directory</Link>
                    <Link href="/news" className={styles.visibleMobile}>News</Link>
                    <Link href="/consultancy" className={styles.visibleMobile}>Consultancy</Link>
                    <Link href="/resources" className={styles.visibleMobile}>Resources</Link>
                    <Link href="/donate" className={styles.visibleMobile}>Donate</Link>
                </div>
                <div>
                    <p>About Us</p>
                    <Link href="/about" className={styles.visibleMobile}>About Us</Link>
                    <Link href="/about">
                        Our Story
                    </Link>
                    <Link href="/about#who-are-we">
                        Who We Are
                    </Link>
                    <Link href="/about#what-we-do">
                        What We Do
                    </Link>
                </div>
                <div>
                    <p>Contact Us</p>
                    <Link href="/contact" className={styles.visibleMobile}>Contact Us</Link>
                    <Link href="/contact/?subject=general">
                        General
                    </Link>
                    <Link href="/contact/?subject=job-submission">
                        Job Submissions
                    </Link>
                    <Link href="/contact/?subject=hiring">
                        Hiring
                    </Link>
                    <Link href="/contact/?subject=volunteer">
                        Volunteer
                    </Link>
                    <Link href="/contact/?subject=technical">
                        Technical Issues
                    </Link>
                </div>
                <div className="account_nav">
                    <p>Log In</p>
                    <Link href="/dashboard" className={styles.visibleMobile}>Account</Link>
                    <Link href="/dashboard">
                        Sign In
                    </Link>
                    <Link className={styles.visibleMobile} href="/apply">
                        Apply to be a Key
                    </Link>
                    <a
                        className={styles.visibleMobile}
                        href="https://docs.google.com/forms/d/e/1FAIpQLSdddSOlVOFaJf-4no9U0yZLnq4rYf_SppxPmvYct3tbvLmySg/viewform?fbclid=IwAR3kIoqje7TuxztVPP2XlldpKPzHSX9CKmpm1VBBcYLZwvnENFWgEW4Ic7I"
                    >
                        Help
                    </a>
                </div>
                <div className={styles.visibleMobile}>
                    <p className={styles.visibleMobile}>Follow Us</p>
                    <div className={styles.socialLinks +' '+ styles.visibleMobile}>
                        {socialLinkData.map((link, i) => (
                            <a
                                className={styles.socialLink +' '+ styles.visibleMobile}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                key={"socialLink" + link.label}
                            >
                                {link.icon(styles["icon" + link.label])}
                                <span className={styles.socialLinkLabel}>
                                    {link.label}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </nav>
            <div className={styles.footerEnd}>
                <EmailSignupBar />
                <span>
                    © 2022 Ring of Keys Coalition, Inc. |{" "}
                    <Link href="/privacy">
                        Privacy Policy
                    </Link>{" "}
                    | Designed by{" "}
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
