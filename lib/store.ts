import { ComponentType } from 'react';

export interface Modal {
  key: string;
  variantComponent: ComponentType<any>;
  contentComponent: ComponentType<any>;
  settings: object;
  props: object;
  $$resolveFn?: (confirm: boolean, data: any) => void;
}

interface OpenOptions {
  variantComponent: ComponentType<any>;
  $$resolveModal?: (confirm: boolean, data: any) => void;
  settings?: object;
  props?: object;
}

export interface ModalStore {
  registry: Modal[];
  open: <T extends ComponentType<any>>(
    contentComponent: T,
    options: OpenOptions,
  ) => string;
  close: (key: string) => void;
  subscribe: (listener: ListenerFn) => () => void;
}

type ListenerFn = (registry: Modal[]) => void;

export function createStore(): ModalStore {
  const registry = new Map<string, Modal>();
  const listeners = new Set<ListenerFn>();

  return {
    get registry() {
      return [...registry.values()];
    },
    open(contentComponent, options) {
      const key = Math.random().toString(36).substring(2, 8);

      const entry = {
        key,
        contentComponent,
        variantComponent: options.variantComponent,
        $$resolveFn: options.$$resolveModal,
        settings: options.settings || {},
        props: options.props || {},
      };

      registry.set(key, entry);

      const visibleModals = this.registry;

      listeners.forEach((listenerFn) => listenerFn(visibleModals));

      return key;
    },
    close(key) {
      registry.delete(key);

      const visibleModals = this.registry;

      listeners.forEach((listenerFn) => listenerFn(visibleModals));
    },
    subscribe(listener) {
      listeners.add(listener);

      return () => listeners.delete(listener);
    },
  };
}
