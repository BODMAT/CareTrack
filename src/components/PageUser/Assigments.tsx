import { useDeleteAssignment, useUserAssignments } from "../../hooks/useAssignments";
import { usePopupStore } from "../../store/popup";
import { checkBeforeDelete } from "../../utils/utils";
import CrossSVG from "../../assets/cross.svg";
import EditSVG from "../../assets/edit.svg";
import { ModalAssignment } from "../Modals/ModalAssignment";

export function Assignments() {
    const { data: assignments, isLoading, error } = useUserAssignments();
    const { deleteAssignment } = useDeleteAssignment();
    const { open } = usePopupStore();

    if (isLoading) {
        return <p className="myContainer text-[var(--color-text)] fontTitle text-[26px] mb-4 md:indent-5">Завантаження...</p>;
    }

    if (error) {
        return <p className="myContainer text-[var(--color-text)] fontTitle text-[26px] mb-4 md:indent-5">Помилка при завантаженні нарядів.</p>;
    }

    if (!assignments || assignments.length === 0) {
        return <p className="myContainer text-[var(--color-text)] fontTitle text-[26px] mb-4 md:indent-5">У вас ще немає жодного наряду.</p>;
    }

    return (
        <section className="myContainer transitioned text-[var(--color-text)] py-15 border-t-2">
            <h2 className="fontTitle text-[26px] mb-4 md:indent-5">Наряди:</h2>
            <div className="flex flex-wrap gap-7">
                {assignments.map((assignment) => (
                    <div key={assignment.id} className={`flex-1/4 max-xl:flex-1/3 max-lg:flex-1/2 max-md:flex-[1_1_100%] p-4 rounded-xl bg-[var(--color-card)] shadow border flex justify-between items-start ${assignment.animal.name === "Тварина можливо була примусово видалена з іншого місця" ? "bg-red-500 rounded-xl" : ""}`}>
                        <div>
                            <p className="font-semibold">{assignment.animal.name}</p>
                            <span className="text-sm">Вид: {assignment.animal.petSpecies} </span>
                            <span className="text-sm">Рік: {assignment.animal.birthYear} </span>
                            <span className="text-sm">Стать: {assignment.animal.sex ? "самець" : "самка"}</span>
                            <p className="text-sm">Робота: {assignment.work}</p>
                            <p className="text-sm">Ціна: {assignment.price} грн</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => checkBeforeDelete(() => deleteAssignment.mutate(assignment.id))}
                                className="cursor-pointer transitioned hover:scale-90 w-6"
                            >
                                <img className="w-6" src={CrossSVG} alt="cross" />
                            </button>
                            <button
                                onClick={() => open("Форма для редагування завдання", <ModalAssignment />, true)} //!props!!!
                                className="cursor-pointer transitioned hover:scale-90 w-7"
                            >
                                <img className="w-7" src={EditSVG} alt="edit" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
