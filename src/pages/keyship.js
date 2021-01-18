import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { graphql } from 'gatsby'
import { renderHtmlToReact } from '../utils/renderHtmlToReact'
import Layout from '../components/layout'
import withLocation from '../components/withLocation'
import { getProfile } from '../utils/auth'
import { decodeHtmlEntity } from '../utils/htmlEntity'
import { updateFields } from '../utils/profileEditor'


const Keyship = ({ search }) => {
    const [ ready, setReady ] = useState(false)
    console.log({ search })

    async function saveStripeId(sessionId) {
        const profile = getProfile()
        if (!profile) {
            setReady(true)
            return
        }

        const name = decodeHtmlEntity(profile.name)
        const datoId = profile["https://ringofkeys.org/user_metadata"].entity_id


        const data = await fetch('https://api.stripe.com/v1/checkout/sessions/' + sessionId, {
            headers: {
                Authorization: 'Bearer ' + process.env.GATSBY_STRIPE_SECRET_KEY,
            }
        }).then(res => res.json())



        // console.log({ data, name, datoId })

        const response = await updateFields(datoId, name, { stripeId: data.customer })

        console.log({ response })

        setReady(true)
    }

    useEffect(() => {
        if (search && search.session_id) {
            saveStripeId(search.session_id)
        } else {
            setReady(true)
        }
    }, [])

    return (
    <Layout title='Keyship' description=''>
        <Helmet>
            <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <h1>Keyship</h1>
        <p>
        Thank you so much for becoming a Keyship member! 
        We will strive to use your donation to make theatre a better place to work for all of us.
        </p>
        {ready && <a href={ (getProfile()) ? '/dashboard/' : '/'} class='btn has-arrow bg_navy'>{ (getProfile()) ? 'Return to Dashboard' : 'Return Home'}</a>}
    </Layout>)
}

export default withLocation(Keyship)