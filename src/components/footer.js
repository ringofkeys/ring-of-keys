import React from "react"
import { Link } from "gatsby"
import EmailSignupBar from "./emailsignupbar"
import "./footer.css"
import QuoteBlock from "./quoteblock"

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/RingofKeysOrg/",
    icon: (
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        className="icon_facebook"
        viewBox="0 0 266.893 266.895"
      >
        <path
          id="fb_blue"
          fill="#fff"
          d="M248.082,262.307c7.854,0,14.223-6.369,14.223-14.225V18.812
        c0-7.857-6.368-14.224-14.223-14.224H18.812c-7.857,0-14.224,6.367-14.224,14.224v229.27c0,7.855,6.366,14.225,14.224,14.225
        H248.082z"
        />
        <path
          id="fb_white"
          fill="#FFFFFF"
          d="M182.409,262.307v-99.803h33.499l5.016-38.895h-38.515V98.777c0-11.261,3.127-18.935,19.275-18.935
        l20.596-0.009V45.045c-3.562-0.474-15.788-1.533-30.012-1.533c-29.695,0-50.025,18.126-50.025,51.413v28.684h-33.585v38.895h33.585
        v99.803H182.409z"
        />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/ringofkeysorg/",
    icon: (
      <svg
        className="icon_instagram"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path d="M256,49.471c67.266,0,75.233.257,101.8,1.469,24.562,1.121,37.9,5.224,46.778,8.674a78.052,78.052,0,0,1,28.966,18.845,78.052,78.052,0,0,1,18.845,28.966c3.45,8.877,7.554,22.216,8.674,46.778,1.212,26.565,1.469,34.532,1.469,101.8s-0.257,75.233-1.469,101.8c-1.121,24.562-5.225,37.9-8.674,46.778a83.427,83.427,0,0,1-47.811,47.811c-8.877,3.45-22.216,7.554-46.778,8.674-26.56,1.212-34.527,1.469-101.8,1.469s-75.237-.257-101.8-1.469c-24.562-1.121-37.9-5.225-46.778-8.674a78.051,78.051,0,0,1-28.966-18.845,78.053,78.053,0,0,1-18.845-28.966c-3.45-8.877-7.554-22.216-8.674-46.778-1.212-26.564-1.469-34.532-1.469-101.8s0.257-75.233,1.469-101.8c1.121-24.562,5.224-37.9,8.674-46.778A78.052,78.052,0,0,1,78.458,78.458a78.053,78.053,0,0,1,28.966-18.845c8.877-3.45,22.216-7.554,46.778-8.674,26.565-1.212,34.532-1.469,101.8-1.469m0-45.391c-68.418,0-77,.29-103.866,1.516-26.815,1.224-45.127,5.482-61.151,11.71a123.488,123.488,0,0,0-44.62,29.057A123.488,123.488,0,0,0,17.3,90.982C11.077,107.007,6.819,125.319,5.6,152.134,4.369,179,4.079,187.582,4.079,256S4.369,333,5.6,359.866c1.224,26.815,5.482,45.127,11.71,61.151a123.489,123.489,0,0,0,29.057,44.62,123.486,123.486,0,0,0,44.62,29.057c16.025,6.228,34.337,10.486,61.151,11.71,26.87,1.226,35.449,1.516,103.866,1.516s77-.29,103.866-1.516c26.815-1.224,45.127-5.482,61.151-11.71a128.817,128.817,0,0,0,73.677-73.677c6.228-16.025,10.486-34.337,11.71-61.151,1.226-26.87,1.516-35.449,1.516-103.866s-0.29-77-1.516-103.866c-1.224-26.815-5.482-45.127-11.71-61.151a123.486,123.486,0,0,0-29.057-44.62A123.487,123.487,0,0,0,421.018,17.3C404.993,11.077,386.681,6.819,359.866,5.6,333,4.369,324.418,4.079,256,4.079h0Z" />
        <path d="M256,126.635A129.365,129.365,0,1,0,385.365,256,129.365,129.365,0,0,0,256,126.635Zm0,213.338A83.973,83.973,0,1,1,339.974,256,83.974,83.974,0,0,1,256,339.973Z" />
        <circle cx="390.476" cy="121.524" r="30.23" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "https://twitter.com/ringofkeysorg",
    icon: (
      <svg className="icon_twitter" viewBox="0 0 300.00006 244.18703">
        <g transform="translate(-539.17946,-568.85777)">
          <path d="m 633.89823,812.04479 c 112.46038,0 173.95627,-93.16765 173.95627,-173.95625 0,-2.64628 -0.0539,-5.28062 -0.1726,-7.90305 11.93799,-8.63016 22.31446,-19.39999 30.49762,-31.65984 -10.95459,4.86937 -22.74358,8.14741 -35.11071,9.62551 12.62341,-7.56929 22.31446,-19.54304 26.88583,-33.81739 -11.81284,7.00307 -24.89517,12.09297 -38.82383,14.84055 -11.15723,-11.88436 -27.04079,-19.31655 -44.62892,-19.31655 -33.76374,0 -61.14426,27.38052 -61.14426,61.13233 0,4.79784 0.5364,9.46458 1.58538,13.94057 -50.81546,-2.55686 -95.87353,-26.88582 -126.02546,-63.87991 -5.25082,9.03545 -8.27852,19.53111 -8.27852,30.73006 0,21.21186 10.79366,39.93837 27.20766,50.89296 -10.03077,-0.30992 -19.45363,-3.06348 -27.69044,-7.64676 -0.009,0.25652 -0.009,0.50661 -0.009,0.78077 0,29.60957 21.07478,54.3319 49.0513,59.93435 -5.13757,1.40062 -10.54335,2.15158 -16.12196,2.15158 -3.93364,0 -7.76596,-0.38716 -11.49099,-1.1026 7.78383,24.2932 30.35457,41.97073 57.11525,42.46543 -20.92578,16.40207 -47.28712,26.17062 -75.93712,26.17062 -4.92898,0 -9.79834,-0.28036 -14.58427,-0.84634 27.05868,17.34379 59.18936,27.46396 93.72193,27.46396" />
        </g>
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCwrpjtLgs1K7A8bHxScfoGg",
    icon: (
      <svg
        version="1.1"
        className="icon_youtube"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 1024 721"
      >
        <path id="Triangle" fill="#FFFFFF" d="M407,493l276-143L407,206V493z" />
        <g id="Lozenge">
          <g>
            <path
              d="M1013,156.3c0,0-10-70.4-40.6-101.4C933.6,14.2,890,14,870.1,11.6C727.1,1.3,512.7,1.3,512.7,1.3
                    h-0.4c0,0-214.4,0-357.4,10.3C135,14,91.4,14.2,52.6,54.9C22,85.9,12,156.3,12,156.3S1.8,238.9,1.8,321.6v77.5
                    C1.8,481.8,12,564.4,12,564.4s10,70.4,40.6,101.4c38.9,40.7,89.9,39.4,112.6,43.7c81.7,7.8,347.3,10.3,347.3,10.3
                    s214.6-0.3,357.6-10.7c20-2.4,63.5-2.6,102.3-43.3c30.6-31,40.6-101.4,40.6-101.4s10.2-82.7,10.2-165.3v-77.5
                    C1023.2,238.9,1013,156.3,1013,156.3z M407,493V206l276,144L407,493z"
            />
          </g>
        </g>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/ring-of-keys/about/",
    icon: (
      <svg className="icon_linkedin" viewBox="0 0 256 256">
        <g transform="scale(1.40) translate(-240.55198,-430.96227)">
          <g transform="matrix(1.018827,0,0,-1.018827,170.5996,498.03288)">
            <path
              d="M109.495-101.774V2.533H74.828v-104.307H109.495z
                    M92.168,16.775c12.081,0,19.612,8.01,19.612,18.021c-0.224,10.233-7.531,18.021-19.385,18.021
                    c-11.864,0-19.615-7.788-19.615-18.021c0-10.011,7.521-18.021,19.159-18.021H92.168L92.168,16.775z"
            />
            <path
              d="M128.681-101.774h34.673v58.249
                    c0,3.119,0.226,6.235,1.143,8.462c2.5,6.232,8.209,12.681,17.784,12.681c12.547,0,17.562-9.568,17.562-23.588v-55.804h34.666
                    v59.81c0,32.039-17.1,46.946-39.913,46.946c-18.701,0-26.915-10.45-31.476-17.571h0.234V2.533h-34.673
                    C129.141-7.253,128.681-101.774,128.681-101.774L128.681-101.774z"
            />
          </g>
        </g>
      </svg>
    ),
  },
]

const Footer = ({
  footerQuoteText: quoteText,
  footerQuoteAttribution: quoteAttribution,
  footerQuoteBgColor: quoteBgColor,
  footerQuoteTextColor: quoteTextColor,
}) => {
  return (
    <>
      {quoteText && (
        <QuoteBlock
          quoteBgColor={quoteBgColor}
          quoteTextColor={quoteTextColor}
          quoteText={quoteText}
          quoteAttribution={quoteAttribution}
        />
      )}
      <footer id="footer">
        <nav>
          <div>
            <p className="visible_mobile">Menu</p>
            <Link to="/directory" className="visible_mobile">
              Directory
            </Link>
            <Link to="/news">News</Link>
            <Link to="/consultancy">Consultancy</Link>
            <Link to="/resources">Resources</Link>
            <Link to="/donate">Donate</Link>
          </div>
          <div>
            <p>About Us</p>
            <Link className="visible_mobile invisible_desktop" to="/about">
              About Us
            </Link>
            <Link to="/about">Our Story</Link>
            <Link to="/about#who-are-we">Who We Are</Link>
            <Link to="/about#what-we-do">What We Do</Link>
          </div>
          <div>
            <p>Contact Us</p>
            <Link className="visible_mobile invisible_desktop" to="/contact">
              Contact Us
            </Link>
            <Link to="/contact/?subject=general">General</Link>
            <Link to="/contact/?subject=job-submission">Job Submissions</Link>
            <Link to="/contact/?subject=hiring">Hiring</Link>
            <Link to="/contact/?subject=volunteer">Volunteer</Link>
            <Link to="/contact/?subject=technical">Technical Issues</Link>
          </div>
          <div className="account_nav">
            <p>Log In</p>
            <Link className="visible_mobile invisible_desktop" to="/dashboard">
              Account
            </Link>
            <Link to="/dashboard">Sign In</Link>
            <Link className="visible_mobile" to="/apply">
              Apply to be a Key
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
            <div className="social-links visible_mobile">
              {socialLinks.map((link, i) => (
                <a
                  className="social-link visible_mobile"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={"social-link_" + link.label}
                >
                  {link.icon}
                  <span className="social-link_label">{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </nav>
        <div className="footer-end">
          <EmailSignupBar />
          <span>
            © 2021 Ring of Keys Coalition, Inc. |{" "}
            <Link to="/privacy">Privacy Policy</Link> | Designed by{" "}
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
    </>
  )
}
export default Footer
