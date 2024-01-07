import EmailSignupBar from "components/EmailSignupBar"
import Link from "next/link"
import { useEffect, useState } from "react"
import Popup from "./Popup"
import { useRouter } from "next/router"

const GALA_PATH = "/gala"
const POPUP_ID = "rok-gala-2024-dismissed"
const TURN_OFF_DATE = new Date("2024-01-30")

export default function GalaPopup() {
    const { asPath } = useRouter()
    const [isOpen, setOpen] = useState(false)

    useEffect(() => {
        const hasDismissed = window?.localStorage.getItem(POPUP_ID) || false
        const now = new Date()

        setOpen(now < TURN_OFF_DATE && !hasDismissed && asPath !== GALA_PATH)
    }, [])

    function handleDismiss() {
        window.localStorage.setItem(POPUP_ID, true)
        setOpen(false)
    }

    return (
        <Popup isOpen={isOpen} onClose={handleDismiss}>
            <h2>Join us at Queering the Gala</h2>
            <p>9pm January 29, 2024</p>
            <div className="divider" style={{ margin: "2vh 0" }}></div>
            <p style={{ marginBlockStart: "3vh" }}>
                Join Ring of Keys for our first ever gala on January 29 at Joe's
                Pub in New York and streaming worldwide! Tickets and more
                information for the event, which includes Key testimonials,
                Queering the Canon: Alan Menken, and special appearances by your
                favorite queer artists, can be found here.
            </p>
            <Link href="/gala" onClick={handleDismiss} className="btn bg_slate">
                See details
            </Link>
            <p style={{ marginBlockStart: "3vh" }}>
                And don't miss out on exclusive items in our silent auction. Get
                backstage Broadway experiences, playwriting lessons from
                internationally produced writers, voice coaching from Broadway
                stars, or an in-home private concert. All just a click away!
            </p>
            <Link
                href="https://givebutter.com/c/queeringtheauction"
                onClick={handleDismiss}
                className="btn btn-link_ghost"
                target="_blank"
                rel="noreferrer"
            >
                View the auction
            </Link>
        </Popup>
    )
}
