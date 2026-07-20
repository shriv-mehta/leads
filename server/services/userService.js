const AppError = require("../utils/AppError");
const userRepository = require("../repositories/userRepository");
const authService = require("./authService");
const { DEFAULT_PAGE_SIZE, ROLES } = require("../config/constants");

const createEmployee = async ({ name, email, password, phone }) => {
  const existing = await userRepository.findByEmail(email);
  if (existing) throw new AppError("A user with this email already exists", 409);

  const passwordHash = await authService.hashPassword(password);
  const user = await userRepository.create({
    name,
    email,
    phone,
    passwordHash,
    role: ROLES.EMPLOYEE,
  });

  return authService.stripSensitive(user);
};

const listUsers = async ({ page = 1, limit = DEFAULT_PAGE_SIZE }) => {
  const offset = (page - 1) * limit;
  const { rows, count } = await userRepository.list({ limit, offset });

  return {
    data: rows.map(authService.stripSensitive),
    pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
  };
};

const updateUser = async (id, updates) => {
  // Never let this route touch the password or role of an account through
  // a generic PATCH — those are separate, deliberate actions.
  const { name, phone, isActive } = updates;
  const user = await userRepository.update(id, { name, phone, isActive });
  if (!user) throw new AppError("User not found", 404);
  return authService.stripSensitive(user);
};

module.exports = { createEmployee, listUsers, updateUser };
