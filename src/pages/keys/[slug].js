import { Image } from "react-datocms"
import { request } from "lib/datocms"
import Layout from "components/Layout"
import { KEY_QUERY } from "queries/keys"
import { KeyHero } from "components/KeyProfile"
import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import MessagePopup from "components/MessagePopup"
import styles from "styles/key.module.css"

export const ProfileContext = React.createContext({})

export default function KeyPage({ artist }) {
    const [isEditable, setEditable] = useState(false)
    const { data: session } = useSession()
    const [isMessageOpen, setMessageOpen] = useState(false)

    useEffect(() => {
        if (session) {
            setEditable(true)
        }
    }, [session])

    return (<>
        <Layout className={"fullWidth " + styles['key-profile']}>
            <ProfileContext.Provider value={{
                artist,
                isEditable,
            }}>
                <KeyHero setMessageOpen={setMessageOpen} />
                <pre>{JSON.stringify(artist, null, 2)}</pre>
            </ProfileContext.Provider>
        </Layout>
        <MessagePopup
            isOpen={isMessageOpen}
            artistId={artist.id}
            artistName={artist.name}
            onClose={() => setMessageOpen(false)}
        />
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
