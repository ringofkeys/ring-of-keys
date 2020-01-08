import React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import './footer.css'

const Footer = () => {
    const data = useStaticQuery(graphql`
        query FooterQuery {
            allDatoCmsSite {
            nodes {
                globalSeo {
                facebookPageUrl
                twitterAccount
                }
            }
            }
        }  
    `)

    const { facebookPageUrl: facebookUrl, twitterAccount: twitterUrl } = data.allDatoCmsSite.nodes[0].globalSeo

    return (
    <footer>
        <nav>
            <div>
                <p>Menu</p>
                <Link to='/directory'>Directory</Link>
                <Link to='/news'>News</Link>
                <Link to='/consultancy'>Consultancy</Link>
                <Link to='/resources'>Resources</Link>
                <Link to='/donate'>Donate</Link>
            </div>
            <div>
                <p>About Us</p>
                <Link to='/about/#our-story'>Our Story</Link>
                <Link to='/about/#who-are-we'>Who are we?</Link>
                <Link to='/about/#what-we-do'>What do we do?</Link>
            </div>
            <div>
                <p>Contact Us</p>
                <a href='mailto:info@ringofkeys.org'>info@ringofkeys.org</a>
                <a href='mailto:consultancy@ringofkeys.org'>consultancy@ringofkeys.org</a>
                <a href='mailto:auditions@ringofkeys.org'>auditions@ringofkeys.org</a>
                <a href='mailto:newwork@ringofkeys.org'>newwork@ringofkeys.org</a>
            </div>
            <div>
                <p>Log In</p>
                <Link to='/dashboard'>Log in</Link>
                <Link to='/dashboard/settings'>Edit profile</Link>
                <Link to='/apply'>Apply to be a key</Link>
            </div>
            <div>
                <p>Follow Us</p>
                <a href={ facebookUrl } target='_blank' rel='noopener noreferrer'>Facebook</a>
                <a href={ twitterUrl.substring(1, twitterUrl.length) } target='_blank' rel='noopener noreferrer'>Twitter</a>
            </div>
        </nav>
    </footer>
    )
}
export default Footer