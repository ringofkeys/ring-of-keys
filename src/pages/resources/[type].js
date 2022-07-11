import { slugify } from "lib/utils"
import { RESOURCE_TYPE_QUERY } from "queries/resources"
import ResourceCard from "components/ResourceCard"
import Layout from "components/Layout"
import { request } from "lib/datocms"
import { resourceThemes } from "lib/constants"
// import "./resourceType.css"

export async function getStaticPaths() {
    const slugs = Object.keys(resourceThemes)
        .map(key => ({ params: { type: slugify(key) }}))

    return {
        paths: slugs,
        fallback: false,
    }
}

export async function getStaticProps({ params }) {
    const { allResources: resources } = await request({
        query: RESOURCE_TYPE_QUERY,
        variables: {
            type: resourceThemes[params.type].title,
        },
    })

    return {
        props: {
            resources,
            resourceTheme: resourceThemes[params.type]
        },
    }
}

const ResourceType = ({ resources, resourceTheme }) => {
    return (
        <Layout
            title={`Resources - ${resourceTheme.title}`}
            description={`We've compiled a list of ${
                resources.length
            } ${resourceTheme.title.toLowerCase()} resources for LGBT+ theatremakers to access.`}
        >
            {resourceTheme.title && <h1 className="text-2xl md:text-4xl">{resourceTheme.title}</h1>}
            <div class="grid md:grid-cols-2 gap-x-4 gap-y-8 my-8">
                {resources.length &&
                    resources.map((resource) => (
                        <ResourceCard
                            title={resource.title}
                            description={resource.description}
                            href={resource.link}
                            color={resourceTheme.color}
                            key={resource.title}
                        />
                    ))}
            </div>
        </Layout>
    )
}
export default ResourceType
