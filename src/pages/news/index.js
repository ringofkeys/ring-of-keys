import Layout from "components/Layout"
import Carousel from "components/Carousel"
import { request, requestLayoutProps } from "lib/datocms"
import { newsPageQuery } from "queries/news"
import QuoteBlock from "components/PageContent/PageBlock/QuoteBlock"
// import "./news.css"

export async function getStaticProps() {
    const layoutData = await requestLayoutProps()
    const seo = {
        title: "News",
        description:
            "Get the latest news from around the Ring of Keys theatre world.",
    }

    // TODO: Add footer quote
    // footerQuoteAttribution="Kristin Kelly, Key Member (she/her)"
    //   footerQuoteText={
    //     <blockquote>
    //       With networks like Ring of Keys, I feel like my queer singing heart has
    //       a place and community and I can make work as a queer director.
    //     </blockquote>
    //   }

    const data = await request({
        query: newsPageQuery,
    })

    return {
        props: {
            layoutData,
            seo,
            data,
        },
    }
}

export default function News({ layoutData, seo, data }) {
    const {
        industryNews,
        pressReleases,
        newsletters,
        events,
    } = data

    return (
        <Layout
            layoutData={layoutData}
            className={"news fullWidth"}>
            {/* <div className='view-all_nav' >
            <nav styl={{display: 'none'}}>
                <a href='/'>All</a>
                <a href='/'>RoK News</a>
                <a href='/'>Press</a>
                <a href='/'>Events</a>
            </nav>
        </div> */}
            {newsletters.length > 0 && (
                <div className="section_news bg_white">
                    <Carousel
                        heading="Ring of Keys Newsletter"
                        entryList={newsletters}
                        classNames={["carousel__gray"]}
                    />
                </div>
            )}
            {events.length > 0 && (
                <div className="section_news bg_white">
                    <Carousel
                        heading="Events"
                        entryList={events}
                        entryType="events"
                        classNames={["carousel__gray"]}
                    />
                </div>
            )}
            {pressReleases.length > 0 && (
                <div className="section_news bg_white">
                    <Carousel
                        heading="Press Releases"
                        entryList={pressReleases}
                        entryType="pressRelease"
                        classNames={["carousel__gray"]}
                    />
                </div>
            )}
            <QuoteBlock
                backgroundColor="#bf662f"
                textColor="hsla(0, 0%, 100%, .94)"
                quoteText="With networks like Ring of Keys, I feel like my queer singing heart has a place and community and I can make work as a queer director."
                quoteAttribution="Kristin Kelly, Key Member (she/her)"
            />
        </Layout>
    )
}
