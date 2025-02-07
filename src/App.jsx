import React from "react";
import TodoList from "./TodoList";

function App() {
  return (
    <div>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <h1 className="font-weight-bold">AI To-Do List</h1>
          </div>
        </div>
      </div>
      <TodoList />
    </div>
  );
}

export default App;
