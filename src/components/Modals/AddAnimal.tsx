import { useForm } from "react-hook-form";
import { useAddAnimal } from "../../hooks/useAnimals";
import { usePopupStore } from "../../store/popup";
import { useEffect } from "react";
import { Animal } from "../../architecture/Animal";
import type { AnimalFormValues } from "../../architecture/types";

export function AddAnimal() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<AnimalFormValues>();
    const { addAnimal, status } = useAddAnimal();
    const { specialConfirmation, setSpecialConfirmation, close } = usePopupStore();

    const onSubmit = (animal: AnimalFormValues) => {
        const { petSpecies, name, birthYear, sex } = animal;
        const booleanSex = sex === "male";

        const newAnimal = new Animal(petSpecies, name, birthYear, booleanSex);
        addAnimal.mutate(newAnimal, {
            onSuccess: () => reset()
        });
    };

    const onClear = () => {
        reset();
        close();
    };

    useEffect(() => {
        if (specialConfirmation) {
            handleSubmit(
                (data) => {
                    alert("Поля валідні, тому зберігаю");
                    onSubmit(data);
                    close();
                },
                () => {
                    alert("Поля не валідні, тому збереження не відбулося");
                    setSpecialConfirmation(false);
                }
            )();
        }
    }, [specialConfirmation]);

    return (
        <form className="fontText flex flex-col gap-2 max-h-[80vh] overflow-y-auto overflow-x-hidden myContainer" onSubmit={handleSubmit(onSubmit)}>
            <input
                className="m-1 w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Введіть назву тварини"
                {...register("petSpecies", {
                    required: "Назва тварини обов'язкова",
                    pattern: {
                        value: /^[a-zA-Zа-яА-ЯіїєґІЇЄҐ\s'-]+$/u,
                        message: "Назва може містити лише літери (укр або англ)"
                    }
                })}
            />
            {errors.petSpecies && <p className="text-red-600">{errors.petSpecies.message}</p>}

            <input
                className="m-1 w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Введіть кличку тварини"
                {...register("name", { required: "Кличка тварини обов'язкова" })}
            />
            {errors.name && <p className="text-red-600">{errors.name.message}</p>}

            <input
                className="m-1 w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                type="number"
                placeholder="Введіть рік народження тварини"
                {...register("birthYear", {
                    required: "Рік народження тварини обов'язковий",
                    valueAsNumber: true,
                    min: {
                        value: 0,
                        message: "Рік не може бути меншим за 0"
                    },
                    max: {
                        value: new Date().getFullYear(),
                        message: `Рік не може бути більшим за ${new Date().getFullYear()}`
                    }
                })}
            />
            {errors.birthYear && <p className="text-red-600">{errors.birthYear.message}</p>}

            <div className="flex gap-3 items-center">
                <label className="block font-medium mb-1">Стать тварини:</label>
                <div className="">
                    <label className="inline-flex items-center mr-4">
                        <input
                            type="radio"
                            value="male"
                            {...register("sex", { required: "Оберіть стать тварини" })}
                        />
                        <span className="ml-2">Самець</span>
                    </label>

                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            value="female"
                            {...register("sex", { required: "Оберіть стать тварини" })}
                        />
                        <span className="ml-2">Самка</span>
                    </label>
                </div>
                {errors.sex && <p className="text-red-600">{errors.sex.message}</p>}
            </div>

            <div className="flex items-center justify-center gap-3 flex-wrap">
                <button
                    type="submit"
                    className="text-[var(--color-text)] fontText px-8 py-5 rounded-2xl bg-[image:var(--color-background)] border-2 transition-transform hover:scale-95 hover:shadow-xl cursor-pointer"
                >
                    Додати
                </button>
                <button
                    type="button"
                    onClick={onClear}
                    className="text-[var(--color-text)] fontText px-8 py-5 rounded-2xl bg-[image:var(--color-background)] border-2 transition-transform hover:scale-95 hover:shadow-xl cursor-pointer"
                >
                    Очистити і вийти
                </button>
            </div>

            {status === "success" && (
                <p className="text-green-600 text-center">Тварина додана</p>
            )}
            {status === "error" && (
                <p className="text-red-600 text-center">Не вдалося додати тварину</p>
            )}
        </form>
    );
}
