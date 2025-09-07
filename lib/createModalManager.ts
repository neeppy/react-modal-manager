import { ComponentType, PropsWithChildren } from 'react';
import { createStore, ModalStore } from './store';

type PropsOf<T> = T extends ComponentType<infer P> ? P : never;
type Component<T> = ComponentType<T>;

type VariantMap<TVariantProps> = Record<string, ComponentType<TVariantProps>>;

type VariantComponentProps<T> = PropsWithChildren & T;

interface ModalManagerConfiguration<
  TVariantProps extends VariantComponentProps<any>,
  TVariants extends VariantMap<TVariantProps>,
> {
  defaultVariant?: keyof TVariants;
  variants: TVariants;
  defaultSettings?: Partial<{
    [K in keyof TVariants]: Omit<PropsOf<TVariants[K]>, 'children' | 'close'>;
  }>;
}

type OpenModalOptions<
  TContentProps,
  TVariantProps extends VariantComponentProps<any>,
  TVariants extends VariantMap<TVariantProps>,
  TType extends keyof TVariants,
> = {
  variant?: TType;
  props?: Partial<TContentProps>;
  settings?: Partial<{
    [K in keyof TVariants]: PropsOf<TVariants[K]>;
  }>[TType];
};

type OpenPromptOptions<
  TContentProps,
  TVariantProps extends VariantComponentProps<any>,
  TVariants extends VariantMap<TVariantProps>,
  TType extends keyof TVariants,
> = {
  variant?: TType;
  props?: Partial<TContentProps>;
  settings?: Partial<{
    [K in keyof TVariants]: PropsOf<TVariants[K]>;
  }>[TType];
};

function createModalManager<
  TVariantProps extends VariantComponentProps<any> = VariantComponentProps<any>,
  TVariants extends Record<string, Component<TVariantProps>> = Record<
    string,
    Component<TVariantProps>
  >,
>(configuration: ModalManagerConfiguration<TVariantProps, TVariants>) {
  const modalStore = createStore();

  type CloseFn = () => void;
  type CreateModalManagerResult = {
    store: ModalStore;
    modal: <TType extends keyof TVariants, TContentProps>(
      contentComponent: Component<TContentProps>,
      options?: OpenModalOptions<
        TContentProps,
        TVariantProps,
        TVariants,
        TType
      >,
    ) => CloseFn;
    prompt: <
      TData,
      TType extends keyof TVariants = keyof TVariants,
      TContentProps = object,
    >(
      contentComponent: Component<TContentProps>,
      options?: OpenPromptOptions<
        TContentProps,
        TVariantProps,
        TVariants,
        TType
      >,
    ) => Promise<{ isConfirm: boolean; data: TData }>;
  };

  return {
    store: modalStore,
    modal(contentComponent, options = undefined) {
      const type =
        options?.variant || configuration.defaultVariant || 'default';

      if (!Object.hasOwn(configuration.variants, type)) {
        const allVariants = Object.keys(configuration.variants).join(', ');

        throw new Error(
          `Invalid modal variant: "${String(type)}". Defined modal variants are: ${allVariants}.`,
        );
      }

      const key = modalStore.open(contentComponent, {
        variantComponent: configuration.variants[type],
        settings: {
          ...(configuration.defaultSettings?.[type] || {}),
          ...(options?.settings || {}),
        },
        props: options?.props,
      });

      return function () {
        modalStore.close(key);
      };
    },
    prompt(contentComponent, options = undefined) {
      return new Promise((resolve) => {
        const type =
          options?.variant || configuration.defaultVariant || 'default';

        if (!Object.hasOwn(configuration.variants, type)) {
          const allVariants = Object.keys(configuration.variants).join(', ');

          throw new Error(
            `Invalid modal variant: "${String(type)}". Defined modal variants are: ${allVariants}.`,
          );
        }

        function formatResolve(confirm: boolean, data: any) {
          resolve({ isConfirm: confirm, data });
        }

        modalStore.open(contentComponent, {
          variantComponent: configuration.variants[type],
          $$resolveModal: formatResolve,
          settings: {
            ...(configuration.defaultSettings?.[type] || {}),
            ...(options?.settings || {}),
          },
          props: options?.props,
        });
      });
    },
  } satisfies CreateModalManagerResult;
}

export default createModalManager;
