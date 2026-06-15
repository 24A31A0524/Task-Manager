import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

let tasks = [
  {
    id: 1,
    title: "Complete Task Manager Project",
    description: "Build a full stack task manager",
    status: "Pending",
    priority: "High",
    dueDate: "2026-06-30",
    tags: ["Work"],
    important: true,
    completed: false,
    createdAt: new Date(),
  },
];

// Home Route
app.get("/", (req, res) => {
  res.send("Task Manager API Running");
});

// Get All Tasks
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// Dashboard Statistics
app.get("/api/tasks/stats", (req, res) => {
  const total = tasks.length;

  const completed = tasks.filter((task) => task.status === "Completed").length;

  const pending = tasks.filter((task) => task.status === "Pending").length;

  const overdue = tasks.filter(
    (task) =>
      task.dueDate &&
      new Date(task.dueDate) < new Date() &&
      task.status !== "Completed"
  ).length;

  res.json({
    total,
    completed,
    pending,
    overdue,
  });
});

// Search Tasks
app.get("/api/tasks/search", (req, res) => {
  const query = req.query.query?.toLowerCase() || "";

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query)
  );

  res.json(filteredTasks);
});

// Filter Tasks
app.get("/api/tasks/filter", (req, res) => {
  const { status, priority, tag } = req.query;

  let filteredTasks = [...tasks];

  if (status) {
    filteredTasks = filteredTasks.filter((task) => task.status === status);
  }

  if (priority) {
    filteredTasks = filteredTasks.filter((task) => task.priority === priority);
  }

  if (tag) {
    filteredTasks = filteredTasks.filter((task) => task.tags.includes(tag));
  }

  res.json(filteredTasks);
});

// Create Task
app.post("/api/tasks", (req, res) => {
  const newTask = {
    id: Date.now(),
    title: req.body.title,
    description: req.body.description || "",
    status: req.body.status || "Pending",
    priority: req.body.priority || "Medium",
    dueDate: req.body.dueDate || null,
    tags: req.body.tags || [],
    important: req.body.important || false,
    completed: false,
    createdAt: new Date(),
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

// Update Task
app.put("/api/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id == req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  task.title = req.body.title || task.title;
  task.description = req.body.description || task.description;
  task.status = req.body.status || task.status;
  task.priority = req.body.priority || task.priority;
  task.dueDate = req.body.dueDate || task.dueDate;
  task.tags = req.body.tags || task.tags;
  task.important =
    req.body.important !== undefined
      ? req.body.important
      : task.important;

  res.json(task);
});

// Toggle Complete
app.patch("/api/tasks/:id/toggle", (req, res) => {
  const task = tasks.find((t) => t.id == req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  task.completed = !task.completed;
  task.status = task.completed ? "Completed" : "Pending";

  res.json(task);
});

// Delete Task
app.delete("/api/tasks/:id", (req, res) => {
  tasks = tasks.filter((task) => task.id != req.params.id);

  res.json({ message: "Task deleted" });
});

// Start Server
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});