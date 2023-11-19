import React, { PropsWithChildren } from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModalContainer from '../lib/ModalContainer';
import createModalManager from '../lib/createModalManager';

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

const { store, openModal } = createModalManager({
    variants: {
        default: DefaultVariant,
        alternate: AlternateVariant,
    },
    defaultSettings: {
        alternate: { placement: 'top' }
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
            closeFn = openModal(ContentComponent, {
                variant: 'alternate',
                props: { name: 'test' },
            });
        });

        expect(screen.getByTestId('modal-container')).not.toBeEmptyDOMElement();
        expect(screen.getByTestId('altVariant-top')).not.toBeEmptyDOMElement();
        expect(screen.getByTestId('modalContent')).toHaveTextContent('test');

        act(() => closeFn());

        expect(screen.getByTestId('modal-container')).toBeEmptyDOMElement();
    });

    it('renders the "default" variant when nothing was specified', () => {
        let closeFn: () => void;

        act(() => {
            closeFn = openModal(ContentComponent, {
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
            openModal(ContentComponent, {
                variant: 'alternate',
                settings: { placement: 'bottom' },
                props: { name: 'test' },
            });
        });

        expect(screen.getByTestId('modal-container')).not.toBeEmptyDOMElement();
        expect(screen.getByTestId('altVariant-bottom')).not.toBeEmptyDOMElement();
        expect(screen.getByTestId('modalContent')).toHaveTextContent('test');

        await fireEvent.click(screen.getByTestId('closeBtn'));

        expect(screen.getByTestId('modal-container')).toBeEmptyDOMElement();
    });
});
