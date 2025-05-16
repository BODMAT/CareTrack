import { useAdminAssignments, useDeleteAdminAssignment } from "../../hooks/adminQuery/useAdminAssignments";
import { checkBeforeDelete } from "../../utils/utils";
import CrossSVG from "../../assets/cross.svg";

export function AdminAssignments() {
    const { data, isLoading, error } = useAdminAssignments();
    const { deleteAssignment } = useDeleteAdminAssignment();

    if (isLoading) {
        return <p className="myContainer text-[var(--color-text)] fontTitle text-[26px] mb-4 md:indent-5">Завантаження...</p>;
    }

    if (error) {
        return <p className="myContainer text-[var(--color-text)] fontTitle text-[26px] mb-4 md:indent-5">Помилка при завантаженні нарядів.</p>;
    }

    if (!data || data.length === 0) {
        return <p className="myContainer text-[var(--color-text)] fontTitle text-[26px] mb-4 md:indent-5">Немає жодного наряду в базі.</p>;
    }

    return (
        <section className="myContainer transitioned text-[var(--color-text)] py-15 border-t-2">
            <h2 className="fontTitle text-[36px] mb-4 md:indent-5">Усі наряди користувачів:</h2>

            {data.map(({ user, assignments }) => (
                <div key={user.id} className="mb-10">
                    <h3 className="text-xl font-semibold mb-2">{user.displayName || user.email || user.id}</h3>
                    <div className="flex flex-wrap gap-7">
                        {assignments.map((assignment) => (
                            <div key={assignment.id} className={`flex-1/4 max-xl:flex-1/3 max-lg:flex-1/2 max-md:flex-[1_1_100%] p-4 rounded-xl bg-[var(--color-card)] shadow border flex justify-between items-start ${assignment.animal.name === "Тварина можливо була примусово видалена з іншого місця" ? "bg-red-500 rounded-xl" : ""}`}>
                                <div>
                                    <p className="font-semibold">{assignment.animal.name}</p>
                                    <span className="text-sm">Вид: {assignment.animal.petSpecies}</span><br />
                                    <span className="text-sm">Рік: {assignment.animal.birthYear}</span><br />
                                    <span className="text-sm">Стать: {assignment.animal.sex ? "самець" : "самка"}</span>
                                    <p className="text-sm mt-1">Робота: {assignment.work}</p>
                                    <p className="text-sm">Ціна: {assignment.price} грн</p>
                                    <p className="text-xs text-gray-400 mt-1">UID: {user.id}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => checkBeforeDelete(() =>
                                            deleteAssignment.mutate({ uid: user.id, id: assignment.id })
                                        )}
                                        className="cursor-pointer transitioned hover:scale-90 w-6"
                                    >
                                        <img className="w-6" src={CrossSVG} alt="cross" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </section>
    );
}
