import { SwitchTheme } from "./SwitchTheme";

export function FixedFooter() {
    return (
        <footer className="w-full h-[100px] bg-[image:var(--color-fixed)] transitioned">
            <div className="myContainer h-full items-center flex justify-between gap-7 max-[480px]:flex-col-reverse max-[480px]:gap-3 max-[480px]:justify-center">
                <h3 className="fontText text-[var(--color-text)]">Lab 4 OOP. All rights reserved, 2025</h3>
                <SwitchTheme />
            </div>
        </footer>
    )
}