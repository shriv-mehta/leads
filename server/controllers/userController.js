const express = require("express");
const { z } = require("zod");
const router = express.Router();
const userService = require("../services/userService");
const { authenticate, requireAdmin } = require("../middlewares/auth");
const validate = require("../middlewares/validate");

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
});

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  isActive: z.boolean().optional(),
});

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

const idParamSchema = z.object({ id: z.string().uuid() });

const createUser = async (req, res, next) => {
  try {
    const user = await userService.createEmployee(req.body);
    return res.status(201).json({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const { data, pagination } = await userService.listUsers(req.query);
    return res.status(200).json({ success: true, data, pagination });
  } catch (error) {
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
};

router.get("/", authenticate, requireAdmin, validate({ query: listQuerySchema }), getUsers);
router.post("/", authenticate, requireAdmin, validate({ body: createUserSchema }), createUser);
router.patch(
  "/:id",
  authenticate,
  requireAdmin,
  validate({ params: idParamSchema, body: updateUserSchema }),
  updateUser
);

module.exports = router;
