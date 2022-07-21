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

    return (
        <ModalContext.Provider value={contextValue}>
            {children}
            {modals.map(modalState => typeof variants === 'object' ? (
                <ModalComponent
                    key={modalState.key}
                    modalState={modalState}
                    variant={variants[modalState.variant] || variants.default}
                />
            ) : (
                <ModalComponent 
                    key={modalState.key}
                    modalState={modalState} 
                    variant={variants} 
                />
            ))}
        </ModalContext.Provider>
    );
}

export default ModalProvider;
