import express from "express";
import tasksRoutes from "./tasksRoutes.js";
import { logger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.use(logger);

app.use("/api/tasks", tasksRoutes);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("App running on port 3000");
});
