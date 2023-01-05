# 🗄️ kabinet
Kabinet is a minimal framework for (p)react based webapps that provides an _external_ state designed to be used together with with React's _useEffect_ and _useSyncExternalStore_.

See [Subscribing to an external store](https://beta.reactjs.org/reference/react/useSyncExternalStore#subscribing-to-an-external-store) in the React manual for a better explanation why this is useful.

## Changes since 1.x
From version 1.x the API is strictly typescript and compiled to ES6. 

# Installation

`npm install kabinet --save-dev`

## Usage

Create a subclass of cabinet to store your data:

```
import Store from "kabinet";

class TodoStore extends Store<{todos:Record<string, boolean>}>;

export const todoStore = new TodoStore();

```

Inside a component, use effects ("hooks") to subscribe to state:

```
const RenderTodos = () => {
  const { todoState, setTodoState } = useState(todoStore.getState());

  useEffect(() => {
    const unsubscribe = todoStore.observe(setTodoState);
    return unsubscribe;
  }, []);

  // render todos
  return ...;
}



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

