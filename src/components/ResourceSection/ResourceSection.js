import Carousel from "components/Carousel"
import ResourceCard from "components/ResourceCard"
import { resourceThemes } from "lib/constants"
import { slugify } from "lib/utils"
import Link from "next/link"
import styles from "./ResourceSection.module.css"
// import devonImg from "./devon-avatar.png"

function ResourceSection({ pageSpecificData: data }) {
    const resources = data.allResources.reduce(
        (acc, node) => {
            acc.find(theme => theme.title === node.resourceType)?.resources.push(node)
            return acc
        },
        Object.entries(resourceThemes).map(([key, values]) => {
            return { slug: key, ...values, resources: [] }
        })
    )

    return (resources &&
        resources.map(({ title, color, slug, resources: resourceList }, i) => (<div class="my-16">
            <Carousel
                key={title}
                classNames={[styles.resourceCarousel]}
                style={{"--theme-color": color}}
            >
                <div
                    className={styles.resourceTitle}
                    style={{
                        "--theme-color": color,
                    }}
                >
                    <h2>{title}</h2>
                    <Link href={`/resources/${slug}`} className={styles.categoryLink}>
                        Explore Category
                    </Link>
                    <p className="text-sm text-white normal-case">
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
                            color={color}
                            className="md:w-96"
                        />
                    ))}
            </Carousel>
        </div>)))
}
export default ResourceSection