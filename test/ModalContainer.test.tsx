import React, { PropsWithChildren } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModalContainer from '../lib/ModalContainer';
import createModalManager from '../lib/createModalManager';

const delay = (time: number) => new Promise(resolve => setTimeout(resolve, time));

const DefaultVariant = ({ children }: PropsWithChildren) => (
    <div data-testid="defaultVariant">
        {children}
    </div>
);

const AlternateVariant = ({ children, settings }: PropsWithChildren<{ settings: { placement: 'top' | 'bottom' } }>) => (
    <div data-testid={`altVariant-${settings.placement}`}>
        {children}
    </div>
);

const ContentComponent = ({ name, close }: { name: string, close: () => void }) => (
    <div>
        <div data-testid="modalContent">{name}</div>
        <button data-testid="closeBtn" onClick={close}>Close</button>
    </div>
);

const ConfirmationComponent = ({
    text,
    close
}: {
    text: string,
    close: (isConfirmed?: boolean, data?: any) => void,
}) => (
    <div>
        <div data-testid="dialogText">{text}</div>
        <button data-testid="resolveBtn" onClick={() => close(true, { foo: 'bee' })}>OK</button>
        <button data-testid="closeBtn" onClick={() => close(false)}>Close</button>
    </div>
);

const { store, modal, prompt } = createModalManager({
    variants: {
        default: DefaultVariant,
        alternate: AlternateVariant,
    },
    defaultSettings: {
        alternate: { placement: 'bottom' }
    }
});

describe('ModalContainer', () => {
    beforeEach(() => {
        render(
            <ModalContainer data-testid="modal-container" store={store} />
        );
    });

    it('renders nothing when no modals are rendered', () => {
        expect(screen.getByTestId('modal-container')).toBeEmptyDOMElement();
    });

    it('renders the correct variant with the correct content', () => {
        let closeFn: () => void;

        act(() => {
            closeFn = modal(ContentComponent, {
                variant: 'alternate',
                props: { name: 'test' },
            });
        });

        expect(screen.getByTestId('modal-container')).not.toBeEmptyDOMElement();
        expect(screen.getByTestId('altVariant-bottom')).not.toBeEmptyDOMElement();
        expect(screen.getByTestId('modalContent')).toHaveTextContent('test');

        act(() => closeFn());

        expect(screen.getByTestId('modal-container')).toBeEmptyDOMElement();
    });

    it('renders the "default" variant when nothing was specified', () => {
        let closeFn: () => void;

        act(() => {
            closeFn = modal(ContentComponent, {
                props: { name: 'test' },
            });
        });

        expect(screen.getByTestId('modal-container')).not.toBeEmptyDOMElement();
        expect(screen.getByTestId('defaultVariant')).not.toBeEmptyDOMElement();
        expect(screen.getByTestId('modalContent')).toHaveTextContent('test');

        act(() => closeFn());

        expect(screen.getByTestId('modal-container')).toBeEmptyDOMElement();
    });

    it('closes modal using the "close" prop', async () => {
        act(() => {
            modal(ContentComponent, {
                variant: 'alternate',
                settings: { placement: 'bottom' },
                props: { name: 'test' },
            });
        });

        expect(screen.getByTestId('modal-container')).not.toBeEmptyDOMElement();
        expect(screen.getByTestId('altVariant-bottom')).not.toBeEmptyDOMElement();
        expect(screen.getByTestId('modalContent')).toHaveTextContent('test');

        fireEvent.click(screen.getByTestId('closeBtn'));

        expect(screen.getByTestId('modal-container')).toBeEmptyDOMElement();
    });

    it('returns data when resolving a blocking modal', async () => {
        let result: any = null;

        act(() => {
            prompt(ConfirmationComponent, {
                props: { text: 'Are you sure?' },
            }).then(data => {
                result = data;
            });
        });

        expect(screen.getByTestId('modal-container')).not.toBeEmptyDOMElement();
        expect(screen.getByTestId('defaultVariant')).not.toBeEmptyDOMElement();
        expect(screen.getByTestId('dialogText')).toHaveTextContent('Are you sure?');
        expect(result).toBe(null);

        fireEvent.click(screen.getByTestId('resolveBtn'));

        await delay(200);

        expect(result).toEqual({
            isConfirm: true,
            data: { foo: 'bee' },
        });
    });

    it('resolves with null when "close" function is called', async () => {
        let result: any = null;

        act(() => {
            prompt(ConfirmationComponent, {
                props: { text: 'Are you sure?' },
            }).then(data => {
                result = data;
            });
        });

        expect(screen.getByTestId('modal-container')).not.toBeEmptyDOMElement();
        expect(screen.getByTestId('defaultVariant')).not.toBeEmptyDOMElement();
        expect(screen.getByTestId('dialogText')).toHaveTextContent('Are you sure?');
        expect(result).toBe(null);

        fireEvent.click(screen.getByTestId('closeBtn'));

        await delay(200);

        expect(result).toEqual({ isConfirm: false, data: null });
    });
});
