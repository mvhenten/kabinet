import Store from "kabinet";
import { useSyncExternalStore } from "react";

export type TodoDate = Map<string, boolean>;

export interface TodoState {
  todos: TodoDate;
  status: "ready" | "saving";
}

export class TodoStore extends Store<TodoState> {
    static initialTodo = new Map<string, boolean>([
        ["Create TODO demo", true],
        ["Add more TODO's", true]
    ]);

    constructor() {
        super({
            status: "ready",
            todos: TodoStore.initialTodo,
        });
    }
}

export const todoStore = new TodoStore();

export const useTodoStore = () => useSyncExternalStore((subscribe) => todoStore.observe(subscribe), () => todoStore.getState());