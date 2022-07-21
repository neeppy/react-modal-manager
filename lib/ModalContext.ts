import { createContext } from "react";
import { ModalState } from "./types";

type ModalContextType = {
    push: (modalState: ModalState) => any,
    pull: (modalKey: string) => any,
    update: (modalKey: string, updater: Partial<ModalState>) => any,
};

const ModalContext = createContext<ModalContextType>({
    push: () => null,
    pull: () => null,
    update: () => null,
});

export default ModalContext;
