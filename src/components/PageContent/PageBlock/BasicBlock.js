import { MarkdownRenderer, parseMarkdown } from "lib/markdown"
import styles from './PageBlock.module.css'

export default function BasicBlock(props) {
    const ast = parseMarkdown(props.content)

    return (
        <section id={props.idHref ? props.idHref : ""} className={styles.basicBlock}>
            <MarkdownRenderer ast={ast} />
        </section>
    )
}
