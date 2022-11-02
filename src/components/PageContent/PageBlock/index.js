import * as React from "react"
import BasicBlock from "./BasicBlock"
import Button from "./Button"
import Shortcode from "./Shortcode"
import Hero from "./Hero"
import IconHeadingLabel from "components/IconHeadingLabel"
import { IconHeadingLabelGroup } from "./IconHeadingLabel"
import { TeammateItemGroup, TeammateItem } from './TeammateItem'

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
        case "TeammateItemRecordGroup":
            return <TeammateItemGroup {...props} />
        case "TeammateItemRecord":
            return <TeammateItem {...props} />
        case "ImageArrayRecord":
            return <ImageArray {...props} />
        default:
            console.log("Unsupported page block type in use", props)
            return <></>
    }
}


function ImageArray(props) {
  const WrappedImage = ({ image }) => <img src={image.url} alt={image.alt} />

  return (
    <section
      className="grid gap-4 lg:gap-16 items-center" 
      style={{ "--columns": props.columns, gridTemplateColumns: "repeat(var(--columns), 1fr)"}}
    >
      {props.images.map(
        (image, i) =>
          image.url && (
            <>
              {image.customData?.linkUrl ? (
                <a
                  href={image.customData.linkUrl}
                  className={`imageWrapper`}
                  rel="norefferer"
                  target="_blank"
                  key={"image-wrap-" + i}
                >
                  <WrappedImage image={image} />
                </a>
              ) : (
                <div
                  className={`imageWrapper`}
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
