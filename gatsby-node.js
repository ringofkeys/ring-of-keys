const path = require('path')
const express= require('express');
const { slugify } = require('./src/utils/slugify-require')

exports.onCreateDevServer=({app})=>{
    app.use(express.static('public'))
}

exports.createPages = ({ graphql, actions }) => {
    const { createPage } = actions

    return new Promise((resolve, reject) => {
        graphql(`
            {
                allDatoCmsKey {
                    edges {
                        node {
                            slug
                        }
                    }
                }
                # allDatoCmsNews(filter: { externalUrl: { eq: "" }}) {
                #    edges {
                #        node {
                #            slug
                #        }
                #    }
                #}
                allDatoCmsEvent {
                    edges {
                        node {
                            slug
                        }
                    }
                }
                allDatoCmsResource {
                    edges {
                        node {
                            title
                            description
                            link
                            resourceType
                        }
                    }
                }
                allDatoCmsPage {
                    edges {
                        node {
                            slug
                        }
                    }
                }                  
            }
        `).then(({ data }) => {
            data.allDatoCmsKey.edges.map(({ node: key }) => {
                createPage({
                    path: `keys/${key.slug}`,
                    component: path.resolve(`./src/templates/key.js`),
                    context: {
                        slug: key.slug,
                    },
                })
            })
            data.allDatoCmsEvent.edges.map(({ node: event }) => {
                createPage({
                    path: `events/${event.slug}`,
                    component: path.resolve(`./src/templates/event.js`),
                    context: {
                        slug: event.slug,
                    },
                })
            })
            // data.allDatoCmsNews.edges.map(({ node: news }) => {
            //     createPage({
            //         path: `news/${news.slug}`,
            //         component: path.resolve(`./src/templates/news.js`),
            //         context: {
            //             slug: news.slug,
            //         },
            //     })
            // })
            const resourceTypes = []

            const resources = data.allDatoCmsResource.edges.reduce((acc, { node }) => {
                if (!resourceTypes.find(el => el === node.resourceType)) {
                    resourceTypes.push(node.resourceType)
                    acc.push([ node ])
                } else {
                    acc[acc.findIndex(el => el[0].resourceType === node.resourceType)].push(node)
                }
                return acc
            }, [])
            resourceTypes.map((type, i) => {
                createPage({
                    path: `resources/${ slugify(type.replace('&', 'and')) }`,
                    component: path.resolve(`./src/templates/resourceType.js`),
                    context: {
                        resourceType: type,
                        resources: resources[i],
                        typeIndex: i,
                    },
                })
            })


            // programmatically create Pages
            data.allDatoCmsPage.edges.map(({ node: page}) => {
                createPage({
                    path: `/${ page.slug }`,
                    component: path.resolve(`./src/templates/page.js`),
                    context: {
                        slug: page.slug,
                    },
                })
            })

            resolve()
        })
    })
}

exports.onCreatePage = async ({ page, actions }) => {
    const { createPage } = actions

    if (page.path.match(/^\/dashboard/)) {
        page.matchPath = "/dashboard/*" // Make all pages under Dashboard client-side rendered,
                                        // So we can use Auth0 to secure them.

        createPage(page)
    }
}

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
    if (stage === 'build-html') {
        /* 
         * During build step, don't run auth0 because it needs the window to be present.
         */

         actions.setWebpackConfig({
             module: {
                 rules: [
                     {
                         test: /auth0-js/,
                         use: loaders.null()
                     }
                 ]
             }
         })
    }
}