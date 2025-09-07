export type ModalContentProps<T> = T & {
  close: (isConfirm?: boolean, data?: unknown) => void;
};

export type VariantProps<T> = T & {
  close: () => void;
};
