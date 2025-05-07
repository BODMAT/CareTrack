import { MouseImgs } from "../MouseImgs";
import { About } from "./About";
import { ButtonsToModals } from "./ButtonsToModals";

export function PageUser() {
    return (
        <div className="relative">
            <About />
            <ButtonsToModals />

            <MouseImgs />
        </div>
    )
}