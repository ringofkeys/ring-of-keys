import * as React from "react"
import BasicBlock from "./BasicBlock"
import Button from "./Button"
import Shortcode from "./Shortcode"
import Hero from "./Hero"
import IconHeadingLabel from "components/IconHeadingLabel"
import { IconHeadingLabelGroup } from "./IconHeadingLabel"

export default function PageBlock(props) {
    if (!props.__typename) return <></>

    switch (props.__typename) {
        case "BasicBlockRecord":
            return <BasicBlock {...props} />
        case "ButtonRecord":
            return <Button {...props} />
        case "IconHeadingLabelRecord":
            return <IconHeadingLabel {...props} />
        case "IconHeadingLabelRecordGroup":
            return <IconHeadingLabelGroup {...props} />
        case "ShortcodeRecord":
            return <Shortcode {...props} />
        case "HeroRecord":
            return <Hero {...props} />
        default:
            console.log("Unsupported page block type in use", props)
            return <></>
    }
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
