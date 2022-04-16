import React from "react"
import Link from "next/link"
import styles from "styles/directory.module.css"

export default function DirectoryCard({ obj }){
  const artist = obj.item ? obj.item : obj
  const [locationToShow, locationFieldToSearch] = getProperLocation(artist)

  const matchClass = fieldName => fieldHasMatch(artist, obj, fieldName) ? "searchMatch" : ""

  return (
    <Link
      href={`/keys/${artist.slug}`}
    >
      <a className={styles["key__card"]} style={{ "--grad-rotate": Math.random() * 360 + "deg" }}>
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
            <h3
              className={styles['card__title'] +' '+ matchClass("name")}
              style={{
                "--match-opacity":
                  fieldHasMatch(obj, "name") && obj.score ? 1 - obj.score : 0,
              }}
            >
              {artist.name}
            </h3>
            <div className={styles["card__meta"]}>
              <span
                className={styles["card__pronouns"] +' '+ styles[matchClass("pronouns")]}
                style={{
                  "--match-opacity":
                    fieldHasMatch(obj, "pronouns") && obj.score
                      ? 1 - obj.score
                      : 0,
                }}
              >
                {artist.pronouns.indexOf(",") >= 0
                  ? artist.pronouns.slice(0, artist.pronouns.indexOf(","))
                  : artist.pronouns}
              </span>
              <span
                className={styles["card__location"] +' '+ styles[matchClass(locationFieldToSearch)]}
                style={{
                  "--match-opacity":
                    fieldHasMatch(obj, locationFieldToSearch) && obj.score
                      ? 1 - obj.score
                      : 0,
                }}
              >
                {locationToShow}
              </span>
            </div>
            <p
              to={`/keys/${artist.slug}`}
              className="btn btn-link_ghost bg_copper"
              tabIndex="-1"
            >
              View Profile
            </p>
          </figcaption>
        </figure>
      </a>
    </Link>
  )
}

function fieldHasMatch(obj, fieldName) {
  return obj.matches && obj.matches.some(match => match.key.includes(fieldName))
}

function getProperLocation(artist) {
  if (artist.mainLocation) {
    return [artist.mainLocation, "mainLocation"]
  } else {
    return [
      artist.locations.indexOf(",") >= 0
        ? artist.locations.slice(0, artist.locations.indexOf(","))
        : artist.locations,
      "locations",
    ]
  }
}
