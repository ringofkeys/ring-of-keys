import Carousel from "components/Carousel"
import ResourceCard from "components/ResourceCard"
import { resourceColorsByTitle, resourceThemes } from "lib/constants"
import Link from "next/link"
import styles from "./ResourceSection.module.css"
// import devonImg from "./devon-avatar.png"

function CuratedResourceSection({ pageSpecificData: data }) {
    const resourceSets = data?.allCuratedResources?.allCuratedResourceSets

    console.log("from CuratedResourceSection", {
        data,
        resourceSets,
    })

    return resourceSets?.map(({ id, curator, resources }) => (
        <div className="my-16" key={id}>
            <Carousel
                classNames={[styles.resourceCarousel]}
                style={{ "--theme-color": "#494949" }}
            >
                <div
                    className={
                        styles.resourceTitle +
                        " !p-4 !w-96 flex items-center gap-3"
                    }
                    style={{
                        "--theme-color": "#494949",
                    }}
                >
                    <div className="rounded-sm overflow-hidden">
                        <img
                            src={
                                curator.headshot
                                    ? curator.headshot.url +
                                      "?fit=facearea&faceindex=1&facepad=5&w=150&h=150&fm=jpg"
                                    : "/img/blank_user_headshot.png"
                            }
                            alt={curator.name + " headshot"}
                            className="object-cover w-36"
                        />
                    </div>
                    <div>
                        <h2>{curator.name}</h2>
                        <Link
                            href={`/keys/${curator.slug}`}
                            className={styles.categoryLink}
                        >
                            Visit profile
                        </Link>
                        <p className="text-sm text-white normal-case">
                            {resources.length} Resources
                        </p>
                    </div>
                </div>
                {resources
                    ?.sort((a, b) => a.title.localeCompare(b.title))
                    .map((resource) => (
                        <ResourceCard
                            key={resource.title}
                            title={resource.title}
                            description={resource.description}
                            href={resource.link}
                            color={resourceColorsByTitle[resource.resourceType]}
                            className="md:w-96"
                        />
                    ))}
            </Carousel>
        </div>
    ))
}
export default CuratedResourceSection
