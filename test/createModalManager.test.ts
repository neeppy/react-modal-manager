import createModalManager from '../lib/createModalManager';
import { describe, it, expect } from 'vitest';

const DefaultVariant = () => null;
const AlternateVariant = () => null;
const ContentComponent = () => null;

describe('modal manager', () => {
  it('uses the correct variant', () => {
    const { store, modal } = createModalManager({
      defaultVariant: 'default',
      variants: {
        default: DefaultVariant,
        alternate: AlternateVariant,
      },
    });

    modal(ContentComponent, {
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
    const { store, modal } = createModalManager({
      defaultVariant: 'default',
      variants: {
        default: DefaultVariant,
        alternate: AlternateVariant,
      },
    });

    modal(ContentComponent);

    expect(store.registry.at(0)).toMatchObject({
      variantComponent: DefaultVariant,
    });
  });

  it('defaults to "default" variant, when no defaultVariant is specified', () => {
    const { store, modal } = createModalManager({
      variants: { default: DefaultVariant },
    });

    modal(ContentComponent);

    expect(store.registry.at(0)).toMatchObject({
      variantComponent: DefaultVariant,
    });
  });

  it('adds modal to the registry when opening', () => {
    const { store, modal } = createModalManager({
      defaultVariant: 'default',
      variants: { default: DefaultVariant },
    });

    modal(ContentComponent, { variant: 'default' });

    expect(store.registry.at(0)).toEqual({
      key: expect.any(String),
      variantComponent: DefaultVariant,
      contentComponent: ContentComponent,
      settings: {},
      props: {},
    });
  });

  it('removes modal from registry when closing', () => {
    const { store, modal } = createModalManager({
      defaultVariant: 'default',
      variants: { default: DefaultVariant },
    });

    const closeModal = modal(ContentComponent, { variant: 'default' });

    expect(store.registry.length).toBe(1);

    closeModal();

    expect(store.registry.length).toBe(0);
  });
});
