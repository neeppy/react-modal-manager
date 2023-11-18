import React, { useEffect, useState } from 'react';
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
                <div key={modal.key} />
            ))}
        </div>
    );
}

export default ModalContainer;
