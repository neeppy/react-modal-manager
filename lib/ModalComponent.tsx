import React, { PropsWithChildren, useCallback } from "react";
import type { ModalProps, ModalState, ReactComponent } from "./types";

type ModalComponentProps = PropsWithChildren<{
    modalState: ModalState,
    variant: ReactComponent<ModalProps>,
}>;

const NullComponent = () => null;

const ModalComponent: React.FC<ModalComponentProps> = function ModalComponent({ 
    modalState, 
    variant: ModalVariant,
}) {
    const InnerComponent = modalState.useComponent || NullComponent;

    const closeModal = useCallback((params: any) => {
        if (typeof modalState.onHide === 'function') {
            modalState.onHide(params);
        }
    }, []);

    return (
        <ModalVariant isOpen={modalState.isOpen} onHide={closeModal}>
            <InnerComponent {...modalState.componentProps} />
        </ModalVariant>
    );
};

export default ModalComponent;
