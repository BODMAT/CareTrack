import { useEffect } from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import crossSVG from "../assets/cross.svg";
import { usePopupStore } from "../store/popup";

export function PopUp() {
    const { active, title, children, close } = usePopupStore();

    useEffect(() => {
        if (active) {
            document.body.style.overflow = "hidden";
            document.body.style.height = "100vh";
        } else {
            document.body.style.overflow = "";
            document.body.style.height = "";
        }

        return () => {
            document.body.style.overflow = "";
            document.body.style.height = "";
        };
    }, [active]);


    if (!active) return null;

    return ReactDOM.createPortal(
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#0000008e] bg-opacity-50 !z-[99999] flex justify-center items-center"
        >
            <motion.div
                initial={{ opacity: 0, y: "-50px" }}
                animate={{ opacity: 1, y: "0px" }}
                exit={{ opacity: 0, y: "-50px" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white rounded-lg w-[90%] max-w-[700px] shadow-lg relative !z-[99999] max-md:mt-[5vh] overflow-hidden"
            >
                <div className="bg-[#121212] flex justify-between items-center p-4">
                    <h2 className="fontTitle text-2xl font-bold text-white">{title}</h2>
                    <button onClick={close} className="text-2xl font-bold cursor-pointer">
                        <img src={crossSVG} alt="Close" />
                    </button>
                </div>
                <div className="mt-4 p-4 fontText">{children}</div>
            </motion.div>
        </motion.section>,
        document.body
    );
}
