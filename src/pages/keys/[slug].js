import { Image } from "react-datocms"
import { request } from "lib/datocms"
import Layout from "components/Layout"
import { KEY_QUERY } from "queries/keys"
import { KeyBody, KeyHero } from "components/KeyProfile"
import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import MessagePopup from "components/MessagePopup"
import styles from "styles/key.module.css"
import SEO from "components/SEO"
import Popup from "components/Popup"

export const ProfileContext = React.createContext({})

export default function KeyPage({ artist }) {
    const [isEditable, setEditable] = useState(false)
    const { data: session } = useSession()
    const [isMessageOpen, setMessageOpen] = useState(false)
    const [isHeadshotFullOpen, setHeadshotFullOpen] = useState(false)

    useEffect(() => {
        if (session) {
            setEditable(true)
        }
    }, [session])

    return (<>
        <SEO seoData={{
            title: artist.name,
            description: `${ artist.name } (${ artist.pronouns}) is a ${ artist.discipline }, and a member of Ring of Keys.`,
            image: artist.headshot?.src,
        }} />
        <Layout className={"fullWidth " + styles['key-profile']}>
            <ProfileContext.Provider value={{
                artist,
                isEditable,
            }}>
                <KeyHero
                    setMessageOpen={setMessageOpen}
                    setHeadshotFullOpen={setHeadshotFullOpen}
                />
                <KeyBody />
                <pre>{JSON.stringify(artist, null, 2)}</pre>
            </ProfileContext.Provider>
        </Layout>
        <MessagePopup
            isOpen={isMessageOpen}
            artistId={artist.id}
            artistName={artist.name}
            onClose={() => setMessageOpen(false)}
        />
        <Popup
            isOpen={isHeadshotFullOpen}
            onClose={() => setHeadshotFullOpen(false)}
        >
            <img
                src={artist.headshot.fullRes.src}
                alt={`${artist.name} headshot`}
                loading="lazy"
            />
        </Popup>
    </>)
}

export async function getServerSideProps(context) {
    const data = await request({
        query: KEY_QUERY,
        variables: {
            slug: context.params.slug,
        },
    })

    return {
        props: {
            artist: data.key
        },
    }
}
