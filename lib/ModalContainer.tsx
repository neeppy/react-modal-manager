import React, { useCallback, useEffect, useState } from 'react';
import { Modal, ModalStore } from './store';

type Props = React.HTMLAttributes<HTMLDivElement> & {
    store: ModalStore;
};

function ModalContainer({ store, ...props }: Props) {
    const [visibleModals, setVisibleModals] = useState<Modal[]>([]);

    useEffect(() => {
        return store.subscribe(setVisibleModals);
    }, [store]);

    return (
        <div {...props}>
            {visibleModals.map(modal => (
                <ModalComponent key={modal.key} modal={modal} store={store} />
            ))}
        </div>
    );
}

function ModalComponent({ modal, store }: { modal: Modal, store: ModalStore }) {
    const {
        key,
        variantComponent: VariantComponent,
        contentComponent: ContentComponent,
        props,
        $$resolveFn,
        settings,
    } = modal;

    const closeModal = useCallback((isConfirm = false, data = null) => {
        store.close(key);

        if (typeof $$resolveFn === 'function') {
            $$resolveFn(isConfirm, data);
        }
    }, [store]);

    return (
        <VariantComponent close={closeModal} settings={settings}>
            <ContentComponent
                close={closeModal}
                {...props}
            />
        </VariantComponent>
    );
}

export default ModalContainer;
