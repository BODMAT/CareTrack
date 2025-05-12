import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { usePopupStore } from "../../store/popup"
import { textFromTopAnimation } from "../../utils/animations";
import { ModalAnimal } from "../Modals/ModalAnimal";
import { ModalCare } from "../Modals/ModalCare";
import { ModalAssignment } from "../Modals/ModalAssignment";
export function ButtonsToModals() {
    const { open } = usePopupStore();
    const { user } = useAuth()

    return (
        <motion.section
            initial={"hidden"}
            whileInView={"visible"}
            viewport={{ once: false, amount: 0.2 }}
            className="myContainer pt-10 pb-5 transitioned text-[var(--color-text)] flex items-center gap-10 max-md:flex-col max-md:text-center max-md:gap-3">
            <motion.h2 variants={textFromTopAnimation} className='md:indent-5 fontTitle text-[30px] mb-4'>Кнопки для відкриття форм:</motion.h2>
            <div className="flex gap-2 max-[450px]:flex-col">
                <button
                    onClick={() => { user ? open("Форма для додавання тварини", <ModalAnimal />, true) : open("Notification", <p className="mb-5">Спочатку авторизуйтеся</p>) }}
                    className="text-[var(--color-text)] fontText px-8 py-5 rounded-2xl bg-[image:var(--color-background)] border-2 transition-transform hover:scale-95 hover:shadow-xl cursor-pointer
                ">Додати тварину</button>
                <button
                    onClick={() => { user ? open("Форма для додавання наряду", <ModalAssignment />, true) : open("Notification", <p className="mb-5">Спочатку авторизуйтеся</p>) }}
                    className="text-[var(--color-text)] fontText px-8 py-5 rounded-2xl bg-[image:var(--color-background)] border-2 transition-transform hover:scale-95 hover:shadow-xl cursor-pointer
                ">Додати наряд</button>
                <button
                    onClick={() => { user ? open("Форма для додавання догляду", <ModalCare />, true) : open("Notification", <p className="mb-5">Спочатку авторизуйтеся</p>) }}
                    className="text-[var(--color-text)] fontText px-8 py-5 rounded-2xl bg-[image:var(--color-background)] border-2 transition-transform hover:scale-95 hover:shadow-xl cursor-pointer
                ">Додати догляд</button>

            </div>
        </motion.section >
    )
}