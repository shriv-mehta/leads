const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("../config/env");
const AppError = require("../utils/AppError");
const userRepository = require("../repositories/userRepository");

const SALT_ROUNDS = 10;

const stripSensitive = (user) => {
  const plain = user.toJSON ? user.toJSON() : user;
  const { passwordHash, ...safe } = plain;
  return safe;
};

const issueTokens = (user) => {
  const accessToken = jwt.sign({ sub: user.id, role: user.role }, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn,
  });
  const refreshToken = jwt.sign({ sub: user.id, role: user.role }, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn,
  });
  return { accessToken, refreshToken };
};

const login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);
  if (!user || !user.isActive) {
    throw new AppError("Invalid email or password", 401);
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    throw new AppError("Invalid email or password", 401);
  }

  return { user: stripSensitive(user), ...issueTokens(user) };
};

const refresh = async (refreshToken) => {
  let payload;
  try {
    payload = jwt.verify(refreshToken, env.jwt.refreshSecret);
  } catch (error) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const user = await userRepository.findById(payload.sub);
  if (!user || !user.isActive) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  return issueTokens(user);
};

const me = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) throw new AppError("User not found", 404);
  return stripSensitive(user);
};

const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);

// Stateless JWTs — nothing to revoke server-side. Logout is the client
// discarding its stored tokens; this exists so the controller has a
// service call to make rather than special-casing the route.
const logout = async () => {};

module.exports = { login, refresh, me, logout, hashPassword, stripSensitive };
