import React, { PropsWithChildren, useState } from 'react';
import createModalManager from '../../lib/createModalManager';

const DefaultVariant = ({ children }: PropsWithChildren) => (
    <div data-testid="defaultVariant">
        {children}
    </div>
);

const { store, prompt } = createModalManager({
    variants: { default: DefaultVariant },
});

const PaymentModal = ({ close }: any) => {
    const [amount, setAmount] = useState(0);

    return (
        <div>
            <input type="number" data-testid="amountField" value={amount} onChange={e => setAmount(e.target.valueAsNumber)} />
            <button data-testid="closeBtn" onClick={() => close()}>Close</button>
            <button data-testid="submitBtn" onClick={() => close(true, amount)}>
                Submit
            </button>
        </div>
    );
};

const ReactApp = ({ onSuccess, onCancel }: { onSuccess: (amount: number) => void, onCancel: () => void }) => (
    <div>
        <button
            data-testid="payButton"
            onClick={async () => {
                const { isConfirm, data: paidAmount } = await prompt<number>(PaymentModal);

                if (isConfirm) onSuccess(paidAmount);
                else onCancel();
            }}
        >
            Pay
        </button>
    </div>
);

export { store, ReactApp };
