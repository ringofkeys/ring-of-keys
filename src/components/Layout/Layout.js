import Header from '../Header'
import { useRouter } from 'next/router'

export default function Layout({ children }) {
    const router = useRouter()

    return (<>
        <Header path={router.pathname} />
        { children }
    </>)
}