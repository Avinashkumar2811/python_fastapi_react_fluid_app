import React, { useEffect, useState } from "react";


const API_URL = "http://localhost:8000";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  // Fetch tasks
  const fetchTasks = async () => {
    const res = await fetch(`${API_URL}/tasks`);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add task
  const addTask = async () => {
    if (!title.trim()) return;

    await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    setTitle("");
    fetchTasks();
  };

  // Toggle task completion
  const toggleTask = async (id) => {
    await fetch(`${API_URL}/tasks/${id}`, { method: "PUT" });
    fetchTasks();
  };

  // Delete task
  const deleteTask = async (id) => {
    await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  const completed = tasks.filter(t => t.completed).length;
  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 w-96 rounded-lg shadow-md">
        <h1 className="text-xl font-bold text-center mb-4">
          📝 Task Board
        </h1>

        {/* Add Task */}
        <div className="flex gap-2 mb-4">
          <input
            className="border p-2 flex-1 rounded"
            placeholder="Enter task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            onClick={addTask}
            className="bg-blue-500 text-white px-4 rounded"
          >
            Add
          </button>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-green-500 rounded transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Task List */}
        <ul className="space-y-2">
          {tasks.map(task => (
            <li
              key={task.id}
              className={`flex items-center justify-between p-2 rounded
              ${task.completed ? "bg-green-100 line-through" : "bg-gray-50"}`}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />
              <span className="flex-1 ml-2">{task.title}</span>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        {/* Completion Message */}
        {tasks.length > 0 && completed === tasks.length && (
          <p className="text-green-600 text-center mt-4 font-semibold">
            🎉 All tasks completed!
          </p>
        )}
      </div>
    </div>
  );
}
