import { Suspense } from "react";
import Nav from "./nav";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <Suspense fallback="...">
            <Nav />
            <main className="flex min-h-screen w-full flex-col py-32 max-w-7xl m-auto p-5">
                <Outlet />
            </main>
        </Suspense>
    )
}