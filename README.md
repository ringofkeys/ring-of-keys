# Ring of Keys

**Note:** This `archive` branch of the site is from when it ran on GatsbyJS.

A website directory and resource center for theatremakers.

This site was created using [Gatsby.js](https://gatsbyjs.com). It pulls content from [DatoCMS](https://datocms.com), is hosted on [Netlify](https://netlify.com), and does some clever stuff with [Auth0](https://auth0.com) to make editable user profiles possible on a JAMstack site!

If you are interested in developing this site or using it to build your own feel free to reach out to @franknoirot or fork it. I recommend reaching out first because there are definitely some lessons learned that haven't been fully corrected in here just yet.

## Getting Started

### 0. Needed software

- Node V16 (using NVM is recommended)
- NPM
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) (for testing serverless functions)

### 1. Clone or fork the repository

`git clone https://github.com/ringofkeys/ring-of-keys.git`

### 2. Resolve dependencies with NPM

`npm install`

### 3. Spin up dev site

`npm run develop`

### 3 alt. Spin up Netlify CLI version of site if testing serverless functions

`netlify dev`

Truly running the serverless environment will require a `.env` file with tokens for the third-party services used in the site, as well as potentially white-labelling your computer with some services. Please reach out to @franknoirot if you would like to work on this and need assistance.
