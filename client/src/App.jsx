import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [tags, setTags] = useState("");
  const [important, setImportant] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [darkMode, setDarkMode] = useState(false);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;

    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          status,
          priority,
          dueDate,
          tags: tags
            ? tags.split(",").map((tag) => tag.trim())
            : [],
          important,
        }),
      });

      const newTask = await response.json();

      setTasks([...tasks, newTask]);

      setTitle("");
      setDescription("");
      setStatus("Pending");
      setPriority("Medium");
      setDueDate("");
      setTags("");
      setImportant(false);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
      });

      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const toggleTask = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${id}/toggle`,
        {
          method: "PATCH",
        }
      );

      const updatedTask = await response.json();

      setTasks(
        tasks.map((task) =>
          task.id === id ? updatedTask : task
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const overdueTasks = tasks.filter(
    (task) =>
      task.dueDate &&
      new Date(task.dueDate) < new Date() &&
      task.status !== "Completed"
  ).length;

  const progress =
    totalTasks > 0
      ? (completedTasks / totalTasks) * 100
      : 0;

  const getCountdown = (date) => {
    if (!date) return "No Due Date";

    const diff = new Date(date) - new Date();

    const days = Math.ceil(
      diff / (1000 * 60 * 60 * 24)
    );

    if (days < 0) {
      return `Overdue by ${Math.abs(days)} day(s)`;
    }

    return `${days} day(s) remaining`;
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      task.description
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" ||
      task.priority === priorityFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority
    );
  });

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "30px auto",
        padding: "20px",
        fontFamily: "Arial",
        backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
        color: darkMode ? "#ffffff" : "#000000",
        minHeight: "100vh",
      }}
    >
      <h1>🚀 Smart Task Manager</h1>

      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          padding: "10px",
          marginBottom: "20px",
        }}
      >
        {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
      </button>

      {/* Dashboard */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            padding: "15px",
            background: "#f5f5f5",
            borderRadius: "8px",
            color: "#000",
          }}
        >
          <h3>Total</h3>
          <p>{totalTasks}</p>
        </div>

        <div
          style={{
            padding: "15px",
            background: "#d4edda",
            borderRadius: "8px",
            color: "#000",
          }}
        >
          <h3>Completed</h3>
          <p>{completedTasks}</p>
        </div>

        <div
          style={{
            padding: "15px",
            background: "#fff3cd",
            borderRadius: "8px",
            color: "#000",
          }}
        >
          <h3>Pending</h3>
          <p>{pendingTasks}</p>
        </div>

        <div
          style={{
            padding: "15px",
            background: "#f8d7da",
            borderRadius: "8px",
            color: "#000",
          }}
        >
          <h3>Overdue</h3>
          <p>{overdueTasks}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <h3>📊 Progress</h3>

      <div
        style={{
          width: "100%",
          background: "#ddd",
          borderRadius: "10px",
          overflow: "hidden",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "20px",
            background: "green",
          }}
        />
      </div>

      <p>
        {completedTasks}/{totalTasks} Tasks Completed (
        {progress.toFixed(0)}%)
      </p>

      {/* Search & Filters */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="🔍 Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          style={{
            padding: "10px",
            marginRight: "10px",
          }}
        >
          <option>All</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(e.target.value)
          }
          style={{
            padding: "10px",
          }}
        >
          <option>All</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      {/* Create Task */}
      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <h2>Create Task</h2>

        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <select
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value)
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) =>
            setDueDate(e.target.value)
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />

        <input
          type="text"
          placeholder="Tags (Study, Work, Personal)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />

        <label>
          <input
            type="checkbox"
            checked={important}
            onChange={(e) =>
              setImportant(e.target.checked)
            }
          />
          {" "}Important Task ⭐
        </label>

        <br />
        <br />

        <button
          onClick={addTask}
          style={{
            padding: "10px 20px",
          }}
        >
          Add Task
        </button>
      </div>

      {/* Task List */}
      {filteredTasks.map((task) => (
        <div
          key={task.id}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "8px",
            background:
              task.priority === "High"
                ? "#ffe5e5"
                : task.priority === "Medium"
                ? "#fff8e1"
                : "#e8f5e9",
            color: "#000",
          }}
        >
          <h3>
            {task.important ? "⭐ " : ""}
            {task.title}
          </h3>

          <p>{task.description}</p>

          <p>
            <strong>Status:</strong> {task.status}
          </p>

          <p>
            <strong>Priority:</strong> {task.priority}
          </p>

          <p>
            <strong>Due Date:</strong>{" "}
            {task.dueDate || "Not Set"}
          </p>

          <p>
            <strong>Countdown:</strong>{" "}
            {getCountdown(task.dueDate)}
          </p>

          <p>
            <strong>Tags:</strong>{" "}
            {task.tags?.join(", ") || "None"}
          </p>

          <button
            onClick={() => toggleTask(task.id)}
            style={{ marginRight: "10px" }}
          >
            {task.status === "Completed"
              ? "Mark Pending"
              : "Mark Complete"}
          </button>

          <button
            onClick={() => deleteTask(task.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;