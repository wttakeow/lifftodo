import React, { useState, useEffect } from 'react';
import { useLiff } from './hooks/useLiff';
import './App.css';

function App() {
  const { profile, error, isReady, login, liff } = useLiff();
  
  // --- TODO APP LOGIC ---
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState(() => {
    // Load saved tasks from localStorage on startup
    const savedTasks = localStorage.getItem('liff_tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  // Save tasks to localStorage whenever the 'tasks' array changes
  useEffect(() => {
    localStorage.setItem('liff_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!taskInput.trim()) return;

    const newTask = {
      id: Date.now(),
      text: taskInput,
      completed: false,
    };

    setTasks([newTask, ...tasks]);
    setTaskInput(""); // Clear input
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // --- UI RENDERING ---

  if (!isReady) return <div className="container"><div className="loader">Connecting...</div></div>;
  if (error) return <div className="container error"><h1>Error</h1><p>{error.message}</p></div>;

  return (
    <div className="container">
      {!profile ? (
        /* 1. LOGIN VIEW */
        <div className="landing-card">
          <h1>Welcome</h1>
          <p>Log in to manage your tasks.</p>
          <button className="login-btn" onClick={login}>Login with LINE</button>
        </div>
      ) : (
        /* 2. TODO BOARD VIEW */
        <div className="app-card">
          {/* Header with User Profile */}
          <header className="todo-header">
            <img src={profile.pictureUrl} alt="Profile" className="avatar-small" />
            <div>
              <p className="greeting">Hello, {profile.displayName.split(' ')[0]}!</p>
              <p className="subtitle">Task Board</p>
            </div>
          </header>

          {/* Task Input Form */}
          <form onSubmit={addTask} className="todo-form">
            <input 
              type="text" 
              placeholder="Add a new task..." 
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
            />
            <button type="submit" className="add-btn">+</button>
          </form>

          {/* Task List */}
          <div className="task-list">
            {tasks.length === 0 ? (
              <p className="empty-msg">No tasks yet. Add one above!</p>
            ) : (
              tasks.map(task => (
                <div key={task.id} className={`task-item ${task.completed ? 'done' : ''}`}>
                  <div className="task-text" onClick={() => toggleTask(task.id)}>
                    <span className="checkbox"></span>
                    {task.text}
                  </div>
                  <button className="delete-btn" onClick={() => deleteTask(task.id)}>✕</button>
                </div>
              ))
            )}
          </div>

          {/* Footer Info */}
          <footer className="todo-footer">
            <p>{tasks.filter(t => !t.completed).length} tasks remaining</p>
          </footer>
        </div>
      )}
    </div>
  );
}

export default App;
