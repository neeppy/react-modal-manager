import { ComponentType, PropsWithChildren } from 'react';
import { createStore, ModalStore } from './store';

type PropsOf<T> = T extends ComponentType<infer P> ? P : never;
type Component<T> = ComponentType<T>;
type HasSettings<T> = T extends { settings: any } ? true : false;

type VariantMap<TVariantProps> = Record<string, ComponentType<TVariantProps>>;

interface VariantComponentProps {
    settings: any;
    children: PropsWithChildren['children'];
}

interface ModalManagerConfiguration<TVariantProps extends VariantComponentProps, TVariants extends VariantMap<TVariantProps>> {
    defaultVariant?: keyof TVariants;
    variants: TVariants;
    defaultSettings?: Partial<{
        [K in keyof TVariants]: HasSettings<PropsOf<TVariants[K]>> extends true
            ? PropsOf<TVariants[K]>['settings']
            : never;
    }>;
}

type OpenModalOptions<TContentProps, TVariantProps extends VariantComponentProps, TVariants extends VariantMap<TVariantProps>, TType extends keyof TVariants> = {
    variant?: TType;
    props?: Partial<TContentProps>;
    settings?: Partial<{
        [K in keyof TVariants]: PropsOf<TVariants[K]>['settings'];
    }>[TType];
};

type OpenPromptOptions<TContentProps, TVariantProps extends VariantComponentProps, TVariants extends VariantMap<TVariantProps>, TType extends keyof TVariants> = {
    variant?: TType;
    props?: Partial<TContentProps>;
    settings?: Partial<{
        [K in keyof TVariants]: PropsOf<TVariants[K]>['settings'];
    }>[TType];
};

function createModalManager<
    TVariantProps extends VariantComponentProps = VariantComponentProps,
    TVariants extends Record<string, Component<TVariantProps>> = Record<string, Component<TVariantProps>>
>(configuration: ModalManagerConfiguration<TVariantProps, TVariants>) {
    const modalStore = createStore();

    type CloseFn = () => void;
    type CreateModalManagerResult = {
        store: ModalStore;
        modal: <TType extends keyof TVariants, TContentProps>(
            contentComponent: Component<TContentProps>,
            options?: OpenModalOptions<TContentProps, TVariantProps, TVariants, TType>
        ) => CloseFn;
        prompt: <TData, TType extends keyof TVariants = keyof TVariants, TContentProps = any>(
            contentComponent: Component<TContentProps>,
            options?: OpenPromptOptions<TContentProps, TVariantProps, TVariants, TType>
        ) => Promise<{ isConfirm: boolean, data: TData }>;
    };

    return {
        store: modalStore,
        modal(contentComponent, options) {
            const type = options?.variant || configuration.defaultVariant || 'default';

            if (!configuration.variants.hasOwnProperty(type)) {
                const allVariants = Object.keys(configuration.variants).join(', ');

                throw new Error(`Invalid modal variant: "${String(type)}". Defined modal variants are: ${allVariants}.`);
            }

            const key = modalStore.open(contentComponent, {
                // cast to String, because typescript sees keyof as string | number | symbol
                variantComponent: configuration.variants[type],
                settings: {
                    ...configuration.defaultSettings?.[type] || {},
                    ...options?.settings || {},
                },
                props: options?.props,
            });

            return function() {
                modalStore.close(key);
            }
        },
        prompt(contentComponent, options) {
            return new Promise(resolve => {
                const type = options?.variant || configuration.defaultVariant || 'default';

                if (!configuration.variants.hasOwnProperty(type)) {
                    const allVariants = Object.keys(configuration.variants).join(', ');

                    throw new Error(`Invalid modal variant: "${String(type)}". Defined modal variants are: ${allVariants}.`);
                }

                function formatResolve(confirm: boolean, data: any) {
                    resolve({ isConfirm: confirm, data });
                }

                modalStore.open(contentComponent, {
                    // cast to String, because typescript sees keyof as string | number | symbol
                    variantComponent: configuration.variants[type],
                    $$resolveModal: formatResolve,
                    settings: {
                        ...configuration.defaultSettings?.[type] || {},
                        ...options?.settings || {},
                    },
                    props: options?.props,
                });
            });
        },
    } as CreateModalManagerResult;
}

export default createModalManager;
