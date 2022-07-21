# React Use Modal
`react-use-modal` is a hook meant to take care of state management for modals, instead of requiring you to do so.

## Basic Usage
```js
function ComponentUsingModals() {
    const [openModal, closeModal] = useModal({
        useComponent: ModalContentComponent,
        componentProps: {
            someProp: 'someValue',
        },
    });

    return (
        <Button onClick={openModal}>
        </Button>
    );
}
```

## Example - without `react-use-modal`
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