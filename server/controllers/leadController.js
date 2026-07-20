const express = require("express");
const { z } = require("zod");
const router = express.Router();
const leadService = require("../services/leadService");
const { authenticate, requireAdmin } = require("../middlewares/auth");
const validate = require("../middlewares/validate");

const businessChanceEnum = z.enum(["hot", "warm", "cold"]);
const statusEnum = z.enum(["new", "in_progress", "converted", "lost"]);
const idParamSchema = z.object({ id: z.string().uuid() });

const createLeadSchema = z
  .object({
    contactName: z.string().min(1),
    companyName: z.string().min(1),
    designation: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    metOn: z.string().optional(),
    conversationNotes: z.string().optional(),
    businessChance: businessChanceEnum.optional(),
    status: statusEnum.optional(),
    area: z.string().min(1),
    nextFollowupOn: z.string().optional(),
  })
  .refine((data) => Boolean(data.email || data.phone), {
    message: "Either email or phone is required",
    path: ["email"],
  });


const updateLeadSchema = z.object({
  contactName: z.string().min(1).optional(),
  companyName: z.string().min(1).optional(),
  designation: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  metOn: z.string().optional(),
  conversationNotes: z.string().optional(),
  businessChance: businessChanceEnum.optional(),
  status: statusEnum.optional(),
  area: z.string().min(1).optional(),
  nextFollowupOn: z.string().nullable().optional(),
});

const listQuerySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  status: statusEnum.optional(),
  chance: businessChanceEnum.optional(),
  owner_id: z.string().uuid().optional(),
  area: z.string().optional(),
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

const activitySchema = z.object({
  note: z.string().min(1),
  activityDate: z.string().optional(),
});

const createLead = async (req, res, next) => {
  try {
    const result = await leadService.createLead(req.user, req.body);
    return res.status(201).json({ success: true, data: result.lead, duplicateWarning: result.duplicateWarning });
  } catch (error) {
    return next(error);
  }
};

const getLeads = async (req, res, next) => {
  try {
    const { data, pagination } = await leadService.listLeads(req.user, req.query);
    return res.status(200).json({ success: true, data, pagination });
  } catch (error) {
    return next(error);
  }
};

const getLeadMap = async (req, res, next) => {
  try {
    const groups = await leadService.getMapGroups(req.user, req.query);
    return res.status(200).json({ success: true, data: groups });
  } catch (error) {
    return next(error);
  }
};

const exportLeads = async (req, res, next) => {
  try {
    const csv = await leadService.exportCsv(req.user, req.query);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=leads-export.csv");
    return res.status(200).send(csv);
  } catch (error) {
    return next(error);
  }
};

const getLead = async (req, res, next) => {
  try {
    const lead = await leadService.getLead(req.user, req.params.id);
    return res.status(200).json({ success: true, data: lead });
  } catch (error) {
    return next(error);
  }
};

const updateLead = async (req, res, next) => {
  try {
    const result = await leadService.updateLead(req.user, req.params.id, req.body);
    return res.status(200).json({ success: true, data: result.lead, duplicateWarning: result.duplicateWarning });
  } catch (error) {
    return next(error);
  }
};

const deleteLead = async (req, res, next) => {
  try {
    await leadService.deleteLead(req.params.id);
    return res.status(200).json({ success: true, data: null });
  } catch (error) {
    return next(error);
  }
};

const addActivity = async (req, res, next) => {
  try {
    const activity = await leadService.addActivity(req.user, req.params.id, req.body);
    return res.status(201).json({ success: true, data: activity });
  } catch (error) {
    return next(error);
  }
};

const getActivities = async (req, res, next) => {
  try {
    const activities = await leadService.listActivities(req.user, req.params.id);
    return res.status(200).json({ success: true, data: activities });
  } catch (error) {
    return next(error);
  }
};

router.get("/", authenticate, validate({ query: listQuerySchema }), getLeads);
router.post("/", authenticate, validate({ body: createLeadSchema }), createLead);
router.get("/map", authenticate, validate({ query: listQuerySchema }), getLeadMap);
router.get("/export", authenticate, requireAdmin, validate({ query: listQuerySchema }), exportLeads);
router.get("/:id", authenticate, validate({ params: idParamSchema }), getLead);
router.patch(
  "/:id",
  authenticate,
  validate({ params: idParamSchema, body: updateLeadSchema }),
  updateLead
);
router.delete("/:id", authenticate, requireAdmin, validate({ params: idParamSchema }), deleteLead);
router.post(
  "/:id/activities",
  authenticate,
  validate({ params: idParamSchema, body: activitySchema }),
  addActivity
);
router.get(
  "/:id/activities",
  authenticate,
  validate({ params: idParamSchema }),
  getActivities
);

module.exports = router;
