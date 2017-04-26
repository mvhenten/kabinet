"use strict";

const State = new WeakMap();

let instance;

class Keeper {
    constructor(storage) {
        State.set(this, {
            storage: storage,
            stores: new Map(),
        });
    }

    getStore(Store, defaults) {
        let state = State.get(this);

        if (!state.stores.has(Store.name)) {
            let store = new Store(defaults);

            if (state.storage) {
                store.setState(state.storage[Store.name]);
                store.observe((storeState) => {
                    state.storage[Store.name] = storeState;
                });
            }

            state.stores.set(Store.name, store);

        }

        return state.stores.get(Store.name);
    }

    serialize() {
        let state = State.get(this);

        let serializedState = {};
        for (let [name, store] of state.stores) {
            serializedState[name] = store.getState();
        }

        return serializedState;
    }
}

Keeper.initInstance = (storage) => {
    instance = new Keeper(storage);
    return instance;
};

Keeper.getInstance = () => {
    if (!instance)
        instance = new Keeper();

    return instance;
};

module.exports = Keeper;
