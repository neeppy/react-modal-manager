import React, { PropsWithChildren } from "react";

export type ReactComponent<T = {}> = React.FunctionComponent<PropsWithChildren<T>> | React.ComponentClass<PropsWithChildren<T>>;

export type ModalState = {
    key: string,
    variant: string,
    useComponent: ReactComponent<any>,
    isOpen: boolean,
    onHide?: (params: any) => any,
    props?: any,
    componentProps?: any,
    dynamicParams?: any,
}

export type ModalProps = PropsWithChildren<{
    isOpen: boolean,
    onHide: (params: any) => any,
}>;
