import { MarkdownRenderer, parseMarkdown } from "lib/markdown"

export default function BasicBlock(props) {
    const ast = parseMarkdown(props.content)

    return (
        <section id={props.idHref ? props.idHref : ""}>
            <MarkdownRenderer ast={ast} />
        </section>
    )
}
