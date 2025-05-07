import { create } from "zustand";

interface PopupStateProps {
    active: boolean;
    title: string;
    children: React.ReactNode | null;
    open: (title: string, content: React.ReactNode, withoutPadAndCross?: boolean, active?: boolean) => void;
    close: () => void;
}

export const usePopupStore = create<PopupStateProps>((set) => ({
    active: false,
    title: "",
    children: null,
    withoutPadAndCross: false,
    open: (title, content, active = true) => {
        set({ title, children: content, active });
    },
    close: () => set({ active: false, title: "", children: null }),
}));
