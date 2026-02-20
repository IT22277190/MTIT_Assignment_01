import React, { useEffect, useState } from "react";

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("http://localhost:8000/tasks");

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "16px",
      }}
    >
      {tasks.map((task) => (
        <div
          key={task.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "16px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
        >
          <h3 style={{ marginTop: 0 }}>{task.title}</h3>
          <p>{task.description}</p>

          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input type="checkbox" checked={task.is_completed} readOnly />
            Completed
          </label>

          <button
            onClick={() => handleDelete(task.id)}
            style={{
              marginTop: "12px",
              padding: "8px 12px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default TaskBoard;
