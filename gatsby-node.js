const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

exports.createPages = ({ graphql, actions }) => {
    const { createPage } = actions

    return new Promise((resolve, reject) => {
        graphql(`
            {
                allDatoCmsArtist {
                    edges {
                        node {
                            slug
                        }
                    }
                }
            }
        `).then(result => {
            result.data.allDatoCmsArtist.edges.map(({ node: artist }) => {
                createPage({
                    path: `artists/${artist.slug}`,
                    component: path.resolve(`./src/templates/artist.js`),
                    context: {
                        slug: artist.slug,
                    },
                })
            })
            resolve()
        })
    })
}