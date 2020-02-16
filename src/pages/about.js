import React from 'react'
import Helmet from 'react-helmet'
import SidebarLayout from '../components/sidebarlayout'
import QuoteBlock from '../components/quoteblock'
import './about.css'
import andrea_headshot from '../images/andrea_headshot.png'
import royer_headshot from '../images/rory_headshot.png'
// import logo_mtf from '../images/logo_mtf.jpg'
// import logo_nqt from '../images/logo_nqt.jpg'
// import logo_maestra from '../images/logo_maestra.png'
import solidarity from '../images/about/solidarity.svg'
import multiplicity from '../images/about/multiplicity.svg'
import safety from '../images/about/safety.svg'
import possibility from '../images/about/possibility.svg'

const ourStory = () => {

    return (
        <SidebarLayout title='About' description='Ring of Keys is dedicated to supporting theatremakers that identify as queer women,
        transgender, or gender non-conforming artists.' classNames={['about']}
        footerQuoteAttribution='Rachel Chavkin' footerQuoteBgColor='var(--rok-slate-blue_hex)  '
        footerQuoteText={ <blockquote>
            Who is telling the stories and what stories are they telling?  This is not a pipeline issue. 
            It is a failure of imagination by a field whose job is to imagine the way the world could be.
        </blockquote> }>
            <Helmet>
                <link href="https://fonts.googleapis.com/css?family=Raleway:400,400i,600,900,900i&display=swap" rel="stylesheet" />
            </Helmet>
            <h1>Our Story</h1>
            <blockquote class='quote_graphic-bar' style={{borderColor: 'var(--rok-peach-1_hex'}}>
                Pssst. Andrea, you should meet your cast member Royer. She's...a lesbian!
            </blockquote>
            <p>
                Queer identities have a history of being whispered in our industry. This is, in fact, how we met. 
                But our friendship was born out of a mutual desire to shout our identities from the rooftop. We realized 
                that while we inhabit a professional space that is gay-friendly, queer women and TGNC artists are underrepresented 
                within that space, despite being a huge and vital part of the industry. So, with Lisa Kron and Jeanine Tesori’s 
                blessing, we created Ring of Keys in January of 2018. What began as two queer sopranos eating cheese and crackers 
                in a New York City apartment is now a sprawling professional network. Today, Ring of Keys represents 350+ members 
                in 40 U.S. cities, Toronto, and London, as well as hundreds of allies and associated organizations worldwide. 
                Welcome to the Ring. Do you hear our hearts saying hi?
            </p>
            <p>
                — Andrea Prestinario and Royer Bockus, Co-Founders
            </p>
            <div class='co-founders'>
                <img src={ andrea_headshot } alt='andrea' />
                <img src={ royer_headshot } alt='royer' />
                <p class='co-founders_names'>Andrea & Royer</p>
            </div>
            <h2 id='who-we-are' className='about_h2'>Who We Are</h2>
            <p style={{color: '#e8bfb3'}}><strong>Mission</strong></p>
            <p>
                Ring of Keys is an arts advocacy organization that promotes the hiring of musical theatre professionals - 
                onstage and off - who self-identify as queer women, transgender, and gender non-conforming artists.
            </p>
            <p>
                The only network of its kind, our membership is made up of actors, directors, dancers, singers, stage managers, 
                lighting designers, dramaturgs, artistic directors, producers, casting directors, librettists, lyricists, composers, 
                props designers, scenic designers, sound designers, choreographers, costume designers, and production managers who 
                self-identify as lesbian, bisexual, trans, queer, femme, masc, non-binary, and the diversity of genders that 
                queerness contains. We represent 350+ members in 40 U.S. cities, Toronto, and London. We strive to kick (ball-change) 
                the closet door open to create a vibrant, diverse musical theatre landscape for the future.
            </p>
            <h2 id='what-we-do' className='about_h2'>What We Do</h2>
            <p style={{color: '#e8bfb3'}}><strong>Vision</strong></p>
            <p>
                Ring of Keys promotes the hiring of self-identifying queer women, transgender, 
                and gender non-conforming artists in the musical theatre industry - primarily our Members 
                and beyond. We elevate the work of our “Keys” (Members) through showcases, our social media 
                platforms, and our monthly newsletter. We  provide a visible, supportive community through our 
                initiatives, with a focus on networking events, job-sharing, and monthly meet-ups. Believing 
                that our diversity is an asset that we bring to the industry, we collaborate with arts organizations 
                and community partners to mobilize and advance the musical theatre landscape and queer the stage.
            </p>
            <h2>Statement of Inclusion</h2>
            <p style={{color: '#e8bfb3'}}><strong>What queerness means to Ring of Keys:</strong></p>
            <p>
                We support the exploration of the ever-expanding definitions of queerness. Queerness speaks to both gender 
                identity and sexuality without conflating these two identities and can only be determined by an act of 
                self-identification.
            </p>
            <p style={{color: '#e8bfb3'}}><strong>What diversity means to Ring of Keys:</strong></p>
            <p>
                We cannot begin to define the ever-changing human experience at all of its intersections; we support and 
                believe in every emerging expression of human identity and welcome your collaboration toward equity for our 
                community.
            </p>
            <h2 className='about_h2'>Key Beliefs</h2>
            <section className='grid_2c-2r' style={{alignItems: 'flex-start'}}>
                <div class='icon-heading-label flex-left about-beliefs'>
                    <img src={ solidarity } alt='icon of a dance party' />
                    <h3>Solidarity</h3>
                    <p>
                        By standing together, we build intersectional awareness and community within our industry.
                    </p>
                </div>
                <div class='icon-heading-label flex-left about-beliefs'>
                    <img src={ safety } alt='icon of an umbrella' />
                    <h3>Safety</h3>
                    <p>
                    By prioritizing the full and fearless participation of our Members, we hold space for marginalized 
                    voices within our own queer community and beyond.
                    </p>
                </div>
                <div class='icon-heading-label flex-left about-beliefs'>
                    <img src={ multiplicity } alt='icon of a crowd' />
                    <h3>Multiplicity</h3>
                    <p>
                        By representing a multitude of intersectional identities, we redefine the meaning and necessity 
                        of diversity within our industry.
                    </p>
                </div>
                <div class='icon-heading-label flex-left about-beliefs'>
                    <img src={ possibility } alt='icon of two people helping each other climb' />
                    <h3>Possibility</h3>
                    <p>
                        By elevating queer women, transgender, and gender non-conforming artists in our industry, we give 
                        conscious and subconscious permission to all queer artists to elevate themselves.
                    </p>
                </div>
            </section>
            {/* <h2>Partners</h2>
            <div className='partner-logos'>
                <img src={ logo_mtf } alt='Musical Theatre Factory' />
                <img src={ logo_nqt } alt='National Queer Theater' />
                <img src={ logo_maestra } alt='Maestra' />
            </div> */}
            
        </SidebarLayout>
    )
}

export default ourStory