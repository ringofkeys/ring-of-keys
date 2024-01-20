import styles from "styles/donate.module.css"
import Layout from "components/Layout"
import DonorBoxWidget from "components/DonorBoxWidget"
import { MarkdownRenderer, parseMarkdown } from "lib/markdown"
import { pageQuery } from "queries/page"
import { request, requestLayoutProps } from "lib/datocms"

export async function getStaticProps() { 
    const layoutData = await requestLayoutProps()

    const data = await request({
        query: pageQuery,
        variables: {
            slug: "donate",
        },
    })

    return {
        props: {
            layoutData,
            pageData: data.page
        }
    }
}


const Donate = ({ layoutData, pageData }) => {
    const quote = parseMarkdown(pageData.content?.find((el) => el.area === "quote").content)
    const rightCol = parseMarkdown(pageData.content?.find((el) => el.area === "rightCol").content)
    
    // add in Blockquote class
    quote.children[0].properties = Object.assign(quote.children[0].properties || {}, {class: "quote_graphic-bar"})


    return (
        <Layout
            layoutData={layoutData}
            className={styles.donate}
            title="Donate"
            description={`Your tax-deductible donation supports Ring of Key's mission to promote the hiring of self-identifying 
        queer women and TGNC artists in the musical theatre industry.`}
        >
            <h1>Donate</h1>
            {pageData.content && (<>
            <MarkdownRenderer ast={quote} />
            <section
                style={{
                    display: "flex",
                    flexWrap: "wrap-reverse",
                    gap: "2rem",
                }}
            >
                <DonorBoxWidget />
                <div style={{ flex: "30%" }}>
                    <MarkdownRenderer ast={rightCol} />
                </div>
            </section></>)
            }
        </Layout>
    )
}
export default Donate