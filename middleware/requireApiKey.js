import { ApiError } from "../errors.js";

console.log("Hi");
export const requireApiKey = (req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    return next();
  }

  if (req.headers["x-api-key"] !== process.env.API_KEY) {
    throw new ApiError(401, "Unauthorized");
  }

  next();
};
