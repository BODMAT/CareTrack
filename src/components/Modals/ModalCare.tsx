import { Controller, useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { usePopupStore } from "../../store/popup";
import { useUserAssignments } from "../../hooks/useAssignments";
import Select from "react-select";
import { useAddCare, useUpdateCare, useUserCares } from "../../hooks/useCare";
import { Care, type ICare } from "../../architecture/Care";
import type { Assignment } from "../../architecture/Assignment";
import type { ISelectAssignment } from "../../architecture/types";

export function ModalCare({ id }: { id?: string }) {
    const { register, handleSubmit, formState: { errors }, reset, control, setValue } = useForm<ICare>();
    const { specialConfirmation, setSpecialConfirmation, close } = usePopupStore();
    const { addCare, status: addStatus } = useAddCare();
    const { data: assignments = [] } = useUserAssignments();
    const { data: cares = [] } = useUserCares();
    const [assignmentIndex, setAssignmentIndex] = useState<number[]>([]);
    const { updateCare, status: updateStatus } = useUpdateCare();

    //! щоб розрізняти чи попап для нового догляду або редагування
    const currentCare = useMemo(() => cares?.find(a => a.id === id), [cares, id]);

    useEffect(() => {
        if (currentCare && assignments.length > 0) {
            const selectedOptions: ISelectAssignment[] = currentCare.assignments
                .map(assignment => {
                    const index = assignments.findIndex(a => a.id === assignment.id);
                    if (index !== -1) {
                        const a = assignments[index];
                        return {
                            ...a,
                            value: a.id,
                            label: `${a.animal.name} (Вид: ${a.animal.petSpecies}, ${a.animal.birthYear} року народження), ${a.work}, ${a.price} грн`,
                            index
                        };
                    }
                    return null;
                })
                .filter((opt): opt is ISelectAssignment => opt !== null);

            setAssignmentIndex(selectedOptions.map(opt => opt.index));

            reset({
                assignments: selectedOptions,
                ownersSurname: currentCare.ownersSurname,
                date: currentCare.date,
            });
        }
    }, [currentCare, reset, assignments])

    const onSubmit = (care: ICare) => {
        const resultCare = new Care(
            care.ownersSurname,
            care.date,
            assignmentIndex.map(index => assignments[index]),
            id
        )
        if (id) {
            updateCare.mutate({ id: id, updatedCare: resultCare })
        } else {
            addCare.mutate(
                resultCare
                ,
                { onSuccess: () => reset() }
            );
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
                        onChange={handleSelectChange}
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

            {addStatus === "success" && <p className="text-green-600 text-center">Догляд додано</p>}
            {addStatus === "error" && <p className="text-red-600 text-center">Не вдалося додати догляд</p>}
            {updateStatus === "success" && <p className="text-green-600 text-center">Догляд змінено</p>}
            {updateStatus === "error" && <p className="text-red-600 text-center">Не вдалося змінити догляд</p>}
        </form>
    );
}
