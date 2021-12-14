import React from "react"
import QuoteBlock from "./quoteblock"
import Shortcode from "./shortcode"
import Hero from "./Hero"
import { renderHtmlToReact } from "../utils/renderHtmlToReact"
import * as pageBlockStyles from "./PageBlock.module.css"

const blockTypes = {
  DatoCmsHero: props => heroBlock(props),
  DatoCmsBasicBlock: props => basicBlock(props),
  DatoCmsButton: props => button(props),
  DatoCmsIconHeadingLabel: props => iconHeadingLabel(props),
  DatoCmsQuote: props => quote(props),
  DatoCmsShortcode: props => shortcode(props),
  DatoCmsTeammateItem: props => teammateItem(props),
  DatoCmsImageArray: props => imageArray(props),
  DatoCmsCarousel: props => carouselBlock(props),
}

const PageBlock = props =>
  blockTypes[props.__typename] && props
    ? blockTypes[props.__typename](props)
    : false
export default PageBlock

function basicBlock(props) {
  return (
    <section
      id={props.idHref ? props.idHref : ""}
      className={props.area ? props.area : ""}
    >
      {renderHtmlToReact(props.contentNode.childMarkdownRemark.htmlAst)}
    </section>
  )
}

function teammateItem(props) {
  return (
    <section className="teammate-section">
      {props.blockGroup.map(
        (block, i) =>
          block.name &&
          block.contentNode && (
            <article className="teammate-item" key={block.name}>
              <h4>
                {block.linkUrl ? (
                  <a
                    href={block.linkUrl}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {block.name}
                  </a>
                ) : (
                  block.name
                )}
              </h4>
              {renderHtmlToReact(block.contentNode.childMarkdownRemark.htmlAst)}
            </article>
          )
      )}
    </section>
  )
}

function imageArray(props) {
  const WrappedImage = ({ image }) => <img src={image.url} alt={image.alt} />

  return (
    <section
      className={`imageArray ${pageBlockStyles.imageArray}`}
      style={{ "--columns": props.columns }}
    >
      {props.images.map(
        (image, i) =>
          image.url && (
            <>
              {image.customData?.linkUrl ? (
                <a
                  href={image.customData.linkUrl}
                  className={`imageWrapper ${pageBlockStyles.imageWrapper}`}
                  rel="norefferer"
                  target="_blank"
                  key={"image-wrap-" + i}
                >
                  <WrappedImage image={image} />
                </a>
              ) : (
                <div
                  className={`imageWrapper ${pageBlockStyles.imageWrapper}`}
                  key={"image-wrap-" + i}
                >
                  <WrappedImage image={image} />
                </div>
              )}
            </>
          )
      )}
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
    <section className="flex_center section_icon-heading-labels">
      {props.blockGroup.map(
        (block, i) =>
          block.icon && (
            <div
              className={
                "icon-heading-label " + (!block.centered ? "flex-left" : "")
              }
              key={block.icon.url + "-" + i}
              alt={block.icon.alt}
              style={{
                "--margin": `3vh 2%`,
                "--width": `${Math.floor(100 / block.columns) - 8}%`,
              }}
            >
              <img
                src={block.icon.url}
                alt={block.icon.alt}
                key={block.icon.alt}
              />
              {renderHtmlToReact(block.headingNode.childMarkdownRemark.htmlAst)}
              {renderHtmlToReact(block.labelNode.childMarkdownRemark.htmlAst)}
            </div>
          )
      )}
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

function carouselBlock(props) {
  return (
    <p>
      This should be a carousel with the props {JSON.stringify(props, null, 2)}
    </p>
  )
}

function heroBlock(props) {
  return <Hero {...props} />
}
