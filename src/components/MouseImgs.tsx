import useMouseMovement from "../hooks/useMouseMovements";
import headSvg from "../assets/head.svg"
import starSvg from "../assets/star.svg"
export function MouseImgs() {
    const { x, y } = useMouseMovement();

    const getMovement = (sensitivity: number) => {
        const moveX = ((x - window.innerWidth / 2) / window.innerWidth) * sensitivity;
        const moveY = ((y - window.innerHeight / 2) / window.innerHeight) * sensitivity;
        return { transform: `translate(${moveX}px, ${moveY}px)` };
    };
    return (
        <>
            {/* head img */}
            <div className="absolute w-[155px] h-[155px] top-[20%] right-[7%] z-[1]" style={getMovement(20)}>
                <img className="w-full h-full object-contain" src={headSvg} alt="head" />
            </div>
            {/* star img */}
            <div className="absolute w-[55px] h-[55px] top-[90%] right-[4%] z-[1]" style={getMovement(40)}>
                <img className="w-full h-full object-contain" src={starSvg} alt="star" />
            </div>
        </>
    )
}