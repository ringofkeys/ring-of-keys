import Link from "next/link";
import { useContext, useRef } from "react"
import HeroBio from "./HeroBio";
import styles from 'styles/key.module.css';
import HeroHeadShot from "./HeroHeadshot";
import { ProfileContext } from "pages/keys/[slug]";
import HeroSocialMedia from "./HeroSocialMedia";

const brandColors = ["slate-blue", "peach-1", "copper-1", "gold-1", "pale-green-1"]

export function KeyHero({ setMessageOpen, setHeadshotFullOpen }) {
    const {
        artist: {
            featuredImage,
            id,
        },
    } = useContext(ProfileContext)

    // const idNumber = parseInt(getIdNumber(id))
    const gradientRotation = useRef(parseInt(id) % 360 + "deg");
    const gradientColor = useRef(brandColors[parseInt(id) % brandColors.length])

    return (
        <section
            className={styles["artist_hero"]}
            style={{
                "--grad-rot": gradientRotation.current,
                "--grad-col-1": `var(--rok-${ gradientColor.current }_hex)`,
            }}
        >
            <HeroHeadShot setHeadshotFullOpen={setHeadshotFullOpen} />
            <HeroBio setMessageOpen={setMessageOpen} />
            <HeroSocialMedia />
            {featuredImage && (
                <img
                    src={featuredImage.responsiveImage.src}
                    alt={featuredImage.responsiveImage.alt}
                    className={styles["featured_image"]}
                />
            )}
            {/* {isEditable && (
                <button
                    className="btn_edit edit_featuredImage"
                    onClick={() =>
                        heroFields.featuredImage.setEditing(true)
                    }
                >
                    <img
                        src={profileIcons.camera}
                        className="icon_edit"
                        alt={`edit cover icon`}
                    />
                    <span className="tooltip">Change Cover Photo</span>
                </button>
            )} */}
            <Link href="/directory">
                <a className={styles["back_link"]}>
                    <span>Back to Directory</span>
                </a>
            </Link>
        </section>
    )
}