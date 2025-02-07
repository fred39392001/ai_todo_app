import React, { useState, useEffect } from "react";

// const API_URL = "http://127.0.0.1:5001";  // 🔹 指向本機端的 Flask API
const API_URL = "https://aitodoappbackend-production.up.railway.app";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(false);

  // 取得待辦事項
const fetchTodos = async () => {
  try {
    const response = await fetch(`${API_URL}/todos`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    setTodos(data);
  } catch (error) {
    console.error('Error fetching todos:', error);
  }
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
  const generateTodo = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/generate-todo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: "幫我安排明天的行程" })
      });
  
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
  
      await res.json();
      fetchTodos();  // 重新載入待辦事項
    } catch (error) {
      console.error("生成待辦事項時發生錯誤:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="mb-4">待辦事項清單</h2>
          
          <div className="input-group mb-4">
            <input
              type="text"
              className="form-control"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="輸入待辦事項..."
            />
            <button 
              className="btn btn-primary"
              onClick={addTodo}
            >
              新增
            </button>
            <button
              className="btn btn-secondary"
              onClick={generateTodo}
              disabled={loading}
            >
              {loading ? "生成中..." : "使用 AI 生成"}
            </button>
          </div>
  
          <div className="list-group">
            {todos.length === 0 ? (
              <div className="text-center text-muted p-4">
                目前沒有待辦事項
              </div>
            ) : (
              todos.map((todo) => (
                <div 
                  key={todo.id} 
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                >
                  <span>{todo.task}</span>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    刪除
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
