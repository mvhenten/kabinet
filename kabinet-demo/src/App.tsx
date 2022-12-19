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