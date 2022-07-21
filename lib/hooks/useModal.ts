import { useCallback, useContext, useEffect, useRef } from "react";
import ModalContext from "../ModalContext";
import { ReactComponent } from "../types";

type HookProps = {
    variant?: string,
    useComponent: ReactComponent,
    isDefaultOpen?: boolean,
    onHide?: (params: any) => any,
    props?: Record<string, any>,
    componentProps?: Record<string, any>,
};

export default function useModal(configuration: HookProps, deps = []) {
    const modalKey = useRef(Math.random().toString(36).substring(2, 8));
    const { push, pull, update } = useContext(ModalContext);

    useEffect(() => {
        push({
            key: modalKey.current,
            variant: configuration.variant || 'default',
            useComponent: configuration.useComponent,
            isOpen: configuration.isDefaultOpen || false,
            onHide: configuration.onHide,
            props: configuration.props,
            componentProps: configuration.componentProps,
        });

        return () => pull(modalKey.current);
    }, deps);

    const openModal = useCallback((params: Record<string, any>) => {
        update(modalKey.current, { isOpen: true });
    }, []);

    const closeModal = useCallback(() => {
        update(modalKey.current, { isOpen: false });
    }, []);

    return [openModal, closeModal];
}
