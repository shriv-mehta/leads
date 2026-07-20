const jwt = require("jsonwebtoken");
const env = require("../config/env");
const AppError = require("../utils/AppError");
const { ROLES } = require("../config/constants");

const authenticate = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw new AppError("Not authenticated", 401);
    }

    const token = header.split(" ")[1];
    const payload = jwt.verify(token, env.jwt.accessSecret);
    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch (error) {
    return next(new AppError("Not authenticated", 401));
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== ROLES.ADMIN) {
    return next(new AppError("Admin access required", 403));
  }
  return next();
};

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return next(new AppError("Not allowed", 403));
  }
  return next();
};

module.exports = { authenticate, requireAdmin, requireRole };
