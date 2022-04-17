import React, { useRef } from "react"
import Link from "next/link"
import styles from "styles/directory.module.css"
import { camelCaseToLabel } from "lib/utils"

export default function DirectoryCard({ obj }) {
    const artist = obj.item ? obj.item : obj
    const locationToShow = getProperLocation(artist)

    const randomDegreesFromString = (seed) =>
        seed.split("").reduce((prev, curr) => prev + curr.charCodeAt(0), 0) %
        360
    const cardColorDegrees = useRef(randomDegreesFromString(artist.name))

    return (
        <Link href={`/keys/${artist.slug}`}>
            <a
                className={styles["key__card"]}
                style={{ "--grad-rotate": cardColorDegrees.current + "deg" }}
            >
                <figure>
                    <div className={styles["card__img"]}>
                        <img
                            src={
                                artist.headshot.url +
                                "?fit=facearea&faceindex=1&facepad=5&mask=ellipse&w=120&h=120&"
                            }
                            alt={artist.name + " headshot"}
                            loading="lazy"
                        />
                    </div>
                    <figcaption>
                        <h3 className={styles["card__title"]}>{artist.name}</h3>
                        <div className={styles["card__meta"]}>
                            <span className={styles["card__pronouns"]}>
                                {artist.pronouns.indexOf(",") >= 0
                                    ? artist.pronouns.slice(
                                          0,
                                          artist.pronouns.indexOf(",")
                                      )
                                    : artist.pronouns}
                            </span>
                            <span className={styles["card__location"]}>
                                {locationToShow}
                            </span>
                        </div>
                        <p
                            className="btn btn-link_ghost bg_copper"
                            tabIndex="-1"
                        >
                            View Profile
                        </p>
                        {obj.matches && obj.matches.length && (
                            <p className={styles["card__meta"]}>
                                <span className={styles["card__matches"]}>
                                    Matches on:{" "}
                                    {obj.matches
                                        .map((match) =>
                                            camelCaseToLabel(match.key)
                                        )
                                        .join(", ")}
                                </span>
                            </p>
                        )}
                    </figcaption>
                </figure>
            </a>
        </Link>
    )
}

function getProperLocation(artist) {
    if (artist.mainLocation) {
        return artist.mainLocation
    } else {
        return artist.locations.indexOf(",") >= 0
            ? artist.locations.slice(0, artist.locations.indexOf(","))
            : artist.locations
    }
}
