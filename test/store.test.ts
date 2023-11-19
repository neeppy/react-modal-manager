import { createStore } from '../lib/store';

const DefaultVariant = () => null;
const ContentComponent = () => null;

describe('store', () => {
    it('calls subscriber when a change is done', () => {
        const store = createStore();
        const listener = jest.fn();

        store.subscribe(listener);
        const key = store.open(ContentComponent, {
            variantComponent: DefaultVariant,
        });

        expect(listener).toHaveBeenCalledWith([{
            key: expect.any(String),
            variantComponent: DefaultVariant,
            contentComponent: ContentComponent,
            props: {},
            settings: {},
        }]);

        store.close(key);

        expect(listener).toHaveBeenCalledWith([]);
        expect(listener).toHaveBeenCalledTimes(2);
    });
});
