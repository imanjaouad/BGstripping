import { useState } from 'react';

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const addTask = () => {
    if (!input.trim()) {
      setError('La tâche ne peut pas être vide');
      return;
    }
    setTasks([...tasks, { id: Date.now(), text: input, completed: false }]);
    setInput('');
    setError('');
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div>
      <h2>Todo List</h2>
      <input
        type="text"
        value={input}
        placeholder="Nouvelle tâche"
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={addTask}>Ajouter</button>
      {error && <div role="alert">{error}</div>}

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span
              onClick={() => toggleTask(task.id)}
              style={{
                textDecoration: task.completed ? 'line-through' : 'none',
                cursor: 'pointer',
              }}
            >
              {task.text}
            </span>
            <button onClick={() => removeTask(task.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
