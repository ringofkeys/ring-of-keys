import { Image } from "react-datocms";
import { request } from '../../lib/datocms'
import Layout from '../../components/Layout'
import { ALL_KEY_SLUGS_QUERY, KEY_QUERY } from './queries'

export default function KeyPage(props) {
    return (<Layout>
        <Image data={ props.headshot.responsiveImage } />
        <pre>
            { JSON.stringify(props, null, 2) }
        </pre>
    </Layout>)
}

export async function getServerSideProps(context) {
    const data = await request({
        query: KEY_QUERY,
        variables: {
            slug: context.params.slug,
        }
    })

    console.log(data)

    return {
        props: data.key,
    }
}