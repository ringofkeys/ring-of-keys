import { parseMarkdown, MarkdownRenderer } from "lib/markdown"
import styles from './TeammateItem.module.css'

export function TeammateItemGroup({ blocks }) {
  return (
    <section className={styles.teammateSection}>
      {blocks.map(
        (block) =>
          block.name &&
          block.content && (
            <TeammateItem {...block} key={block.name} />
          )
      )}
    </section>
  )
}

export function TeammateItem(block) {
    const contentAst = parseMarkdown(block.content)

    return (
        <article className={styles.teammateItem} key={block.name}>
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
            <MarkdownRenderer ast={contentAst} />
        </article>
    )
}
