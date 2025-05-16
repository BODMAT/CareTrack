import { AdminAnimals } from "./AdminAnimals";
import { AdminAssignments } from "./AdminAssignments";
import { AdminCares } from "./AdminCares";

export function PageAdmin() {
    return (
        <div className="relative">
            <AdminAnimals />
            <AdminAssignments />
            <AdminCares />
        </div>
    )
}