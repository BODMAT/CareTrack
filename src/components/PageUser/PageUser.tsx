
import { MouseImgs } from "../MouseImgs";
import { About } from "./About";
import { Animals } from "./Animals";
import { Assignments } from "./Assigments";
import { ButtonsToModals } from "./ButtonsToModals";

export function PageUser() {
    return (
        <div className="relative">
            <About />
            <ButtonsToModals />
            <Animals />
            <Assignments />
            <MouseImgs />
        </div>
    )
}