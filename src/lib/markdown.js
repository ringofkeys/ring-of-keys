import React from "react"
import { unified } from "unified"
import markdown from "remark-parse"
import { get } from "lodash"

export const parseMarkdown = (content) =>
    cleanNode(unified().use(markdown).parse(content)
)

const mdRenderer = (props) => (!props.plaintext)
    ? <Node node={props.ast} />
    : <PlaintextNode node={props.ast} excerptLength={props.excerptLength || 100} />

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

function Node({ node }) {
    const Component = getComponent(node)
    const { children } = node

    return children ? (
        <Component {...node}>
            {children.map((child, i) => (
                <Node key={i} node={child} />
            ))}
        </Component>
    ) : (
        <Component {...node} />
    )
}

function PlaintextNode({ node, excerptLength }) {
    const textContent = node.children.map(n => getComponentAsPlaintext(n)).join('')

    return (textContent.length <= excerptLength) ? textContent : textContent.substr(0, excerptLength) + '...'
}

function getComponentAsPlaintext(node) {
    switch (node.type) {
        case "text":
            return node.value
        case "html":
            return ''
        default:
            return node.children.map(n => getComponentAsPlaintext(n)).join('')
    }
}

function getComponent(node) {
    switch (node.type) {
        case "root":
            return ({ children }) => <>{children}</>
        case "paragraph":
            return ({ children }) => <p>{children}</p>
        case "emphasis":
            return ({ children }) => <em>{children}</em>
        case "strong":
            return ({ children }) => <strong>{ children }</strong>
        case "heading":
            return ({ children, depth = 2 }) => {
                const Heading = `h${depth}`
                return <Heading>{children}</Heading>
            }
        case "link":
            return ({ children, url }) => <a href={url} className="md-link">{children} </a>
        case "list":
            return ({ children, ordered }) => {
                const List = (ordered) ? 'ol' : 'ul'
                return <List>{children}</List>
            }
        case "listItem":
            return  ({ children }) => <li>{ children }</li>
        case "text":
            return ({ value }) => <>{value}</>
        case "blockquote":
            return ({ children }) => <blockquote className="leading-tight">{ children }</blockquote>
        case "html":
            return ({ value }) => <div style={{boxSizing: 'content-box', display: 'contents'}} dangerouslySetInnerHTML={{__html: value}} />
        default:
            console.log("Unhandled node type", node)
            return ({ children }) => <>{children}</>
    }
}
