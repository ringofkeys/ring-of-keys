const path = require('path')
const express= require('express');

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
            }
        `).then(result => {
            result.data.allDatoCmsKey.edges.map(({ node: key }) => {
                createPage({
                    path: `keys/${key.slug}`,
                    component: path.resolve(`./src/templates/key.js`),
                    context: {
                        slug: key.slug,
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