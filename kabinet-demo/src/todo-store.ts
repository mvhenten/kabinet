import Store from "kabinet";

export type TodoDate = Map<string, boolean>;

export interface TodoState {
  todos: TodoDate;
}

export class TodoStore extends Store<TodoState> {
    static initialTodo = new Map<string, boolean>([
        ["Create TODO demo", true],
        ["Add more TODO's", true]
    ]);

    constructor() {
        super({
            todos: TodoStore.initialTodo,
        });
    }

    setTodo(key: string, value: boolean): void {
        const { todos } = this.getState();
        todos.set(key, value);
        this.setState({ todos });
    }
}

export const todoStore = new TodoStore();