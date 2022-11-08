# kabinet
Observable key-value stores for flux apps

From version 1.x the API is strictly typescript and ES6. 

# Installation

`npm install kabinet --save-dev`

## Usage

This simple example creates a store that can be observed for changes.
Note how all state is strictly typed all the way.

```typescript
import Store from "kabinet";

export type TodoData = Map<string, boolean>;

export interface TodoState {
    todos: TodoData;
}

export class TodoStore extends Store<TodoState> {
    static initialTodo = new Map<string, boolean>();

    constructor() {
        super({
            todos: TodoStore.initialTodo,
        });
    }

    markTodoDone(key: string): void {
        this.setTodo(key, true);
    }

    addTodo(key: string): void {
        this.setTodo(key, false);
    }

    private setTodo(key: string, value: boolean): void {
        const { todos } = this.getState();
        todos.set(key, value);
        this.setState({ todos });
    }
}

export const todoStore = new TodoStore();
```


## Sample Todo App

The following trivial todo app shows how our observer pattern integrates seamlessly with React hooks.
Kabinet can serve as a bridge to components outside of react, as you can have as many observers as needed.


```javascript

import React, { useState, useEffect, FormEvent } from 'react';
import { TodoData, todoStore } from "./Todo";

function Todo() {
    const [todo, setTodo] = useState("test");

    const addTodo = (evt: FormEvent) => {
        todoStore.addTodo(todo);
        setTodo("");
    }

    const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const target = evt.target as HTMLInputElement;
        setTodo(target.value);
    }

    return (
        <div>
            <input name="new" value={todo} onChange={onChange} type="text" />
            <button onClick={addTodo}>Add todo</button>
        </div>
    );
}

const TodoList = (props: { todos: TodoData }) => {
    const todos = Array.from(props.todos.entries());

    const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        todoStore.markTodoDone(evt.target.name);
    }

    return (
        <ul>{todos.map(([key, checked]) => (
            <li key={key}>
                <label>
                    <input type="checkbox" name={key} onChange={onChange} checked={checked} />{key}
                </label>
            </li>))}
        </ul>);
}

function App() {
    const [todoData, setTodoData] = useState({ todos: new Map<string, boolean>() });

    useEffect(() => todoStore.observe(setTodoData));

    return (
        <div className="App">
            <Todo />
            <TodoList todos={todoStore.getState().todos} />
        </div>
    );
}

export default App;
```

## background

Kabinet introduces a event-less observable store implementation for flux apps,
introducing flux-stores *without* the use of EventEmitter, based on the 
[Observer pattern](https://en.wikipedia.org/wiki/Observer_pattern) instead.

Stores work as a proxy object between internal state and the outside world, borrowing
concepts from the [object.observe shim](https://github.com/KapIT/observe-shim).

This implementation has the following advantages:

- Stores can be used server-side without side-effects
- Easy to reason about stores, as they are just an `import` away
- Simple unit tests can be used to test behaviour of methods
- Stores are typed, and can be initialised with data.

