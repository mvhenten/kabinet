type StateObserverFn<StateType> = (x: StateType) => void;

export default abstract class Store<StateType> {
    private observers: Set<StateObserverFn<StateType>> = new Set();

    constructor(protected state = {} as StateType) {}

    observe(fn: StateObserverFn<StateType>): () => void {
        this.observers.add(fn);

        return (): void => {
            this.observers.delete(fn);
        };
    }

    getState(): StateType {
        return Object.seal(this.state);
    }

    setState(updates: Partial<StateType>): void {
        const newState = { ...this.state };

        for (const key in updates) {
            // Partial<StateType> already protects state[key] type
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            newState[key] = updates[key]!;
        }

        this.state = newState;

        for (const fn of this.observers) {
            fn(this.getState());
        }
    }
}
