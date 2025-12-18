import { Router } from "express";
import { ApiError } from "./errors.js";
import { asyncHandler } from "./middleware/asyncHandler.js";
import { validateTask } from "./middleware/validateTask.js";
import { createFindTaskMiddleware } from "./middleware/findTasks.js";
import { requireApiKey } from "./middleware/requireApiKey.js";

const router = Router();

let tasks = [
  {
    id: 8,
    description: "Review pull request for the authentication changes",
    completed: true,
  },
  {
    id: 4,
    description: "Fix validation error on the task creation form",
    completed: false,
  },
  {
    id: 7,
    description: "Refactor task routes to use shared middleware",
    completed: true,
  },
  {
    id: 3,
    description: "Write unit tests for the task update endpoint",
    completed: false,
  },
  {
    id: 1,
    description: "Set up initial project structure and dependencies",
    completed: true,
  },
  {
    id: 10,
    description: "Deploy the latest build to the staging environment",
    completed: true,
  },
  {
    id: 6,
    description: "Add pagination support to the tasks API",
    completed: false,
  },
  {
    id: 5,
    description: "Update README with API usage examples",
    completed: true,
  },
  {
    id: 2,
    description: "Create basic CRUD endpoints for tasks",
    completed: false,
  },
  {
    id: 9,
    description: "Clean up unused files and console logs",
    completed: true,
  },
];

const findTask = createFindTaskMiddleware(tasks);

router.get("/", (req, res) => {
  let result = [...tasks];

  if (req.query.completed !== undefined) {
    const wantCompleted = req.query.completed === "true";
    result = result.filter((t) => t.completed === wantCompleted);
  }

  if (req.query.q !== undefined) {
    const normalizedQuery = decodeURIComponent(req.query.q).toLowerCase();
    result = result.filter((t) =>
      t.description.toLowerCase().includes(normalizedQuery)
    );
  }

  if (req.query.sort !== undefined) {
    if (req.query.sort === "asc") {
      result.sort((a, b) => a.id - b.id);
    } else if (req.query.sort === "desc") {
      result.sort((a, b) => b.id - a.id);
    }
  }

  const limit = req.query.limit ? Number(req.query.limit) : result.length;
  const offset = Number(req.query.offset) || 0;

  result = result.slice(offset, offset + limit);

  res.json({
    tasks: result,
  });
});

router.get(
  "/:id",
  findTask,
  asyncHandler(async (req, res) => {
    res.json(req.task);
  })
);

router.post("/", requireApiKey, validateTask, (req, res) => {
  const { description, completed } = req.body;

  const taskAsc = tasks.sort((a, b) => a.id - b.id);

  const id =
    taskAsc[tasks.length - 1] !== undefined
      ? taskAsc[tasks.length - 1].id + 1
      : 1;
  const newTask = { id, description, completed };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

router.put("/:id", requireApiKey, validateTask, findTask, (req, res) => {
  const { description, completed } = req.body;

  const updatedTask = { id: req.task.id, description, completed };

  tasks[req.taskIdx] = updatedTask;

  res.status(200).json(updatedTask);
});

router.patch("/:id", requireApiKey, findTask, (req, res) => {
  const { description, completed } = req.body;

  if (description !== undefined && typeof description !== "string") {
    throw new ApiError(400, "Description must be a string");
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    throw new ApiError(400, "Completed must be a boolean");
  }

  if (description !== undefined) req.task.description = description;
  if (completed !== undefined) req.task.completed = completed;

  res.json(req.task);
});

router.delete("/:id", requireApiKey, findTask, (req, res) => {
  tasks = tasks.filter((t) => t.id !== req.task.id);
  res.json({ deleted: true });
});

export default router;
