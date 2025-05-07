import { Outlet } from "react-router-dom";
import { FixedHeader } from "./FixedHeader";
import { FixedFooter } from "./FixedFooter";

export function Layout() {
    return (
        <div className="flex flex-col min-h-screen overflow-hidden">
            <FixedHeader />
            <main className="flex-[1_1_auto] pt-[100px] transitioned bg-[image:var(--color-background)] ">
                <Outlet />
            </main>
            <FixedFooter />
        </div>
    );
}