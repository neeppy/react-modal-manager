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
        settings
    } = modal;

    const closeModal = useCallback(() => {
        store.close(key);
    }, [store]);

    return (
        <VariantComponent close={closeModal} settings={settings}>
            <ContentComponent close={closeModal} {...props} />
        </VariantComponent>
    );
}

export default ModalContainer;
