import createModalManager from '../lib/createModalManager';

const DefaultVariant = () => null;
const AlternateVariant = (props: { settings: { placement: 'top' | 'bottom' } }) => null;
const ContentComponent = () => null;

describe('modal manager', () => {
    it('uses the correct variant', () => {
        const { store, openModal } = createModalManager({
            defaultVariant: 'default',
            variants: {
                default: DefaultVariant,
                alternate: AlternateVariant,
            },
        });

        openModal(ContentComponent, {
            variant: 'alternate',
            settings: { placement: 'top' },
        });

        expect(store.registry.at(0)).toEqual({
            key: expect.any(String),
            variantComponent: AlternateVariant,
            contentComponent: ContentComponent,
            settings: { placement: 'top' },
            props: {},
        });
    });

    it('defaults to the defaultVariant when not specified', () => {
        const { store, openModal } = createModalManager({
            defaultVariant: 'default',
            variants: {
                default: DefaultVariant,
                alternate: AlternateVariant,
            },
        });

        openModal(ContentComponent);

        expect(store.registry.at(0)).toMatchObject({
            variantComponent: DefaultVariant,
        });
    });

    it('defaults to "default" variant, when no defaultVariant is specified', () => {
        const { store, openModal } = createModalManager({
            variants: { default: DefaultVariant },
        });

        openModal(ContentComponent);

        expect(store.registry.at(0)).toMatchObject({
            variantComponent: DefaultVariant,
        });
    });

    it('adds modal to the registry when opening', () => {
        const { store, openModal } = createModalManager({
            defaultVariant: 'default',
            variants: { default: DefaultVariant },
        });

        openModal(ContentComponent, { variant: 'default' });

        expect(store.registry.at(0)).toEqual({
            key: expect.any(String),
            variantComponent: DefaultVariant,
            contentComponent: ContentComponent,
            settings: {},
            props: {},
        });
    });

    it('removes modal from registry when closing', () => {
        const { store, openModal } = createModalManager({
            defaultVariant: 'default',
            variants: { default: DefaultVariant },
        });

        const closeModal = openModal(ContentComponent, { variant: 'default' });

        expect(store.registry.length).toBe(1);

        closeModal();

        expect(store.registry.length).toBe(0);
    });
});
