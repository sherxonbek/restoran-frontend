import { Outlet } from "react-router-dom"
import OfitsiantNavbar from "./OfitsiantNavbar"

function OfLayout() {
    return (
        <div className="flex flex-col h-screen w-full justify-between overflow-hidden">
            <OfitsiantNavbar />

            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>

        </div>
    )
}

export default OfLayout