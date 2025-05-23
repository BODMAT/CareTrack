import { useForm } from "react-hook-form";
import { useAddAssignment, useUpdateAssignment, useUserAssignments } from "../../hooks/userQuery/useAssignments";
import { useEffect, useMemo, useState } from "react";
import { usePopupStore } from "../../store/popup";
import { useUserAnimals } from "../../hooks/userQuery/useAnimals";
import { Assignment, type IAssignment } from "../../architecture/Assignment";
import type { Work } from "../../architecture/types";

const workOptions: Work[] = ["годування", "прибирання приміщення", "медогляд", "випас"];

export function ModalAssignment({ id }: { id?: string }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<IAssignment>();

    const { addAssignment, status: addStatus } = useAddAssignment();
    const { specialConfirmation, setSpecialConfirmation, close } = usePopupStore();
    const { data: assignment = [] } = useUserAssignments();
    const { data: animals = [] } = useUserAnimals();
    const { updateAssignment, status: changeStatus } = useUpdateAssignment();

    //! щоб розрізняти чи попап для нового наряду або редагування
    const currentAssignment = useMemo(() => assignment?.find(a => a.id === id), [assignment, id]);
    useEffect(() => {
        if (currentAssignment) {
            const correctedAnimalIndex = animals.findIndex(
                animal => animal.id === currentAssignment.animal.id
            );
            setAnimalIndex(correctedAnimalIndex);
            reset({
                animal: currentAssignment.animal.id,
                work: currentAssignment.work,
                price: currentAssignment.price,
            });
        }
    }, [currentAssignment, reset, animals]);

    const [animalIndex, setAnimalIndex] = useState<number>(-1);

    const onSubmit = (assignmentForm: IAssignment) => {
        const assignment = new Assignment(animals[animalIndex], assignmentForm.work, assignmentForm.price, id);
        if (id) {
            updateAssignment.mutate({ id: id, updatedAssignment: assignment })
        } else {
            addAssignment.mutate(assignment, {
                onSuccess: () => reset()
            });
        }
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

            <select className="m-1 w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                {...register("animal", {
                    required: "Оберіть тварину",
                    onChange(event) {
                        const id = event.target.value;
                        const selectedIndex = animals.findIndex(a => a.id === id);
                        setAnimalIndex(selectedIndex);
                    }
                })}
            >
                <option value="">Оберіть тварину</option>
                {animals.map(animal => (
                    <option key={animal.id} value={animal.id}>
                        {animal.name} (Вид: {animal.petSpecies}, {animal.birthYear} року народження)
                    </option>
                ))}
            </select>
            {errors.animal && <p className="text-red-600">{errors.animal.message}</p>}

            <select
                className="m-1 w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                {...register("work", { required: "Оберіть тип роботи" })}
            >
                <option value="">Оберіть тип роботи</option>
                {workOptions.map(work => (
                    <option key={work} value={work}>{work}</option>
                ))}
            </select>
            {errors.work && <p className="text-red-600">{errors.work.message}</p>}

            <div className="relative w-full">
                <input
                    type="number"
                    min={0}
                    step="0.01"
                    className="m-1 w-full pr-10 border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Введіть ціну"
                    {...register("price", {
                        required: "Ціна обов'язкова",
                        valueAsNumber: true,
                        min: { value: 0, message: "Ціна не може бути від’ємною" }
                    })}
                />
                <span className="absolute right-4 top-[50%] -translate-y-1/2 text-gray-500">₴</span>
            </div>
            {errors.price && <p className="text-red-600">{errors.price.message}</p>}

            <div className="flex items-center justify-center gap-3 flex-wrap">
                <button
                    type="submit"
                    className="text-[var(--color-text)] fontText px-8 py-5 rounded-2xl bg-[image:var(--color-background)] border-2 transition-transform hover:scale-95 hover:shadow-xl cursor-pointer"
                >
                    {id ? "Змінити" : "Додати"}
                </button>
                <button
                    type="button"
                    onClick={onClear}
                    className="text-[var(--color-text)] fontText px-8 py-5 rounded-2xl bg-[image:var(--color-background)] border-2 transition-transform hover:scale-95 hover:shadow-xl cursor-pointer"
                >
                    Вийти без збереження змін
                </button>
            </div>

            {addStatus === "success" && <p className="text-green-600 text-center">Наряд додано</p>}
            {addStatus === "error" && <p className="text-red-600 text-center">Не вдалося додати наряд</p>}
            {changeStatus === "success" && <p className="text-green-600 text-center">Наряд змінено</p>}
            {changeStatus === "error" && <p className="text-red-600 text-center">Не вдалося змінити наряд</p>}
        </form >
    );
}
