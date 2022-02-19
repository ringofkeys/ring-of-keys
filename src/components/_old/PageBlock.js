import React from "react"
import QuoteBlock from "./quoteblock"
import Shortcode from "./shortcode"
import { renderHtmlToReact } from "../utils/renderHtmlToReact"

const blockTypes = {
  DatoCmsBasicBlock: props => basicBlock(props),
  DatoCmsButton: props => button(props),
  DatoCmsIconHeadingLabel: props => iconHeadingLabel(props),
  DatoCmsQuote: props => quote(props),
  DatoCmsShortcode: props => shortcode(props),
}

const PageBlock = props =>
  blockTypes[props.__typename] && props
    ? blockTypes[props.__typename](props)
    : false
export default PageBlock

function basicBlock(props) {
  return (
    <section id={props.idHref ? props.idHref : ""}>
      {renderHtmlToReact(props.contentNode.childMarkdownRemark.htmlAst)}
    </section>
  )
}

function button(props) {
  const linkIsExternal = url =>
    !url.startsWith("#") &&
    !(url.includes("ringofkeys") || url.includes("localhost"))
  return (
    <a
      href={props.url}
      target={linkIsExternal(props.url) ? "_blank" : ""}
      rel={linkIsExternal(props.url) ? "noopener noreferrer" : ""}
      className={"btn" + (!props.solid ? " btn-link_ghost" : "")}
      style={{ background: props.color.hex }}
    >
      {props.text}
    </a>
  )
}

function iconHeadingLabel(props) {
  return (
    <section className="flex_center gender-consultant_explain">
      {props.blockGroup.map((block, i) => (
        <div
          className={
            "icon-heading-label " + (!block.centered ? "flex-left" : "")
          }
          key={block.icon.url + "-" + i}
          alt={block.icon.alt}
          style={{
            margin: `3vh 0`,
            width: `${Math.floor(100 / block.columns) - 2}%`,
          }}
        >
          <img src={block.icon.url} alt={block.icon.alt} key={block.icon.alt} />
          {renderHtmlToReact(block.headingNode.childMarkdownRemark.htmlAst)}
          {renderHtmlToReact(block.labelNode.childMarkdownRemark.htmlAst)}
        </div>
      ))}
    </section>
  )
}

function quote(props) {
  return (
    <QuoteBlock
      quoteBgColor={"#7b8c7d"}
      quoteTextColor={"#e9bfb2"}
      quoteText={props.quoteText}
      quoteAttribution={props.quoteAttribution}
    />
  )
}

function shortcode(props) {
  const tokens = props.name.split(" ")
  const parsedProps = { type: tokens[0] }
  tokens.shift()
  tokens.forEach(token => {
    if (token.includes("=")) {
      const [key, val] = token.trim().split("=")
      parsedProps[key] = val
    } else {
      parsedProps[token.trim()] = true
    }
  })

  return <Shortcode {...parsedProps} />
}
