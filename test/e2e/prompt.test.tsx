import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ModalContainer from '../../lib/ModalContainer';
import { store, ReactApp } from './prompt.scenario';

const delay = (time: number) => new Promise(resolve => setTimeout(resolve, time));

describe('prompt E2E flow', () => {
    const successCallback = jest.fn();
    const cancelCallback = jest.fn();

    beforeEach(() => {
        render(
            <>
                <ReactApp onSuccess={successCallback} onCancel={cancelCallback} />
                <ModalContainer data-testid="modal-container" store={store} />
            </>
        );
    });

    afterEach(jest.clearAllMocks);

    it('calls success callback with appropriate data when resolved', async () => {
        fireEvent.click(screen.getByTestId('payButton'));
        fireEvent.change(screen.getByTestId('amountField'), { target: { valueAsNumber: 4000 } });

        expect(successCallback).not.toHaveBeenCalled();
        expect(cancelCallback).not.toHaveBeenCalled();

        fireEvent.click(screen.getByTestId('submitBtn'));

        await delay(200);

        expect(successCallback).toHaveBeenCalledWith(4000);
        expect(cancelCallback).not.toHaveBeenCalled();
    });

    it('calls cancel callback when the modal is closed without resolving', async () => {
        fireEvent.click(screen.getByTestId('payButton'));
        fireEvent.change(screen.getByTestId('amountField'), { target: { valueAsNumber: 4000 } });

        expect(successCallback).not.toHaveBeenCalled();
        expect(cancelCallback).not.toHaveBeenCalled();

        fireEvent.click(screen.getByTestId('closeBtn'));

        await delay(200);

        expect(successCallback).not.toHaveBeenCalled();
        expect(cancelCallback).toHaveBeenCalled();
    });
});
