import { useAdminAnimals, useDeleteAdminAnimal } from "../../hooks/adminQuery/useAdminAnimals";
import CrossSVG from "../../assets/cross.svg";
import type { IAnimal } from "../../architecture/Animal";
import { checkBeforeDelete } from "../../utils/utils";

export function AdminAnimals() {
    const { data: usersWithAnimals, isLoading, error } = useAdminAnimals();
    const { deleteAnimal } = useDeleteAdminAnimal();

    if (isLoading) {
        return <p className="myContainer text-[var(--color-text)] fontTitle text-[26px] mb-4 md:indent-5">Завантаження...</p>;
    }

    if (error) {
        return <p className="myContainer text-[var(--color-text)] fontTitle text-[26px] mb-4 md:indent-5">Помилка при завантаженні тварин.</p>;
    }

    if (!usersWithAnimals || usersWithAnimals.length === 0) {
        return <p className="myContainer text-[var(--color-text)] fontTitle text-[26px] mb-4 md:indent-5">Жодної тварини не знайдено.</p>;
    }

    return (
        <section className="myContainer transitioned text-[var(--color-text)] py-15 border-t-2">
            <h2 className="fontTitle text-[36px] mb-4 md:indent-5">Усі тварини користувачів:</h2>
            <div className="flex flex-wrap gap-7">
                {usersWithAnimals.map(({ user, animals }) => (
                    <div key={user.id} className="w-full">
                        <h3 className="mb-3 text-2xl font-semibold">Користувач: {user.email} ({user.displayName || user.id})</h3>
                        <div className="flex flex-wrap gap-7 mb-8">
                            {animals.map((animal: IAnimal) => (
                                <div
                                    key={animal.id}
                                    className="flex-1/5 max-xl:flex-1/4 max-lg:flex-1/3 max-md:flex-1/2 max-sm:flex-[1_1_100%] p-4 rounded-xl bg-[var(--color-card)] shadow border flex justify-between items-start"
                                >
                                    <div>
                                        <p className="font-semibold">{animal.name}</p>
                                        <p className="text-sm">Вид: {animal.petSpecies}</p>
                                        <p className="text-sm">Рік народження: {animal.birthYear}</p>
                                        <p className="text-sm">Стать: {animal.sex ? "самець" : "самка"}</p>
                                        <p className="text-xs text-gray-400 mt-1">UID: {user.id}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                checkBeforeDelete(() => deleteAnimal.mutate({ id: animal.id, uid: user.id }))
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
            </div>
        </section>
    );
}
