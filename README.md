# kabinet
Observable, _external_ key-value stores for flux apps. 
From version 1.x the API is strictly typescript and ES6. 

Kabinet works has an API that intergrates _external_ state with React's _useEffect_ and _useState_ [hooks](https://beta.reactjs.org/apis/react/useEffect#connecting-to-an-external-system).

# Installation

`npm install kabinet --save-dev`

## Usage

This simple example creates a store that can be observed for changes.
Note how all state is strictly typed all the way.

```typescript
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
```


## Sample Todo App

The following trivial todo app shows how our observer pattern integrates seamlessly with React hooks.
Kabinet can serve as a bridge to components outside of react, as you can have as many observers as needed.


```javascript
import React, { useState, useEffect, ChangeEvent } from 'react'
import { todoStore, TodoState } from "./todo-store";

function App() {
    const [todoState, setTodoState] = useState(todoStore.getState());
    const [todo, updateTodo] = useState("");

    const onCheck = (evt:ChangeEvent<HTMLInputElement>) => {
      todoStore.setTodo(evt.target.name, evt.target.checked);
    }

    const onChange = (evt:ChangeEvent<HTMLInputElement>) => {
      updateTodo(evt.target.value);
    }

    const addTodo = () => {
      if (todo !== "") {
        todoStore.setTodo(todo, false); 
        updateTodo("");
      }
    }

    // The observe method returns cleanup code, and removes the binding.
    useEffect(() => todoStore.observe(setTodoState));

    const todos = Array.from(todoState.todos.entries());

    return (
      <div>
        <ul>
          {todos.map(([key, value], idx) => (
            <li key={idx}>
              <label>
                <input onChange={onCheck} name={key} type="checkbox" checked={value} />{key}
              </label>
              </li>
            ))}
        </ul>
        <input type="text" value={todo} onChange={onChange} />
        <button onClick={addTodo}>add</button>
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

