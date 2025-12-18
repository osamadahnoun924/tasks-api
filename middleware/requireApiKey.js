import { ApiError } from "../errors.js";

export const requireApiKey = (req, res, next) => {
  if (req.headers["x-api-key"] !== "supersecret123") {
    throw new ApiError(401, "Unauthorized");
  }
  next();
};
