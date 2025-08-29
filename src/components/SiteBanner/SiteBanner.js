import Link from "next/link"
import { useEffect, useState } from "react"
import styles from "./SiteBanner.module.css"

// Local Storage Keys for timestamps
const SITE_BANNER_DISMISSED_KEY = "rok-site-banner-dismissed"
const SITE_BANNER_UPDATE_KEY = "rok-site-banner-last-updated"

// Timestamp of last update to banner
const SITE_BANNER_LAST_UPDATED = 1688051553846

export default function SiteBanner({
    textContent = `Queering the Canon: Live at Joe’s Pub is now streaming! <a href="https://open.spotify.com/album/11xd4dGMlNieSkwsDA1mSF" target="_blank" rel="noopener noreferrer">Listen on Spotify</a> or wherever you get your music.`,
    ctaUrl = "/donate",
    ctaText = "Donate",
    showCta = true,
    dismissUntil = 30, // days
}) {
    const [showBanner, setShowBanner] = useState(true)
    const [dismissed, setDismissed] = useState(false)

    useEffect(() => {
        const bannerDismissedUntil = localStorage.getItem(
            SITE_BANNER_DISMISSED_KEY
        )
        const bannerLastUpdatedStorage = localStorage.getItem(
            SITE_BANNER_UPDATE_KEY
        )

        if (bannerDismissedUntil == null || bannerLastUpdatedStorage == null) {
            setShowBanner(true)
        } else if (
            bannerDismissedUntil < Date.now() ||
            bannerLastUpdatedStorage < SITE_BANNER_LAST_UPDATED
        ) {
            setShowBanner(true)
            localStorage.removeItem(SITE_BANNER_DISMISSED_KEY)
            localStorage.removeItem(SITE_BANNER_UPDATE_KEY)
        }
    }, [])

    function closeButtonClick() {
        // Hide immediately
        setDismissed(true)

        // Calculate time to hide banner until
        const dismissUntilMilliseconds = 1000 * 60 * 60 * 24 * dismissUntil
        const dismissalRefreshTime = Date.now() + dismissUntilMilliseconds

        // Set localStorage to hide until this date
        localStorage.setItem(SITE_BANNER_DISMISSED_KEY, dismissalRefreshTime)
        localStorage.setItem(SITE_BANNER_UPDATE_KEY, SITE_BANNER_LAST_UPDATED)
    }

    return showBanner ? (
        <div
            className={styles.bannerWrapper + " " + (dismissed ? "hidden" : "")}
        >
            <p
            className={styles.bannerTextContent}
            dangerouslySetInnerHTML={{ __html: textContent }}
            ></p>


            {showCta && ctaUrl && ctaText && (
            <Link
                href={ctaUrl}
                className={"btn " + styles.bannerCta}
                onClick={closeButtonClick}
            >
                {ctaText}
            </Link>
            )}
            <button onClick={closeButtonClick} className={styles.closeBtn}>
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M18.1538 2.00006L10.1538 9.99994M2.15381 17.9998L10.1538 9.99994M10.1538 9.99994L2.15381 2M10.1538 9.99994L18.1538 17.9999"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                </svg>
                <span className="visually-hidden">Close</span>
            </button>
        </div>
    ) : (
        <></>
    )
}
