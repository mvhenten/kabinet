# 🗄️ kabinet
Kabinet is a minimal framework for (p)react based webapps that provides an _external_ state designed to be used together with with React's _useEffect_ and _useSyncExternalStore_.

See [Subscribing to an external store](https://beta.reactjs.org/reference/react/useSyncExternalStore#subscribing-to-an-external-store) in the React manual for a better explanation why this is useful.

## Changes since 1.x
From version 1.x the API is strictly typescript and compiled to ES6. 

# Installation

`npm install kabinet --save-dev`

## Usage

### Example using useSyncExternalStore with a custom hook

This example draws from the [useSyncExternalStore](https://beta.reactjs.org/reference/react/useSyncExternalStore) example.

*count.ts*

```typescript
import Store from "kabinet";
import { useSyncExternalStore } from 'react';

type CountState = { count: number };

class CountStore extends Store<CountState>{
    increment() {
        this.setState({ count: this.state.count + 1 });
    }
};

export const countStore = new CountStore({ count: 0 });

export function useCountStore() {
  return useSyncExternalStore(
    subscribe => countStore.observe(subscribe), 
    () => countStore.getState()
  );
}
```

*App.tsx*
```typescript
import { useCountStore, countStore  } from './count';

function App() {
  const {count} = useCountStore();

  return (
    <button onClick={() => countStore.increment()}>
      count is {count}
    </button>
  )
}

export default App
```


## Background

Since reading about the [flux architecture pattern](https://reactjs.org/blog/2014/05/06/flux.html) I've had copies of something like _store.js_ around in my projects. Kabinet is where I publish my latest copy. Since my teams have moved to typescript, I dropped runtime type systems and have simplified this library significantly.

kabinet is simple, uses no globals, and can be made to work well with server-side rendering.


### SSR (Server Side Rendering)
Examples above used singletons, which which should be avoided (or used with care!) when rendering server-side. 

One simple solution is is to keep track of all singletons and make sure to clean and swap them out before each render using a "store keeper".

See [./src/keeper/](./src/keeper/index.ts) for a small proof of concept:

*server.ts*
```typescript
import { setStore, clearStores } from "kabinet/dist/keeper";
import { CountStore } from "./client/stores/count";

const render = (App, count=0) => {
  clearStores();
  setStore(CountStore, new CountStore({count}));

  return ReactDOMServer.renderToSTring(<App />);
}
```

*App.tsx*
```typescript
import { CountStore  } from './count';
import { getStore } from "kabinet/dist/keeper";

const countStore = getStore(CountStore);

const useCountStore = () => {
  return useSyncExternalStore(
    subscribe => countStore.observe(subscribe), 
    () => countStore.getState()
  );
}

function App() {
  const {count} = useCountStore();

  return (
    <button onClick={() => countStore.increment()}>
      count is {count}
    </button>
  )
}

export default App
```

## Demo app

Prepare and run the demo using `npm run demo`.

