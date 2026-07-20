const express = require("express");
const { z } = require("zod");
const router = express.Router();
const authService = require("../services/authService");
const { authenticate } = require("../middlewares/auth");
const { loginLimiter } = require("../middlewares/rateLimiter");
const validate = require("../middlewares/validate");

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const tokens = await authService.refresh(req.body.refreshToken);
    return res.status(200).json({ success: true, data: tokens });
  } catch (error) {
    return next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await authService.logout();
    return res.status(200).json({ success: true, data: null });
  } catch (error) {
    return next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await authService.me(req.user.id);
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
};

router.post("/login", loginLimiter, validate({ body: loginSchema }), login);
router.post("/refresh", validate({ body: refreshSchema }), refresh);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, me);

module.exports = router;
