import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';
import { textFromTopAnimation } from '../../utils/animations';
export function About() {
    return (
        <motion.section
            initial={"hidden"}
            whileInView={"visible"}
            viewport={{ once: false, amount: 0.2 }}
            className='myContainer flex justify-between items-center gap-10 py-10 relative overflow-hidden max-[800px]:flex-col'>
            <div className="flex-1/2 grow-0 select-none fontText leading-6 tracking-wide max-[800px]:text-center transitioned text-[var(--color-text)] ">
                <motion.h1 variants={textFromTopAnimation} className='md:indent-5 fontTitle text-[30px] mb-4'>Про сайт</motion.h1>
                <p className='md:indent-5 mb-4'>Цей вебсайт — система обліку догляду за тваринами, яка дозволяє двом категоріям користувачів (звичайним користувачам і адміністраторам) взаємодіяти з базою даних тварин, нарядів та догляду. Звичайні користувачі можуть переглядати власні наряди на обслуговування тварин, бачити детальну інформацію про кожну тварину, а також додавати або редагувати заявки на нові роботи — усе це через простий та інтуїтивний інтерфейс з модальними вікнами. Адміністратор має розширений доступ: він може бачити всі записи користувачів,  змінювати наряди, редагувати тварин, додавати нові типи робіт (в майбутньому, щоб не порушувати тз) та слідкувати за всією базою.</p>
            </div>
            <div className="absolute top-0 right-[-20%] w-full h-full max-[800px]:right-0 max-[800px]:relative max-[800px]:translate-y-[-150px] overflow-hidden max-[800px]:h-[400px] max-[800px]:w-[300px] max-[800px]:mb-[-300px]">
                <Spline scene="https://prod.spline.design/cUKcDJetIp2FUwGK/scene.splinecode" />
            </div>
        </motion.section>

    )
}