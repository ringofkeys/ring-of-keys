import React from "react"
import PageBlock from "./PageBlock"

export default function PageContent({ content, pageSpecificData }) {
    const groupedBlocks = groupBlocks(content)

    return (
        <>
            {groupedBlocks.map((block, i) => (
                <PageBlock
                    key={block?.id || `block-${i}`}
                    {...block}
                    pageSpecificData={pageSpecificData}
                />
            ))}
        </>
    )
}


function groupBlocks(content) {
    const blockTypesToGroup = [
        "IconHeadingLabelRecord"
    ]

    return content.reduce((prev, curr, i, arr) => {
        const last = prev && prev[prev.length - 1]
        if (last && last.blocks?.length && last.__typename === curr.__typename + "Group") {
            prev[prev.length - 1].blocks.push(curr)
        } else if (i < arr.length - 1 && blockTypesToGroup.indexOf(curr.__typename) >= 0 && arr[i + 1].__typename === curr.__typename) {
            prev.push({ __typename: curr.__typename + 'Group', blocks: [curr] })
        } else {
            prev.push(curr)   
        }
        return prev
    }, [])
}