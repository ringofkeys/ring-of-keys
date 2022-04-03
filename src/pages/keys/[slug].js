import { Image } from "react-datocms"
import { request } from "lib/datocms"
import Layout from "components/Layout"
import { KEY_QUERY } from "queries/keys"

export default function KeyPage(props) {
  return (
    <Layout>
      <Image data={props.headshot.responsiveImage} />
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const data = await request({
    query: KEY_QUERY,
    variables: {
      slug: context.params.slug,
    },
  })

  return {
    props: data.key,
  }
}
