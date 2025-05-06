import Spline from '@splinetool/react-spline';
export function About() {
    return (
        <section className='myContainer overflow-hidden flex justify-between items-center gap-15 relative py-10'>
            <div className="flex-1/2 grow-0 select-none fontText leading-6 tracking-wide">
                <h1 className='md:indent-5 fontTitle text-[30px] mb-4'>Про сайт</h1>
                <p className='md:indent-5 mb-4'>Цей вебсайт — система обліку догляду за тваринами, яка дозволяє двом категоріям користувачів (звичайним користувачам і адміністраторам) взаємодіяти з базою даних тварин, нарядів та догляду. Звичайні користувачі можуть переглядати власні наряди на обслуговування тварин, бачити детальну інформацію про кожну тварину, а також додавати або редагувати заявки на нові роботи — усе це через простий та інтуїтивний інтерфейс з модальними вікнами. Адміністратор має розширений доступ: він може бачити всі записи користувачів, підтверджувати або змінювати наряди, редагувати тварин, додавати нові типи робіт та слідкувати за всією базою.</p>
            </div>
            <div className="w-full absolute z-999 top-[-30%] right-[-25%]">
                <Spline scene="https://prod.spline.design/cUKcDJetIp2FUwGK/scene.splinecode" />
            </div>
        </section>

    )
}