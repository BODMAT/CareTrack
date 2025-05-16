import { useAdminCares, useDeleteAdminCare } from "../../hooks/adminQuery/useAdminCares";
import { checkBeforeDelete } from "../../utils/utils";
import CrossSVG from "../../assets/cross.svg";
import type { Assignment } from "../../architecture/Assignment";
import type { Care } from "../../architecture/Care";

export function AdminCares() {
    const { data: adminGroups, isLoading, error } = useAdminCares();
    const { deleteCare } = useDeleteAdminCare();

    if (isLoading) {
        return <p className="myContainer text-[var(--color-text)] fontTitle text-[26px] mb-4 md:indent-5">Завантаження...</p>;
    }

    if (error) {
        return <p className="myContainer text-[var(--color-text)] fontTitle text-[26px] mb-4 md:indent-5">Помилка при завантаженні доглядів.</p>;
    }

    if (!adminGroups || adminGroups.length === 0) {
        return <p className="myContainer text-[var(--color-text)] fontTitle text-[26px] mb-4 md:indent-5">Жодного догляду не знайдено.</p>;
    }

    return (
        <section className="myContainer transitioned text-[var(--color-text)] py-15 border-t-2">
            <h2 className="fontTitle text-[36px] mb-4 md:indent-5">Усі догляди користувачів:</h2>

            {adminGroups.map(group => (
                <div key={group.user.id}>
                    <h3 className="text-lg font-bold mt-6 mb-2">
                        Користувач: {group.user.displayName || group.user.email || group.user.id}
                    </h3>

                    <div className="flex flex-wrap gap-7">
                        {[...new Map(group.cares.map(c => [c.id, c])).values()].map((care: Care) => (
                            <div
                                key={care.id}
                                className="flex-1/4 max-xl:flex-1/3 max-lg:flex-1/2 max-md:flex-[1_1_100%] p-4 rounded-xl bg-[var(--color-card)] shadow border flex justify-between items-start"
                            >
                                <div>
                                    <p className="font-semibold">Власник: {care.ownersSurname}</p>
                                    <p className="font-semibold mb-3">Обрані наряди:</p>

                                    {[...new Map(care.assignments.map(a => [a.id, a])).values()].map((assignment: Assignment) => (
                                        <div
                                            key={assignment.id}
                                            className={`mb-1 p-2 ${assignment.animal.name === "Тварина можливо була примусово видалена з іншого місця"
                                                ? "bg-red-500 rounded-xl"
                                                : ""
                                                }`}
                                        >
                                            <span className="text-sm">Назва: {assignment.animal.name} </span>
                                            <span className="text-sm">Вид: {assignment.animal.petSpecies} </span>
                                            <span className="text-sm">Рік: {assignment.animal.birthYear} </span>
                                            <span className="text-sm">Стать: {assignment.animal.sex ? "самець" : "самка"}</span>
                                            <p className="text-sm">Робота: {assignment.work}</p>
                                            <p className="text-sm">Ціна: {assignment.price} грн</p>
                                        </div>
                                    ))}

                                    <p>Коротка інформація (з методу): {care.toShortString()}</p>
                                    <p className="text-xs text-gray-400 mt-1">UID: {group.user.id}</p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            checkBeforeDelete(() =>
                                                deleteCare.mutate({ uid: group.user.id, id: care.id })
                                            )
                                        }
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
