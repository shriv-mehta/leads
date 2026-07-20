const AppError = require("../utils/AppError");

// validate({ body: zodSchema, query: zodSchema, params: zodSchema })
const validate = (schemas) => (req, res, next) => {
  for (const key of ["body", "query", "params"]) {
    const schema = schemas[key];
    if (!schema) continue;

    const result = schema.safeParse(req[key]);
    if (!result.success) {
      return next(
        new AppError(
          "Validation failed",
          400,
          result.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          }))
        )
      );
    }
    req[key] = result.data;
  }
  return next();
};

module.exports = validate;
