import Store from "../store";

type StoreConstructor = new () => Store<any>;

const getStores = () => new WeakMap<StoreConstructor, Store<any>>();

let stores = getStores();

export default {
    getStore(S: StoreConstructor): Store<any> {
        if (!stores.has(S))
            throw new Error(`Store ${S.name} has not been initialized`);

        return stores.get(S) as Store<any>;
    },

    setStore(S: StoreConstructor, store: Store<any>) {
        stores.set(S, store);
    },

    clearStores() {
        stores = getStores();
    },
};
