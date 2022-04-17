import * as React from "react"
import BasicBlock from "./BasicBlock"
import Shortcode from "./Shortcode"
import Hero from "./Hero"

export default function PageBlock(props) {
    if (!props.__typename) return <></>

    switch (props.__typename) {
        case "BasicBlockRecord":
            return <BasicBlock {...props} />
        case "ShortcodeRecord":
            return <Shortcode {...props} />
        case "HeroRecord":
            return <Hero {...props} />
        default:
            console.log("Unsupported page block type in use", props)
            return <></>
    }
}
