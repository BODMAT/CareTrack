import type { IAnimal } from "../../architecture/Animal";
import { useDeleteAnimal, useUserAnimals } from "../../hooks/userQuery/useAnimals";
import CrossSVG from "../../assets/cross.svg";
import EditSVG from "../../assets/edit.svg";
import { checkBeforeDelete } from "../../utils/utils";
import { ModalAnimal } from "../Modals/ModalAnimal";
import { usePopupStore } from "../../store/popup";

export function Animals() {
    const { data: animals, isLoading, error } = useUserAnimals();
    const { deleteAnimal } = useDeleteAnimal();
    const { open } = usePopupStore();

    if (isLoading) {
        return <p className="myContainer text-[var(--color-text)] fontTitle text-[26px] mb-4 md:indent-5">Завантаження...</p>;
    }

    if (error) {
        return <p className="myContainer text-[var(--color-text)] fontTitle text-[26px] mb-4 md:indent-5">Помилка при завантаженні тварин.</p>;
    }

    if (!animals || animals.length === 0) {
        return <p className="myContainer text-[var(--color-text)] fontTitle text-[26px] mb-4 md:indent-5">У вас ще немає жодної тварини.</p>;
    }

    return (
        <section className="myContainer transitioned text-[var(--color-text)] py-15 border-t-2">
            <h2 className="fontTitle text-[26px] mb-4 md:indent-5">Тварини:</h2>
            <div className="flex flex-wrap gap-7 ">
                {animals.map((animal: IAnimal) => (
                    <div key={animal.id} className="flex-1/5 max-xl:flex-1/4 max-lg:flex-1/3 max-md:flex-1/2 max-sm:flex-[1_1_100%] p-4 rounded-xl bg-[var(--color-card)] shadow border flex justify-between items-start">
                        <div key={animal.id} className="">
                            <p className="font-semibold">{animal.name}</p>
                            <p className="text-sm">Вид: {animal.petSpecies}</p>
                            <p className="text-sm">Рік народження: {animal.birthYear}</p>
                            <p className="text-sm">Стать: {animal.sex ? "самець" : "самка"}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => checkBeforeDelete(() => deleteAnimal.mutate(animal.id))} className="cursor-pointer transitioned hover:scale-90 w-6">
                                <img className="w-6" src={CrossSVG} alt="cross" />
                            </button>
                            <button onClick={() => { open("Форма для редагування тварини", <ModalAnimal id={animal.id} />, true) }} className="cursor-pointer transitioned hover:scale-90 w-7">
                                <img className="w-7" src={EditSVG} alt="edit" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section >
    )
}