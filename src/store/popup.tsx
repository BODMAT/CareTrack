import { create } from "zustand";

interface PopupStateProps {
    active: boolean;
    title: string;
    children: React.ReactNode | null;

    hasCheckAfterClose: boolean; // use in open
    specialConfirmation: boolean; // state через Стор
    setSpecialConfirmation: (answer: boolean) => void; // setState через Стор

    open: (title: string, content: React.ReactNode, hasCheckAfterClose?: boolean) => void;
    close: () => void;
}

export const usePopupStore = create<PopupStateProps>((set) => ({
    active: false,
    title: "",
    children: null,
    addSpecialQuectionBeforeClose: undefined,
    hasCheckAfterClose: false,
    specialConfirmation: false,
    open: (title, content, hasCheckAfterClose = false) => {
        set({
            title,
            children: content,
            active: true,
            hasCheckAfterClose: hasCheckAfterClose,
        });
    },

    close: () => {
        set({ active: false, title: "", children: null, hasCheckAfterClose: false, specialConfirmation: false });
    },

    setSpecialConfirmation: (answer: boolean) => {
        set({ specialConfirmation: answer })
    }
}));

