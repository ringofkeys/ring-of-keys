import { useRouter } from "next/router"
import Header from "components/Header"
import Footer from "components/Footer"
import Sidebar from "./Sidebar"
import sidebarStyles from "./Sidebar.module.css"

export default function Layout({ children, className, sidebarData }) {
    const router = useRouter()

    return (
        <>
            <Header path={router.pathname} />
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
            <Footer />
        </>
    )
}
