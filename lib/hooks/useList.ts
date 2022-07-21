import { useCallback, useReducer } from "react";
import type { ModalState } from "../types";

type Action = {
    type: 'push',
    payload: ModalState,
} | {
    type: 'pull',
    payload: string,
} | {
    type: 'update',
    key: string,
    payload: Partial<ModalState>,
};

type ListActions = {
    push: (modalState: ModalState) => any,
    pull: (modalKey: string) => any,
    update: (modalKey: string, updater: Partial<ModalState>) => any,
};

function init(initialValue: ModalState[] = []) {
    return initialValue || [];
}

function reducer(currentState: ModalState[], action: Action): ModalState[] {
    switch (action.type) {
        case 'push':
            return [...currentState, action.payload as ModalState];
        case 'pull':
            return currentState.filter(modal => modal.key !== action.payload);
        case 'update':
            const idx = currentState.findIndex(modalState => modalState.key === action.payload.key);
            const clone = currentState.slice();

            clone[idx] = {
                ...currentState[idx],
                ...action.payload,
            };

            return clone;
        default:
            return currentState;
    }
}

export default function useList(initialList: ModalState[] = []): [ModalState[], ListActions] {
    const [state, dispatch] = useReducer(reducer, initialList, init);

    const push = useCallback((modalState: ModalState) => {
        dispatch({ type: 'push', payload: modalState });
    }, []);

    const pull = useCallback((modalKey: string) => {
        dispatch({ type: 'pull', payload: modalKey });
    }, []);

    const update = useCallback((modalKey: string, updater: Partial<ModalState>) => {
        dispatch({ type: 'update', key: modalKey, payload: updater })
    }, []);

    return [state, { push, pull, update }];
}
