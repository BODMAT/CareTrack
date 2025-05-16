import { useUpdateCare, useUserCares } from "../../hooks/userQuery/useCare";
import { useUserAssignments } from "../../hooks/userQuery/useAssignments";
import type { Assignment } from "../../architecture/Assignment";
import { Care } from "../../architecture/Care";
import { useEffect, useMemo, useState } from "react";

export function AddAssignmentFromMethod({ careId }: { careId: string }) {
    const { data: assignments = [] } = useUserAssignments();
    const { updateCare, status: updateStatus } = useUpdateCare();
    const { data: cares = [] } = useUserCares();
    const currentCare = useMemo(() => cares.find(c => c.id === careId), [cares, careId]);

    const [tempAddedIds, setTempAddedIds] = useState<Set<string>>(new Set());

    const toAdd = (assignment: Assignment) => {
        if (currentCare) {
            const updatedCare = new Care(
                currentCare.ownersSurname,
                currentCare.date,
                [...currentCare.assignments],
                currentCare.id
            );
            updatedCare.addOrder(assignment);
            updateCare.mutate(
                { id: updatedCare.id, updatedCare },
                {
                    onSuccess: () => {
                        setTempAddedIds(prev => new Set(prev).add(assignment.id));
                    },
                }
            );
        }
    };

    // Очистка тимчасових ID після оновлення
    useEffect(() => {
        setTempAddedIds(new Set());
    }, [currentCare?.assignments]);

    const isAlreadyAdded = (assignmentId: string) =>
        currentCare?.assignments?.some((a) => a.id === assignmentId) || tempAddedIds.has(assignmentId);


    return (
        <div className="fontText text-left max-h-[80vh] overflow-y-auto overflow-x-hidden myContainer">
            <div className="flex flex-col">
                {[...new Map(assignments.map(a => [a.id, a])).values()].map((assignment: Assignment) => (
                    <button
                        onClick={() => {
                            if (
                                !isAlreadyAdded(assignment.id) &&
                                assignment.animal.name !== "Тварина можливо була примусово видалена з іншого місця"
                            ) {
                                toAdd(assignment);
                            }
                        }}
                        key={assignment.id}
                        className={`mb-1 p-2 rounded-xl cursor-pointer border-2 transitioned hover:scale-95
        ${assignment.animal.name === "Тварина можливо була примусово видалена з іншого місця" ? "bg-red-500" : ""}
        ${isAlreadyAdded(assignment.id) ? "bg-green-500" : ""}`}
                    >
                        <span className="text-sm">Назва: {assignment.animal.name} </span>
                        <span className="text-sm">Вид: {assignment.animal.petSpecies} </span>
                        <span className="text-sm">Рік: {assignment.animal.birthYear} </span>
                        <span className="text-sm">Стать: {assignment.animal.sex ? "самець" : "самка"}</span>
                        <p className="text-sm">Робота: {assignment.work}</p>
                        <p className="text-sm">Ціна: {assignment.price} грн</p>
                    </button>
                ))}
            </div>
            {updateStatus === "success" && <p className="text-green-600 text-center">Наряд додано</p>}
            {updateStatus === "error" && <p className="text-red-600 text-center">Не вдалося додати наряд</p>}
        </div>
    )
}