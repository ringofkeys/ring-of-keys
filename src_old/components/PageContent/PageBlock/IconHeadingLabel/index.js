import { MarkdownRenderer, parseMarkdown } from "lib/markdown"
import styles from '../../../IconHeadingLabel/IconHeadingLabel.module.css'

export function IconHeadingLabelGroup({ blocks }) {
    return (
      <section className="flex flex-wrap justify-center my-6 iconHeadings gap-y-12">
        {blocks.map(
          (block) =>
            block.icon && (
                <IconHeadingLabel {...block} key={block.id} />
            )
        )}
      </section>
    )
  }

  export function IconHeadingLabel(props) {
    const headingAst = parseMarkdown(props.heading)
    const labelAst = parseMarkdown(props.label)

    return (
        <div
            className={
                "iconHeadingLabel flex flex-col gap-2 md:w-1/2 lg:w-1/3 px-2 lg:px-6 " + (props.centered ? "items-center text-center " : "") + styles.content
                + " " + (props.centered ? '' : styles.leftAligned)
            }
            alt={props.icon?.alt}
            >
            <img
                src={props.icon?.url}
                alt={props.icon?.alt}
                key={props.icon?.alt}
            />
            <MarkdownRenderer ast={headingAst} />
            <MarkdownRenderer ast={labelAst} />
        </div>
    )
  }
