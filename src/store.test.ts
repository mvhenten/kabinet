import test from "ava";
import Store from "./store";
import sinon from "ts-sinon";
import keeper from "./keeper";

interface FakeState {
    status: string;
    fakeTruth: boolean;
    defaultEnabled: true;
}

class FakeStore extends Store<FakeState> {
    constructor() {
        super({
            status: "not ok",
            fakeTruth: true,
            defaultEnabled: true,
        });
    }
}

test("constructor", (t) => {
    const fakeStore = new FakeStore();
    t.pass("Constructor worked");
    t.is(fakeStore.getState().fakeTruth, true);
    t.is(fakeStore.getState().status, "not ok");
});

test("observe", (t) => {
    const fakeStore = new FakeStore();
    const observer = sinon.stub();
    const cleanup = fakeStore.observe(observer);

    fakeStore.setState({ status: "fake status" });

    t.assert(observer.calledOnce);

    cleanup();

    fakeStore.setState({ status: "fake status" });

    t.assert(observer.calledOnce);
});

test("getState is immutable", (t) => {
    const store = new FakeStore();

    store.setState({ status: "new status" });

    t.is(store.getState(), store.getState(), "Store passes Object.is");

    const oldState = store.getState();

    store.setState({ status: "new status" });

    t.not(store.getState(), oldState, "State has changes after update");
});

test("keeper", (t) => {
    const store = new FakeStore();

    keeper.setStore(FakeStore, store);

    t.is(store, keeper.getStore(FakeStore));
});

test("keeper clears", (t) => {
    const store = new FakeStore();
    keeper.setStore(FakeStore, store);

    t.is(store, keeper.getStore(FakeStore));

    keeper.clearStores();

    const error = t.throws(() => {
        keeper.getStore(FakeStore);
    });

    t.assert(error);
    t.is(error?.message, "Store FakeStore has not been initialized");
});
