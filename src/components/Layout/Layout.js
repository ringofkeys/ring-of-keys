import { useRouter } from "next/router"
import Header from "components/Header"
import Footer from "components/Footer"
import Sidebar from "./Sidebar"
import sidebarStyles from "./Sidebar.module.css"
import QuoteBlock from "components/PageContent/PageBlock/QuoteBlock"

export default function Layout({ layoutData, children, className, sidebarData, quote }) {
    const router = useRouter()

    return (
        <>
            <Header path={router.asPath} menu={layoutData.menu} key={router.asPath} />
            <main
                className={
                    router.asPath.slice(1).replace("/", "_") +
                    " " +
                    (sidebarData ? sidebarStyles.hasSidebar : "") +
                    " " +
                    className
                }
            >
                <div>{children}</div>
                {sidebarData && <Sidebar data={sidebarData} />}
            </main>
            {quote && <QuoteBlock {...quote}/>}
            <Footer />
        </>
    )
}
