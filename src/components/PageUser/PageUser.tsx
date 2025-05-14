
import { MouseImgs } from "../MouseImgs";
import { About } from "./About";
import { Animals } from "./Animals";
import { Assignments } from "./Assigments";
import { ButtonsToModals } from "./ButtonsToModals";
import { Cares } from "./Cares";

export function PageUser() {
    return (
        <div className="relative">
            <About />
            <ButtonsToModals />
            <Animals />
            <Assignments />
            <Cares />
            <MouseImgs />
        </div>
    )
}