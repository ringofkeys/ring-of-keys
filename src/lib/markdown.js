import React from 'react'
import { unified } from 'unified'
import markdown from 'remark-parse'

export const parseMarkdown = content => cleanNode(unified().use(markdown).parse(content))

const mdRenderer = props => <Node {...props.ast} />
export const MarkdownRenderer = React.memo(mdRenderer)

function cleanNode(node) {
    delete node.position
    if (node.value === undefined) delete node.value
    if (node.tagName === undefined) delete node.tagName
    if (node.data) {
        delete node.data.hName
        delete node.data.hChildren
        delete node.data.hProperties
    }
    if (node.children) node.children.forEach(cleanNode)

    return node
}

function Node(node) {
    const Component = getComponent(node)
    const { children } = node

    return children ? (
        <Component {...node}>
            { children.map((child, i) => (
                <Node key={i} {...child} />
            ))}
        </Component>
    ) : (
        <Component {...node} />
    )
}

function getComponent(node) {
    switch (node.type) {
        case "root":
            return ({ children }) => <>{ children }</>
        case "paragraph":
            return ({ children }) => <p>{ children }</p>
        case "emphasis":
            return ({ children }) => <em>{ children }</em>
        case "heading":
            return ({ children, depth=2 }) => {
                const Heading = `h${depth}`
                return <Heading>{ children }</Heading>
            }
        case "link":
            return ({ children, url }) => <a href={url}>{ children} </a>
        case "text":
            return ({ value }) => <>{ value }</>
        // TODO: Add all other content types
        default:
            console.log("Unhandled node type", node)
            return ({ children }) => <>{ children }</>
    }
}