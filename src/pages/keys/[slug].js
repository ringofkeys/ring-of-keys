import { Image } from "react-datocms"
import { request } from "lib/datocms"
import Layout from "components/Layout"
import { KEY_QUERY } from "queries/keys"
import { KeyBody, KeyHero } from "components/KeyProfile"
import React, { useEffect, useReducer, useState } from "react"
import { useSession } from "next-auth/react"
import MessagePopup from "components/MessagePopup"
import styles from "styles/key.module.css"
import SEO from "components/SEO"
import Popup from "components/Popup"
import HeroHeadshotEditor from "components/KeyProfile/KeyHero/HeroHeadshotEditor"

export const ProfileContext = React.createContext({})

function artistReducer(state, action) {
    switch (action.type) {
        case 'UPDATE_FIELD':
            return {
                ...state,
                ...action.payload,
            }
        case 'UPDATE_ARTIST':
            return action.payload
        default:
            throw new Error('Unsupported artistReducer action: ' + action.type)
    }
}

export default function KeyPage({ artistData }) {
    const [isEditable, setEditable] = useState(false)
    const [isEditing, setEditing] = useState(false)
    const { data: session } = useSession()
    const [isMessageOpen, setMessageOpen] = useState(false)
    const [isHeadshotFullOpen, setHeadshotFullOpen] = useState(false)
    const [isEditingHeadshot, setEditingHeadshot] = useState(false)
    const [artist, artistDispatch] = useReducer(artistReducer, artistData)

    useEffect(() => {
        if (session) {
            setEditable(true)
        }
    }, [session])

    return (<>
        <SEO seoData={{
            title: artist?.name,
            description: `${ artist?.name } (${ artist?.pronouns}) is a ${ artist?.discipline }, and a member of Ring of Keys.`,
            image: artist?.headshot?.src,
        }} />
        <ProfileContext.Provider value={{
            artist,
            artistDispatch,
            isEditable,
            isEditing,
            setEditing,
        }}>
            <Layout className={"fullWidth " + styles['key-profile']}>
                    <KeyHero
                        setMessageOpen={setMessageOpen}
                        setHeadshotFullOpen={setHeadshotFullOpen}
                        setEditingHeadshot={setEditingHeadshot}
                    />
                    <KeyBody />
            </Layout>
            <HeroHeadshotEditor
                isOpen={isEditingHeadshot}
                onClose={() => setEditingHeadshot(false)}
            />
            <MessagePopup
                isOpen={isMessageOpen}
                artistId={artist?.id}
                artistName={artist?.name}
                onClose={() => setMessageOpen(false)}
            />
            <Popup
                isOpen={isHeadshotFullOpen}
                onClose={() => setHeadshotFullOpen(false)}
            >
                <img
                    src={artist?.headshot?.fullRes.src}
                    alt={`${artist?.name} headshot`}
                    loading="lazy"
                />
            </Popup>
        </ProfileContext.Provider>
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
            artistData: data.key
        },
    }
}
