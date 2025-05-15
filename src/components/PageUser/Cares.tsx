import { useDeleteCare, useUserCares } from "../../hooks/useCare";
import { usePopupStore } from "../../store/popup";
import { checkBeforeDelete } from "../../utils/utils";
import CrossSVG from "../../assets/cross.svg";
import EditSVG from "../../assets/edit.svg";
import { ModalCare } from "../Modals/ModalCare";
import type { Assignment } from "../../architecture/Assignment";
import type { Care } from "../../architecture/Care";
import { AddAssignmentFromMethod } from "../Modals/AddAssignmentFromMethod";

export function Cares() {
  const { data: cares, isLoading, error } = useUserCares();
  const { deleteCare } = useDeleteCare();
  const { open } = usePopupStore();

  if (isLoading) {
    return <p className="myContainer text-[var(--color-text)] fontTitle text-[26px] mb-4 md:indent-5">Завантаження...</p>;
  }

  if (error) {
    return <p className="myContainer text-[var(--color-text)] fontTitle text-[26px] mb-4 md:indent-5">Помилка при завантаженні доглядів.</p>;
  }

  if (!cares || cares.length === 0) {
    return <p className="myContainer text-[var(--color-text)] fontTitle text-[26px] mb-4 md:indent-5">У вас ще немає жодного догляду.</p>;
  }
  return (
    <section className="myContainer transitioned text-[var(--color-text)] py-15 border-t-2">
      <h2 className="fontTitle text-[26px] mb-4 md:indent-5">Догляди:</h2>
      <div className="flex flex-wrap gap-7">
        {[...new Map(cares.map(c => [c.id, c])).values()].map((care: Care) => (

          <div key={care.id} className="flex-1/4 max-xl:flex-1/3 max-lg:flex-1/2 max-md:flex-[1_1_100%] p-4 rounded-xl bg-[var(--color-card)] shadow border flex justify-between items-start">
            <div>
              <p className="font-semibold">Власник: {care.ownersSurname}</p>
              <p className="font-semibold mb-3">Обрані наряди:</p>

              {[...new Map(care.assignments.map(a => [a.id, a])).values()].map((assignment: Assignment) => (
                <div
                  key={assignment.id}
                  className={`mb-1 p-2 ${assignment.animal.name === "Тварина можливо була примусово видалена з іншого місця" ? "bg-red-500 rounded-xl" : ""}`}
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
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => checkBeforeDelete(() => deleteCare.mutate(care.id))}
                className="cursor-pointer transitioned hover:scale-90 w-6"
              >
                <img className="w-6" src={CrossSVG} alt="cross" />
              </button>
              <button
                onClick={() => open("Форма для редагування завдання", <ModalCare id={care.id} />, true)}
                className="cursor-pointer transitioned hover:scale-90 w-7"
              >
                <img className="w-7" src={EditSVG} alt="edit" />
              </button>
              <button
                onClick={() => open("Форма для додавання наряду до догляду", <AddAssignmentFromMethod careId={care.id} />, false)}
                className="cursor-pointer transitioned hover:scale-90 w-7"
              >
                <img className="w-6.5 pl-1 rotate-45" src={CrossSVG} alt="add" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}