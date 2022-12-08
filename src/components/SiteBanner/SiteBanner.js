import Link from "next/link";
import { useEffect, useState } from "react";
import styles from './SiteBanner.module.css'

// Local Storage Keys for timestamps
const SITE_BANNER_DISMISSED_KEY = 'rok-site-banner-dismissed'
const SITE_BANNER_UPDATE_KEY = 'rok-site-banner-last-updated'

// Timestamp of last update to banner
const SITE_BANNER_LAST_UPDATED = 1693053473046

export default function SiteBanner({
    textContent = "Ring of Keys runs on public and member donations. Donate this holiday season to empower and connect queer theatremakers around the world.",
    ctaUrl = "/donate",
    ctaText = "Donate",
    dismissUntil = 30 // days
}) {
    const [showBanner, setShowBanner] = useState(false)
    const [dismissed, setDismissed] = useState(false)

    useEffect(() => {
        const bannerDismissedUntil = localStorage.getItem(SITE_BANNER_DISMISSED_KEY)
        const bannerLastUpdatedStorage = localStorage.getItem(SITE_BANNER_UPDATE_KEY)

        if (bannerDismissedUntil == null || bannerLastUpdatedStorage == null) {
            setShowBanner(true)
        } else if (bannerDismissedUntil < Date.now() || bannerLastUpdatedStorage < SITE_BANNER_LAST_UPDATED) {
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

    return (showBanner ?
        <div className={styles.bannerWrapper + " " + (dismissed ? 'hidden' : '')}>
            <p className={styles.bannerTextContent}>{textContent}</p>
            <Link href={ctaUrl}>
                <a className={"btn " + styles.bannerCta} onClick={closeButtonClick}>{ctaText}</a>
            </Link>
            <button onClick={closeButtonClick} className={styles.closeBtn}>
                <svg width="16" height="16" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.1538 2.00006L10.1538 9.99994M2.15381 17.9998L10.1538 9.99994M10.1538 9.99994L2.15381 2M10.1538 9.99994L18.1538 17.9999" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                </svg>
                <span className="visually-hidden">Close</span>
            </button>
        </div>
        : <></>
    )
}