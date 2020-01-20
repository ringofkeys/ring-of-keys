import React from 'react'
import Helmet from 'react-helmet'
import SidebarLayout from '../components/SidebarLayout'
import './about.css'

const ourStory = () => {

    return (
        <SidebarLayout>
            <Helmet>
                <link href="https://fonts.googleapis.com/css?family=Raleway:400,400i,600,900,900i&display=swap" rel="stylesheet" />
            </Helmet>
            <h1>Our Story</h1>
            <blockquote class='quote_graphic-bar'>
                Pssst. Andrea, you should meet your cast mate Royer. She's...a lesbian!
            </blockquote>
            <p>
                Our identities have a history of being whispered in our industry. This is, in fact, how we met. But our friendship
                was born out of a mutual desire to shout our identities from the rooftop. We realized that while we inhabit a professional
                space that is gay-friendly, queer women and TGNC artists are underrepresented within that space, despite being a huge and
                vital part of the industry. So we started Ring of Keys (with Lisa Kron and Jeanine Tesori's blessing, of course).
                What began as two queer sopranos eating cheese in a new york city apartment is now a sprawling professional network
                of 300 members representing 40 cities throughout the United States, including London and Toronto. Welcome to the Ring.
                Do you hear our hearts saying hi?
            </p>
            <p>
                <strong>— Andrea Prestinario and Royer Bockus, Co-founders</strong>
            </p>
            <div class='co-founders'>
                <div class='author_avatar'></div>
                <div class='author_avatar'></div>
                <p class='co-founders_names'>Andrea & Royer</p>
            </div>
            <h2 id='#who-we-are' className='about_h2'>Who We Are</h2>
            <p>
                Ring of Keys is a national network of queer women, transgender, and gender non-conforming artists working professionally
                on and offstage in the field of musical theatre. The only network of its kind, our membership is made up of actors,
                directors, dancers, singers, stage managers, lighting designers, dramaturgs, artistic directors, producers, casting directors,
                librettists, lyricists, composers, props, designers, scenic designers, sound designers, choreographers, costume designers,
                and production managers who self-identify as lesbian, bisexual, trans, queer, femme, masc, non-binary, and the diversity of
                genders that queerness contains. We strive to kick (ball-change) the closet door open to create a vibrant, diverse musical
                theatre landscape for the future.
            </p>
            <h2 id='#what-we-do' className='about_h2'>What We Do</h2>
            <p>
                Ring of Keys promotes the hiring of self-identifying queer women, transgender, and gender non-conforming artists
                in the musical theatre industry. We elevate the work of queer musical theatre artists through showcases, our social
                media platforms, and our monthly newsletter. We provide a visible, supportive community for our Members, with a focus
                on networking events, job-sharing, and monthly meet-ups. In addition, we collaborate with arts organizations and community
                partners to mobilize our industry to advance the musical theatre landscape and queer the stage.
            </p>
            <h2 className='about_h2'>Key Beliefs</h2>
            <div class='icon-heading-label flex-left'>
                <div class='icon_placeholder'></div>
                <h3>Coming Together</h3>
                <p>
                    We believe that by coming togeter we build intersectional awareness and community within our industry.
                </p>
            </div>
            <div class='icon-heading-label flex-left'>
                <div class='icon_placeholder'></div>
                <h3>Diversifying</h3>
                <p>
                    We believe that our diversity is an asset to the musical theatre landscape.
                </p>
            </div>
            <div class='icon-heading-label flex-left'>
                <div class='icon_placeholder'></div>
                <h3>Elevating</h3>
                <p>
                    We believe that by elevating queer women, trans, and gender non-conforming artists in our industry, we give
                    conscious and subconscious permission to other queer artists to elevate themselves.
                </p>
            </div>
            <div class='icon-heading-label flex-left'>
                <div class='icon_placeholder'></div>
                <h3>Making Space</h3>
                <p>
                    We believe in making space for marginalized voices within our own queer community.
                </p>
            </div>
        </SidebarLayout>
    )
}

export default ourStory