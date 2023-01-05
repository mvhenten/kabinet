# 🗄️ kabinet
Kabinet is a minimal framework for (p)react based webapps that provides an _external_ state designed to be used together with with React's _useEffect_ and _useSyncExternalStore_.

See [Subscribing to an external store](https://beta.reactjs.org/reference/react/useSyncExternalStore#subscribing-to-an-external-store) in the React manual for a better explanation why this is useful.

## Changes since 1.x
From version 1.x the API is strictly typescript and compiled to ES6. 

# Installation

`npm install kabinet --save-dev`

## Usage

### Example using useSyncExternalStore

This example draws from the [useSyncExternalStore](https://beta.reactjs.org/reference/react/useSyncExternalStore) example.

*TodoStore.ts*

```typescript
import Store from "kabinet";

interface Todo {
  id: number;
  done: boolean;
  text: string;
}

class TodoStore extends Store<{todos:Map<number,Todo[]>}> {
  private lastId = 0;

  addTodo() {
    const id = this.lastId++;
    const text = `Todo #${id}`;

    this.getState().todos.add(id, { id, done:false, text});
  }
};
export const todoStore = new TodoStore();

export const subscribe = (done) => todoStore.observe(done);

export const getState = () => todoStore.getState();
```

*App.js*

```typescript
import { useSyncExternalStore } from 'react';
import { todoStore, subscribe, getState } from './todoStore';

export default function TodosApp() {
  const {todos} = useSyncExternalStore(subscribe, getState);

  return (
    <>
      <button onClick={() => todosStore.addTodo()}>Add todo</button>
      <hr />
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
```

### Using useEffect

See [useEffect](https://beta.reactjs.org/reference/react/useEffect)

*App.js*

```typescript
import { useState, useEffect  } from 'react';
import { todoStore } from './todoStore';

export default function TodosApp() {
  const [todoState, setTodoState] = useState(todoStore.getState());
  
  // only connect when mounting the component
  useEffect(() => todoState.observe(setTodoState),  []);

  return (
    <>
      <button onClick={() => todosStore.addTodo()}>Add todo</button>
      <hr />
      <ul>
        {todoState.todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
```

### Creating a custom hook

See [Extracting the logic to a custom Hook](https://beta.reactjs.org/reference/react/useSyncExternalStore#extracting-the-logic-to-a-custom-hook) from react's manual:

Adding the following custom hook to the todoStore above:

*TodoStore.ts*

```typescript
export const useTodoStore = () => (
  useSyncExternalStore(
    (done) => todoStore.observe(done)), 
    todoStore.getState()
  )
);
```

Now different components can call `useTodoStore`` without repeating the underlying implementation:

```typescript
import { useTodoStore, todosStore } from './todoStore';

export default function TodosApp() {
  const {todos} = useTodoStore();

  return (
    <>
      <button onClick={() => todosStore.addTodo()}>Add todo</button>
      <hr />
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
  ```


## background

Since reading about the [flux architecture pattern](https://reactjs.org/blog/2014/05/06/flux.html) I've had copies of something like _store.js_ around in my projects. Kabinet is where I publish my latest copy. Since my teams have moved to typescript, I dropped runtime type systems and have simplified this library significantly.

Still, I believe it's useful to separate the core logic of calling subscribers from my apps and keep it around in this separate package. 

kabinet is simple, uses no globals, and works well with server-side rendering.