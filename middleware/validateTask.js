import { ApiError } from "../errors.js";

export const validateTask = (req, res, next) => {
  const { description, completed } = req.body;

  if (description === undefined || completed === undefined) {
    return next(new ApiError(400, "Description and complete required"));
  }

  next();
};
