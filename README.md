# React Modal Manager
> Simple, customizable, typesafe state manager for modals.

## Table of Content
* [Basic Usage](#basic-usage)
* [Variant Components](#variant-components)
* [Content Components](#content-components)
* [Prompts](#prompts)
* [API](#api)
    * [`createModalManager` function](#createmodalmanager)
      * [`modal` function](#modal)
      * [`prompt` function](#prompt)
    * [`ModalContainer` component](#modalcontainer)
* [Examples](#examples)
  * [1. Custom Variant with custom settings](#1-custom-variant-with-custom-settings)

## Basic Usage

First of all, we need to set up the store which will be used for controlling our modals.
```js
import { createModalManager, ModalContainer } from '@neeppy/modal-manager';
import Modal from 'whatever-modal-component';
import DrawerModal from 'my-drawer-component';

const root = ReactDOM.createRoot(document.getElementById('root'));

const { store, modal, prompt } = createModalManager({
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
export { modal };

root.render(
    <React.StrictMode>
        <App/>
        <ModalContainer store={store} />
    </React.StrictMode>
);
```

After that, anywhere in the code, you can just run:
```js
const closeModalFunction = modal(SomeComponent, {
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
in [`modal`](#modal).

The `props` option is typed based on the `ContentComponent` passed to
the `modal` function.


## Prompts
Compared to a basic modal, which is used to just pop a component up, **prompts** are used
to request input from users, before proceeding with certain logic.

Best way to illustrate this is through an example. Let's take the following function:

```ts
async function handleOrderCancellation(orderId: string) {
    const order = await getOrderById(orderId);

    const result = await prompt(ContentComponent, {
        props: {
            text: 'Are you sure you want to cancel this order?',
        },
    });

    if (!result.isConfirm) return null;

    return cancelOrder(order);
}
```

This code will show a dialog asking the user if they are sure about cancelling the order,
and it will await for their answer. The function execution will only resume
once the prompt is closed, and will continue only if it was resolved.

Compared to modals, which don't have a `confirmed` state, a prompt's `close` function looks more like this:
```ts
function close(isConfirmed: boolean, data: any): void {}
```

## API

### createModalManager

```ts
function createModalManager(
    configuration: ModalManagerConfiguration
) : { store: ModalStore, modal: OpenModalFunction }
```

Return type: `Object`

| Property | Type | Details                         |
|----------|------|---------------------------------|
| `store` | `ModalStore` | Passed to `ModalContainer`      |
| `modal` | `OpenModalFunction` | See [API reference](#modal) |
| `prompt` | `OpenPromptFunction` | See [API reference](#prompt) |

Parameter: `Object`

| Property          | Type                                 | Details                                                                                                      |
|-------------------|--------------------------------------|--------------------------------------------------------------------------------------------------------------|
| `defaultVariant`  | `string` (optional)                  | Used as default variant in case none is passed to `modal`. (Default: `default`)                          |
| `variants`        | `Record<string, ComponentType>`      | An object with variant name as key, and React Components as values.                                          |
| `defaultSettings` | `Record<string, Object>` (optional)  | Default settings used for rendering the Variant components. Typed as Partial of the variant's settings prop. |


### ModalContainer

| Prop  | Type         | Details                                  |
|-------|--------------|------------------------------------------|
| `store` | `ModalStore` | Store returned from `createModalManager` |

Additionally, this component renders a `div` and receives any component a normal React `div` can receive.


### modal

```ts
function modal(
    contentComponent: ComponentType,
    options: modalOptions
): CloseFunction {}
```

Return type: `() => void` – function that closes the modal.

Parameters:
* `contentComponent` – `React.ComponentType`
* `options` – `modalOptions`, accepts the following properties

| Property   | Type                | Details                                                                                                                  |
|------------|---------------------|--------------------------------------------------------------------------------------------------------------------------|
| `variant`  | `string` (optional) | One of the variants defined in `createModalManager`. If none is passed, the `defaultVariant` will be used.               |
| `settings` | `Object` (optional) | Settings that are passed to the variant's component. These override the default settings passed to `createModalManager`. |
| `props`    | `Object` (optional) | Partial of the props taken by the `contentComponent` used.                                                               |


### prompt

```ts
function prompt<TData>(
    contentComponent: ComponentType,
    options: modalOptions
): Promise<{ isConfirm: boolean, data: TData }>
```

Return type: `Object`

| Property | Type | Details |
|----------|------|---------|
| `isConfirm` | `boolean` | `true` if the prompt was resolved (default: `false`) |
| `data` | `any` | Data passed to the `close` function (default: `null`) |

Parameters:
* `contentComponent` – `React.ComponentType`
* `options` – `modalOptions`, accepts the following properties

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
const { store, modal } = createModalManager({
    defaultVariant: 'drawer',
    variants: {
        drawer: DrawerComponent,
    },
    defaultSettings: {
        drawer: { placement: 'left' },
    },
});

export { store, modal };


// Component.tsx
import { modal } from 'modals.tsx';

const ModalContent = ({ close, name }: { name: string, close: () => void }) => (
    <div>
        Are you sure you want to log out, {name}?
        <button>Yes</button>
        <button onClick={close}>No</button>
    </div>
);

const SomeButton = () => (
    <button onClick={() => {
        modal(ModalContent, {
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
