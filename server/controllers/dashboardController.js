const express = require("express");
const { z } = require("zod");
const router = express.Router();
const dashboardService = require("../services/dashboardService");
const { authenticate, requireAdmin } = require("../middlewares/auth");
const validate = require("../middlewares/validate");

const filterQuerySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  status: z.enum(["new", "in_progress", "converted", "lost"]).optional(),
  chance: z.enum(["hot", "warm", "cold"]).optional(),
  employee_id: z.string().uuid().optional(),
  area: z.string().optional(),
});

const getKpis = async (req, res, next) => {
  try {
    const data = await dashboardService.getKpis(req.query);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

const getTrends = async (req, res, next) => {
  try {
    const data = await dashboardService.getTrends(req.query);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

const getEmployeePerformance = async (req, res, next) => {
  try {
    const data = await dashboardService.getEmployeePerformance(req.query);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

const getAreaPerformance = async (req, res, next) => {
  try {
    const data = await dashboardService.getAreaPerformance(req.query);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

router.get("/kpis", authenticate, requireAdmin, validate({ query: filterQuerySchema }), getKpis);
router.get("/trends", authenticate, requireAdmin, validate({ query: filterQuerySchema }), getTrends);
router.get(
  "/employees",
  authenticate,
  requireAdmin,
  validate({ query: filterQuerySchema }),
  getEmployeePerformance
);
router.get(
  "/areas",
  authenticate,
  requireAdmin,
  validate({ query: filterQuerySchema }),
  getAreaPerformance
);

module.exports = router;
