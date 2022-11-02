import Link from "next/link";
import { useContext, useRef } from "react"
import HeroBio from "./HeroBio";
import styles from 'styles/key.module.css';
import HeroHeadShot from "./HeroHeadshot";
import { ProfileContext } from "pages/keys/[slug]";
import HeroSocialMedia from "./HeroSocialMedia";
import Icon from "components/Icon";
import tooltipStyles from "styles/tooltip.module.css"

const brandColors = ["slate-blue", "peach-1", "copper-1", "gold-1", "pale-green-1"]

export function KeyHero({
    setMessageOpen,
    setHeadshotFullOpen,
    setEditingHeadshot,
    setEditingSocialMedia,
    setEditingFeaturedImage,
}) {
    const {
        artist,
        isEditing,
    } = useContext(ProfileContext)

    const gradientRotation = useRef(parseInt(artist?.id) % 360 + "deg");
    const gradientColor = useRef(brandColors[parseInt(artist?.id) % brandColors.length])

    return (
        <section
            className={styles["artist_hero"]}
            style={{
                "--grad-rot": gradientRotation.current,
                "--grad-col-1": `var(--rok-${ gradientColor.current }_hex)`,
            }}
        >
            <HeroHeadShot setHeadshotFullOpen={setHeadshotFullOpen} setEditingHeadshot={setEditingHeadshot} />
            <HeroBio setMessageOpen={setMessageOpen} />
            <HeroSocialMedia setEditingSocialMedia={setEditingSocialMedia} />
            {artist?.featuredImage && (
                <img
                    src={artist?.featuredImage?.responsiveImage.src}
                    alt={artist?.featuredImage?.responsiveImage.alt}
                    className={styles["featured_image"]}
                />
            )}
            {isEditing && (
                <button
                    className={styles["btn_edit"] +' '+ styles["edit_featuredImage"]}
                    onClick={setEditingFeaturedImage}
                >
                    <Icon type="camera" className={styles["icon_edit"]} />
                    <span className={tooltipStyles["tooltip"]}>
                        Change Cover Photo
                    </span>
                </button>
            )}
            <Link href="/directory">
                <a className={styles["back_link"]}>
                    <span>Back to Directory</span>
                </a>
            </Link>
        </section>
    )
}