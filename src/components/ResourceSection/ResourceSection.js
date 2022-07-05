import Carousel from "components/Carousel"
import ResourceCard from "components/ResourceCard"
import { slugify } from "lib/utils"
import Link from "next/link"
import styles from "./ResourceSection.module.css"
// import devonImg from "./devon-avatar.png"

const resourceThemes = [
    "var(--rok-gold-1_hex)",
    "var(--rok-pale-green-1_hex)",
    "var(--rok-slate-blue_hex)",
    "var(--rok-peach-1_hex)",
    "var(--rok-copper-1_hex)",
    "#494949",
]

function ResourceSection({ pageSpecificData: data }) {
    const resourceTypes = [
        "Advocacy & Access",
        "Reading",
        "Podcasts",
        "Videos",
        "Tools & Directories",
        "Organizations",
    ]

    const resources = data.reduce(
        (acc, node) => {
            if (!resourceTypes.find((el) => el === node.resourceType)) {
                resourceTypes.push(node.resourceType)
                acc.push({ type: node.resourceType, resources: [node] })
            } else {
                acc[
                    acc.findIndex(
                        (resource) => resource.type === node.resourceType
                    )
                ].resources.push(node)
            }
            return acc
        },
        resourceTypes.map((val) => {
            return { type: val, resources: [] }
        })
    )

    return (resources &&
        resources.map(({ type, resources: resourceList }, i) => (
            <Carousel
                key={type}
                classNames={[styles.resourceCarousel]}
                style={{
                    "--theme-color":
                        resourceThemes[i % resourceThemes.length],
                }}
            >
                <div
                    className={styles.resourceTitle}
                    style={{
                        "--theme-color":
                            resourceThemes[i % resourceThemes.length],
                    }}
                >
                    <h2>{type}</h2>
                    <Link href={`/resources/${slugify(type)}`}>
                        <a className={styles.categoryLink}>
                            Explore Category
                        </a>
                    </Link>
                    <p
                        style={{
                            color: "white",
                            textTransform: "none",
                        }}
                    >
                        {resourceList.length} Resources
                    </p>
                </div>
                {resourceList &&
                    resourceList.map((resource) => (
                        <ResourceCard
                            key={resource.title}
                            title={resource.title}
                            description={resource.description}
                            href={resource.link}
                            color={
                                resourceThemes[
                                    resourceTypes.findIndex(
                                        (el) =>
                                            el === resource.resourceType
                                    ) % resourceThemes.length
                                ]
                            }
                        />
                    ))}
            </Carousel>
        )))
}
export default ResourceSection