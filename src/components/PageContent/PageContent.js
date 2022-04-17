import React from "react"
import PageBlock from "./PageBlock"

export default function PageContent({ content, pageSpecificData }) {
    return (
        <>
            {content.map((block, i) => (
                <PageBlock
                    key={block?.id || `block-${i}`}
                    {...block}
                    pageSpecificData={pageSpecificData}
                />
            ))}
        </>
    )
}
