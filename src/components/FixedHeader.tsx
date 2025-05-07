import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


export function FixedHeader() {
    const { user, login, logout, loading } = useAuth()
    function handleLoginOrLogout() {
        if (!user) {
            login();
        } else {
            logout();
        }
    }
    const currentPath: string = useLocation().pathname;
    return (
        <header className="relative z-20">
            <div className="fixed w-full h-[100px] bg-[image:var(--color-fixed)] transitioned">
                <div className="myContainer h-full flex gap-7 justify-between items-center">
                    <Link to="/" className="fontTitle font-bold text-[30px] text-[var(--color-text)] transitioned max-[450px]:text-[23px]">CareTrack</Link>
                    <div className="flex gap-5 max-sm:gap-1">
                        {user?.role === "admin" && (
                            <Link className="text-[var(--color-text)] fontText px-8 py-5 text-center rounded-2xl bg-[image:var(--color-background)] border-2 transition-transform transform hover:scale-110 hover:rotate-3 hover:shadow-xl cursor-pointer transitioned max-sm:text-[12px] max-[450px]:py-3 max-[450px]:px-2" to={currentPath.includes("admin") ? "/dashboard" : "/admin"}>{currentPath.includes("admin") ? "Dashboard" : "Admin панель"}</Link>
                        )}
                        <button onClick={() => handleLoginOrLogout()} className="text-[var(--color-text)] fontText px-8 py-5 rounded-2xl bg-[image:var(--color-background)] border-2 transition-transform transform hover:scale-110 hover:rotate-3 hover:shadow-xl cursor-pointer transitioned max-sm:text-[12px] max-[450px]:py-3 max-[450px]:px-2">
                            {loading ? "Завантаження..." : user ? "Вийти" : "Увійти"}
                        </button>
                    </div>


                </div>
            </div>
        </header>
    )
}