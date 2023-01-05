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

    setState(newState: Partial<StateType>): void {
        for (const key in newState) {
            // Partial<StateType> already protects state[key] type
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.state[key] = newState[key]!;
        }

        for (const fn of this.observers) {
            fn(this.getState());
        }
    }
}
