import { ApiError } from "../errors.js";

export const createFindTaskMiddleware = (tasks) => {
  return (req, res, next) => {
    const id = Number(req.params.id);
    const taskIdx = tasks.findIndex((t) => t.id == id);

    if (taskIdx === -1) {
      throw new ApiError(404, "Task not found");
    }

    req.taskIdx = taskIdx;
    req.task = tasks[taskIdx];

    next();
  };
};
