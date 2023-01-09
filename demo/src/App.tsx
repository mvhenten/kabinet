import reactLogo from "./assets/react.svg";
import "./App.css";

import { useCountStore, countStore } from "./todo";

function App() {
    const { count } = useCountStore();

    return (
        <div className="App">
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <a href="https://github.com/mvhenten/kabinet" target="_blank">
                    <span style={{ fontSize: "91px", lineHeight: "100px" }}>
                        🗄️
                    </span>
                </a>
                <a href="https://reactjs.org" target="_blank">
                    <img
                        src={reactLogo}
                        className="logo react"
                        alt="React logo"
                    />
                </a>
            </div>
            <h1>Kabinet + React</h1>
            <div className="card">
                <button onClick={() => countStore.increment()}>
                    count is {count}
                </button>
                <p>
                    This small demo shows kabinet with React using a{" "}
                    <em>custom hook</em>.
                </p>
            </div>
            <p className="read-the-docs">
                View source{" "}
                <a href="https://github.com/mvhenten/kabinet/demo/src/store.ts">
                    here
                </a>
                .
            </p>
        </div>
    );
}

export default App;
