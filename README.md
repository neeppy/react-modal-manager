# React Use Modal
`react-use-modal` is a hook meant to take care of state management for modals, instead of requiring you to do so. This library does not provide a component for rendering modals, but it allows you to choose what components to use.

## Table of Content
* [Context](#context---without-react-use-modal)
* [Basic Usage](#basic-usage---with-react-use-modal)
* [API](#api)
    * [`ModalProvider` component](#1-modalprovider-component)
    * [`useModal` hook](#2-usemodalusecomponent-component-options-hookprops-deps---openmodalfn)
        * [`useModal` options](#3-additional-options-accepted-by-the-usemodal-hook)
        * [`OpenModalFn` function](#4-return-openmodalfn-params-idynamicparams--any)
* [Example Usages](#example-usages)
    * [Custom Modal Variant & Props](#1-custom-modal-variant--props)
    * [Dynamic Modal Content](#2-dynamic-content)
## Context - Without `react-use-modal`

Consider the following example:
```js
function MyModalComponent(props) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>
                Open Modal
            </Button>
            <Modal isOpen={isOpen} onHide={() => setIsOpen(false)}>
                <ModalContents/>
            </Modal>
        </>
    );
}
```

What's bad about this is that in every component we need a modal, we will have to:
1. create a state for the modal opening
2. render the actual modal content alongside the rest of the components tree

## Basic Usage - With `react-use-modal`

First things first, we want to make sure the modal context is available, so add the `ModalProvider` somewhere up the tree (like your `main.js`):
```js
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <ModalProvider variants={Modal}>
            <App/>
        </ModalProvider>
    </React.StrictMode>
);
```
> The `variants` prop is the component used to actually render the Modal. [Read the API description](#1-modalprovider-component).

The example above could be written as:
```js
function MyModalComponent(props) {
    const openModal = useModal(ModalContents);

    return (
        <Button onClick={openModal}>
            Open Modal
        </Button>
    );
}
```
> The `useModal` hook is fairly customizable. [Read the API description](#2-usemodalusecomponent-component-options-hookprops-deps---openmodalfn).

## API

#### 1. `ModalProvider` component
> The provider of the Modal Context. This library cannot be used without this.

| **Property Name** | **Accepted Types** | **Description** |
| :---------------: | :----------------: | :-------------: |
| `variants` | `Component \| Object` | All possible variants of modals. |

#### 2. `useModal(useComponent: Component, options?: HookProps, deps = []): OpenModalFn`
> The actual hook responsible with the magic. It accepts 3 parameters.

| **Parameter Name** | **Accepted Types** | **Description** |
| :---------------: | :----------------: | --------------: |
| `useComponent` | `Component` | The component rendered **as modal content**. |
| `options`<br>_(optional)_ | `HookProps` | Additional options for modal customization (check table below). |
| `deps`<br>_(optional)_ | `Array` | React dependency array. There aren't really many usecases for using this.<br>_Default value: **[]**_|

#### 3. Additional options accepted by the `useModal` hook:

| **Property Name** | **Accepted Types** | **Description** |
| :---------------: | :----------------: | --------------: |
| `variant`<br>_(optional)_ | `string` | The modal variant to be used. Must be one of the specified variants.<br>_Default value: **default**_ |
| `isDefaultOpen`<br>_(optional)_ | `boolean` | Controls whether the modal should be opened by default or not.<br>_Default value: **false**_ |
| `onHide`<br>_(optional)_ | `(params: any) => any` | Function called when the modal is closed. Accepts one parameter. |
| `props`<br>_(optional)_ | `Object` | Properties passed to the Modal variant rendered. |
| `componentProps`<br>_(optional)_ | `Object` | Properties passed to the component rendered inside the modal. |

#### 4. Return: `OpenModalFn: (params: IDynamicParams) => any`
> A function that opens the modal when called. It accepts one parameter of type `Object` that will be used as the `params` prop of the modal content component.

## Example Usages

### 1. Custom Modal Variant & Props
```js
import Modal from '/my-components/modals/Modal';
import RedModalVariant from '/my-components/modals/RedModalVariant';

// variants used in ModalProvider
const variants = {
    default: Modal,
    'red-modal': RedModalVariant,
};

// MyComponent.js
function MyComponent() {
    const openModal = useModal(ModalContentComponent, {
        variant: 'red-modal',
        props: {    // will be passed to the RedModalVariant component
            size: 'lg',     
        },
        componentProps: {   // will be passed to the ModalContentComponent
            content: 'hello world',     
        },
    });

    return (
        <button onClick={openModal}>
            Open Modal
        </button>
    );
}
```

### 2. Dynamic Content

When you have a list of items, instead of rendering a modal for all of the items (hence, managing multiple component states), you can do something like this:

```js
// MyComponent.js
function MyComponent() {
    const [list, setList] = useState([]);

    useEffect(fetchMyList, []);

    const openModal = useModal(EditListItemModal, {
        componentProps: {
            title: 'Edit Item',
        },
    });

    return (
        <ul>
            {list.map(item => (
                <li key={item.id} onClick={() => openModal(item)} />
            ))}
        </ul>
    );
}

// EditListItemModal.js
function EditListItemModal({ title, params: item }) {
    // the dynamic params prop will be the item passed when openModal got called
    // title, however, is a static prop passed when the modal is initialized
}
```

This way, you can use the same modal instance, while only changing the data used to render the content.