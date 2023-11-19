# React Modal Manager
> Simple, customizable, typesafe state manager for modals.

## Table of Content
* [Basic Usage](#basic-usage)
* [Variant Components](#variant-components)
* [Content Components](#content-components)
* [API](#api)
    * [`createModalManager` function](#createmodalmanager)
      * [`openModal` function](#openmodal)
    * [`ModalContainer` component](#modalcontainer)
* [Examples](#examples)
  * [1. Custom Variant with custom settings](#1-custom-variant-with-custom-settings)

## Basic Usage

First of all, we need to set up the store which will be used for controlling our modals.
```js
import { createModalManager, ModalContainer } from 'react-modal-manager';
import Modal from 'whatever-modal-component';
import DrawerModal from 'my-drawer-component';

const root = ReactDOM.createRoot(document.getElementById('root'));

const { store, openModal } = createModalManager({
    defaultVariant: 'default',
    variants: {
        default: Modal, // this is the Modal component itself
        drawer: DrawerModal,
    },
    defaultSettings: {
        default: { foo: 'bar' },    // passed to the Modal component
        drawer: { placement: 'right' }, // gets passed to the DrawerModal component
    },
});

// ideally you'll want to write this in some other file
export { openModal };

root.render(
    <React.StrictMode>
        <App/>
        <ModalContainer store={store} />
    </React.StrictMode>
);
```

After that, anywhere in the code, you can just run:
```js
const closeModalFunction = openModal(SomeComponent, {
    variant: 'drawer',
    settings: {},   // overrides the defaultSettings – typed as DrawerModal's settings prop
    props: {},      // passed to SomeComponent – typed as SomeComponent's props
});
```

## Variant Components
By variant, we understand the component that renders the Modal itself. It can be a normal modal, 
or a drawer, or anything you can think of.

This component renders the backdrop, takes care of animations and so on. 
By using variants, changing from a window to a drawer is trivial and doesn't 
require any JSX change.

Variants are rendered internally by the `ModalContainer` and receive the `ContentComponent` as children.

Additionally, variant components receive 2 props:
* `settings` – allows changing variants
* `close` – allows closing the current modal (useful for close buttons, for example)

Currently, variants can only be changed via the `settings` option. 
Use the `defaultSettings` in [`createModalManager`](#createmodalmanager) if 
you want to not repeat yourself.

Whatever information you want to pass inside of a variant can be done by using
the `settings` prop, as it is typed based on the variant component itself.

## Content Components

Content components are whatever gets rendered inside a modal. It can be a 
form, it can be a message or it can be a pink unicorn GIF. Use your imagination.

The content component receives:
* `close` – allows closing the modal
* `props` - whatever props you pass to the `props` option 
in [`openModal`](#openmodal). 

The `props` option is typed based on the `ContentComponent` passed to
the `openModal` function.

## API

### createModalManager

```ts
function createModalManager(
    configuration: ModalManagerConfiguration
) : { store: ModalStore, openModal: OpenModalCallback }
```

Return type: `Object`

| Property | Type | Details                         |
|----------|------|---------------------------------|
| `store` | `ModalStore` | Passed to `ModalContainer`      |
| `openModal` | `OpenModalCallback` | See [API reference](#openModal) |

Parameter: `Object`

| Property          | Type                                 | Details                                                                                                      |
|-------------------|--------------------------------------|--------------------------------------------------------------------------------------------------------------|
| `defaultVariant`  | `string` (optional)                  | Used as default variant in case none is passed to `openModal`. (Default: `default`)                          |
| `variants`        | `Record<string, ComponentType>`      | An object with variant name as key, and React Components as values.                                          |
| `defaultSettings` | `Record<string, Object>` (optional)  | Default settings used for rendering the Variant components. Typed as Partial of the variant's settings prop. |


### ModalContainer

| Prop  | Type         | Details                                  |
|-------|--------------|------------------------------------------|
| `store` | `ModalStore` | Store returned from `createModalManager` |

Additionally, this component renders a `div` and receives any component a normal React `div` can receive.


### openModal

```ts
function openModal(
    contentComponent: ComponentType, 
    options: OpenModalOptions
): CloseFunction {}
```

Return type: `() => void` – function that closes the modal.

Parameters:
* `contentComponent` – `React.ComponentType`
* `options` – `OpenModalOptions`, accepts the following properties

| Property   | Type                | Details                                                                                                                  |
|------------|---------------------|--------------------------------------------------------------------------------------------------------------------------|
| `variant`  | `string` (optional) | One of the variants defined in `createModalManager`. If none is passed, the `defaultVariant` will be used.               |
| `settings` | `Object` (optional) | Settings that are passed to the variant's component. These override the default settings passed to `createModalManager`. |
| `props`    | `Object` (optional) | Partial of the props taken by the `contentComponent` used.                                                               |


## Examples

### 1. Custom variant with custom settings

```tsx
// MyVariant.tsx
interface DrawerProps {
    settings: {
        placement: 'top' | 'bottom' | 'right' | 'left';
    };
}

function DrawerComponent({ children, settings }: PropsWithChildren<DrawerProps>) {
    return (
        <div className="container">
            <div className="backdrop"/>
            <div className="modal-content">
                {children}
            </div>
        </div>
    );
}


// modals.tsx
const { store, openModal } = createModalManager({
    defaultVariant: 'drawer',
    variants: {
        drawer: DrawerComponent,
    },
    defaultSettings: {
        drawer: { placement: 'left' },
    },
});

export { store, openModal };


// Component.tsx
import { openModal } from 'modals.tsx';

const ModalContent = ({ close, name }: { name: string, close: () => void }) => (
    <div>
        Are you sure you want to log out, {name}?
        <button>Yes</button>
        <button onClick={close}>No</button>
    </div>
);

const SomeButton = () => (
    <button onClick={() => {
        openModal(ModalContent, {
            // will open on the right, instead of left
            settings: { placement: 'right' },
            // will pass the name to the ModalContent
            props: { name: 'User' },
        });
    }}>
        Open Modal
    </button>
);
```
