import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { usePopupStore } from "../../store/popup";
import { useUserAssignments } from "../../hooks/useAssignments";
import Select from "react-select";
import { useAddCare } from "../../hooks/useCare";
import { Care, type ICare } from "../../architecture/Care";
import type { Assignment } from "../../architecture/Assignment";
import { useAuth } from "../../hooks/useAuth";

export function ModalCare() {
    const { register, handleSubmit, formState: { errors }, reset, control, setValue } = useForm<ICare>();
    const { specialConfirmation, setSpecialConfirmation, close } = usePopupStore();
    const { addCare, status } = useAddCare();
    const { data: assignments = [] } = useUserAssignments();
    const [assignmentIndex, setAssignmentIndex] = useState<number[]>([]);
    const { user } = useAuth()

    const onSubmit = (care: ICare) => {
        addCare.mutate(
            new Care(
                care.ownersSurname,
                care.date,
                assignmentIndex.map(index => assignments[index])
            ),
            { onSuccess: () => reset() }
        );
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

    const assignmentOptions = assignments.map((assignment, index) => ({
        ...assignment,
        value: assignment.id,
        label: `${assignment.animal.name} (Вид: ${assignment.animal.petSpecies}, ${assignment.animal.birthYear} року народження), ${assignment.work}, ${assignment.price} грн`,
        index
    })) as unknown as Assignment[]; // погана практика але тут допустимо

    // Функція для обробки вибору елементів
    const handleSelectChange = (selectedOptions: any) => {
        const selectedIndices = selectedOptions.map((option: any) => option.index);
        setAssignmentIndex(selectedIndices);
        setValue("assignments", selectedOptions);
    };

    return (
        <form className="fontText flex flex-col gap-2 max-h-[80vh] overflow-y-auto overflow-x-hidden myContainer" onSubmit={handleSubmit(onSubmit)}>

            <input
                defaultValue={(user && user.displayName) ? user.displayName : ""}
                type="text"
                className="m-1 w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Введіть прізвище власника"
                {...register("ownersSurname", { required: "Прізвище власника обов'язкове" })}
            />
            {errors.ownersSurname && <p className="text-red-600">{errors.ownersSurname.message}</p>}

            <input
                type="date"
                className="m-1 w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                {...register("date", { required: "Дата обов'язкова" })}
            />
            {errors.date && <p className="text-red-600">{errors.date.message}</p>}

            <Controller
                name="assignments"
                control={control}
                rules={{ required: "Оберіть свої Наряди" }}
                render={({ field }) => (
                    <Select
                        {...field}
                        isMulti
                        options={assignmentOptions}
                        onChange={handleSelectChange} // Обробник зміни
                        classNamePrefix="select"
                        className="m-1 w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                )}
            />
            {errors.assignments && <p className="text-red-600">{errors.assignments.message}</p>}

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

            {status === "success" && <p className="text-green-600 text-center">Догляд додано</p>}
            {status === "error" && <p className="text-red-600 text-center">Не вдалося додати догляд</p>}
        </form>
    );
}
