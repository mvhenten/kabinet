import Store from "kabinet";
import { useSyncExternalStore } from "react";

type CountState = { count: number };

class CountStore extends Store<CountState> {
    increment() {
        this.setState({ count: this.state.count + 1 });
    }
}

export const countStore = new CountStore({ count: 0 });

export function useCountStore() {
    return useSyncExternalStore(
        (subscribe) => countStore.observe(subscribe),
        () => countStore.getState()
    );
}
