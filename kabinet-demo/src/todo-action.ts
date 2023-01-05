import { todoStore } from "./todo-store";

/**
 * Contrived example of obtaining an optimistic lock before starting some async
 * update flow. Just for illustration purposes.
 */
export const setTodo = async (key: string, value: boolean): Promise<void> => {
    const { todos, status } = todoStore.getState();

    if (status !== "ready")
        throw new Error("Cannot update todo store while saving!");

    console.log("start", todoStore.getState());

    todoStore.setState({ status: "saving" });

    await new Promise((resolve) => setTimeout(resolve, 500));

    todoStore.setState({ status: "ready", todos });
    console.log("done", todoStore.getState());
}