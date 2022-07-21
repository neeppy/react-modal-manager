import React, { PropsWithChildren, useCallback } from "react";
import type { ModalProps, ModalState, ReactComponent } from "./types";

type ModalComponentProps = PropsWithChildren<{
    modalState: ModalState,
    variant: ReactComponent<ModalProps>,
    closeModal: (modalKey: string) => any,
}>;

const NullComponent = () => null;

const ModalComponent: React.FC<ModalComponentProps> = function ModalComponent({ 
    modalState, 
    variant: ModalVariant,
    closeModal,
}) {
    const InnerComponent = modalState.useComponent || NullComponent;

    const onModalClose = useCallback((params: any) => {
        if (typeof modalState.onHide === 'function') {
            modalState.onHide(params);
        }

        closeModal(modalState.key);
    }, []);

    return (
        <ModalVariant {...modalState.props || {}} isOpen={modalState.isOpen} onHide={onModalClose}>
            <InnerComponent 
                {...modalState.componentProps || {}} 
                params={modalState.dynamicParams || {}}
                closeModal={onModalClose}
            />
        </ModalVariant>
    );
};

export default ModalComponent;
