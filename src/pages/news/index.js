import Layout from "components/Layout"
import Carousel from "components/carousel"
import { request } from "lib/datocms"
import { newsPageQuery } from "queries/news"
// import "./news.css"

export async function getStaticProps() {
  const seo = {
    title: "News",
    description: "Get the latest news from around the Ring of Keys theatre world.",
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
      seo,
      data,
    }
  }
}

export default function News({ data }) {

  return <Layout className={["fullwidth"]}>
    <h1>News</h1>
    <pre>{ JSON.stringify(data, null, 2) }</pre>
    {/* <div className='view-all_nav' >
            <nav styl={{display: 'none'}}>
                <a href='/'>All</a>
                <a href='/'>RoK News</a>
                <a href='/'>Press</a>
                <a href='/'>Events</a>
            </nav>
        </div> */}
    {data.newsletters.length > 0 && (
      <div className="section_news bg_white">
        {/* <Carousel
          heading="Ring of Keys Newsletter"
          itemList={data.newsletters}
          classNames={["carousel__gray"]}
        /> */}
      </div>
    )}
    {data.events.length > 0 && (
      <div className="section_news bg_white">
        {/* <Carousel
          heading="Events"
          itemList={data.events}
          recordType="events"
          classNames={["carousel__gray"]}
        /> */}
      </div>
    )}
    {data.pressReleases.length > 0 && (
      <div className="section_news bg_white">
        {/* <Carousel
          heading="Press Releases"
          itemList={data.pressReleases}
          recordType="news"
          classNames={["carousel__gray"]}
        /> */}
      </div>
    )}
  </Layout>
}