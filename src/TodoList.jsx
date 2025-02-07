import React, { useState, useEffect } from "react";

const API_URL = "http://127.0.0.1:5000"; // 🔹 指向本機端的 Flask API

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(false);

  // 取得待辦事項
  const fetchTodos = () => {
    fetch(`${API_URL}/todos`)
      .then((res) => res.json())
      .then((data) => setTodos(data));
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // 新增待辦事項
  const addTodo = () => {
    fetch(`${API_URL}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task }),
    })
      .then((res) => res.json())
      .then(() => {
        setTask("");
        fetchTodos();
      });
  };

  // 刪除待辦事項
  const deleteTodo = (id) => {
    fetch(`${API_URL}/todos/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => fetchTodos());
  };

  // 使用 AI 生成待辦事項
  const generateTodo = () => {
    setLoading(true);
    fetch(`${API_URL}/generate-todo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "幫我安排明天的行程" }),
    })
      .then((res) => res.json())
      .then(() => {
        setLoading(false);
        fetchTodos();
      });
  };

  return (
    <div>
      <input value={task} onChange={(e) => setTask(e.target.value)} />
      <button onClick={addTodo}>新增</button>
      <button onClick={generateTodo} disabled={loading}>
        {loading ? "生成中..." : "使用 AI 生成"}
      </button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.task} <button onClick={() => deleteTodo(todo.id)}>刪除</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
