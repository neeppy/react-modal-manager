import React, { PropsWithChildren, useMemo } from 'react';
import useList from './hooks/useList';
import ModalComponent from './ModalComponent';
import ModalContext from './ModalContext';
import { ModalProps, ReactComponent } from './types';

type ModalProviderProps = PropsWithChildren<{
    variants: ReactComponent<ModalProps> | {
        default: ReactComponent<ModalProps>,
        [key: string]: ReactComponent<ModalProps>,
    };
}>;

const ModalProvider: React.FC<ModalProviderProps> = function ModalProvider({ variants, children }) {
    const [modals, { push, pull, update }] = useList([]);

    const contextValue = useMemo(() => ({ push, pull, update }), []);

    const closeModal = (modalKey: string) => update(modalKey, { isOpen: false, dynamicParams: null });

    return (
        <ModalContext.Provider value={contextValue}>
            {children}
            {modals.map(modalState => typeof variants === 'object' ? (
                <ModalComponent
                    key={modalState.key}
                    modalState={modalState}
                    variant={variants[modalState.variant] || variants.default}
                    closeModal={closeModal}
                />
            ) : (
                <ModalComponent 
                    key={modalState.key}
                    modalState={modalState} 
                    variant={variants} 
                    closeModal={closeModal}
                />
            ))}
        </ModalContext.Provider>
    );
}

export default ModalProvider;
