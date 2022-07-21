import { useCallback, useContext, useEffect, useRef } from "react";
import ModalContext from "../ModalContext";
import { ReactComponent } from "../types";

type HookProps<IComponentProps> = {
    variant?: string,
    isDefaultOpen?: boolean,
    onHide?: (params: any) => any,
    props?: Record<string, any>,
    componentProps?: IComponentProps,
};

export default function useModal<IComponentProps = {}, IDynamicParams = {}>(
    useComponent: ReactComponent<IComponentProps & { params: IDynamicParams }>,
    configuration: HookProps<IComponentProps> = {},
    deps = [],
): [(dynamicParams: IDynamicParams) => any, () => any] {
    const modalKey = useRef(Math.random().toString(36).substring(2, 8));
    const { push, pull, update } = useContext(ModalContext);

    useEffect(() => {
        push({
            key: modalKey.current,
            variant: configuration.variant || 'default',
            useComponent,
            isOpen: configuration.isDefaultOpen || false,
            onHide: configuration.onHide,
            props: configuration.props,
            componentProps: configuration.componentProps,
            dynamicParams: {},
        });

        return () => pull(modalKey.current);
    }, deps);

    const openModal = useCallback((dynamicParams: IDynamicParams) => {
        update(modalKey.current, { isOpen: true, dynamicParams });
    }, []);

    const closeModal = useCallback(() => {
        update(modalKey.current, { isOpen: false, dynamicParams: {} });
    }, []);

    return [openModal, closeModal];
}
