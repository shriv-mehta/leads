const { Op, fn, col, literal } = require("sequelize");
const Lead = require("../models/Lead");
const LeadActivity = require("../models/LeadActivity");
const User = require("../models/User");
const { areaNormalizedExpr, whereAreaNormalized } = require("../utils/area");

const buildWhere = (filters) => {
  const conditions = [{ deletedAt: null }];

  if (filters.ownerId) conditions.push({ ownerId: filters.ownerId });
  if (filters.status) conditions.push({ status: filters.status });
  if (filters.chance) conditions.push({ businessChance: filters.chance });
  if (filters.areaNormalized) conditions.push(whereAreaNormalized(filters.areaNormalized));

  if (filters.from || filters.to) {
    const createdAt = {};
    if (filters.from) createdAt[Op.gte] = filters.from;
    if (filters.to) createdAt[Op.lte] = filters.to;
    conditions.push({ createdAt });
  }

  if (filters.q) {
    conditions.push({
      [Op.or]: [
        { contactName: { [Op.iLike]: `%${filters.q}%` } },
        { companyName: { [Op.iLike]: `%${filters.q}%` } },
      ],
    });
  }

  return { [Op.and]: conditions };
};

const create = (data) => Lead.create(data);

const findById = (id) =>
  Lead.findOne({
    where: { id, deletedAt: null },
    include: [
      { model: User, as: "owner", attributes: ["id", "name", "email"] },
      { model: LeadActivity, as: "activities", separate: true, order: [["activityDate", "DESC"]] },
    ],
  });

const update = async (id, data) => {
  const lead = await Lead.findOne({ where: { id, deletedAt: null } });
  if (!lead) return null;
  return lead.update(data);
};

const softDelete = async (id) => {
  const lead = await Lead.findOne({ where: { id, deletedAt: null } });
  if (!lead) return null;
  return lead.update({ deletedAt: new Date() });
};

const findDuplicate = ({ phone, email, excludeId }) => {
  const orConditions = [];
  if (phone) orConditions.push({ phone });
  if (email) orConditions.push({ email });
  if (orConditions.length === 0) return null;

  const where = { deletedAt: null, [Op.or]: orConditions };
  if (excludeId) where.id = { [Op.ne]: excludeId };

  return Lead.findOne({
    where,
    include: [{ model: User, as: "owner", attributes: ["id", "name"] }],
    order: [["createdAt", "DESC"]],
  });
};

const list = async (filters, { page, limit }) => {
  const where = buildWhere(filters);
  const offset = (page - 1) * limit;

  const { rows, count } = await Lead.findAndCountAll({
    where,
    include: [{ model: User, as: "owner", attributes: ["id", "name"] }],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  return { rows, count };
};

const findAllForExport = (filters) =>
  Lead.findAll({
    where: buildWhere(filters),
    include: [{ model: User, as: "owner", attributes: ["id", "name"] }],
    order: [["createdAt", "DESC"]],
  });

const findLastAreaForOwner = async (ownerId) => {
  const lead = await Lead.findOne({
    where: { ownerId, deletedAt: null },
    order: [["createdAt", "DESC"]],
    attributes: ["area"],
  });
  return lead?.area || null;
};

const distinctAreas = async (ownerId) => {
  const where = { deletedAt: null };
  if (ownerId) where.ownerId = ownerId;

  const rows = await Lead.findAll({
    where,
    attributes: [[fn("DISTINCT", col("area")), "area"]],
    order: [["area", "ASC"]],
    raw: true,
  });
  return rows.map((r) => r.area);
};

// Grouped strictly by lower(trim(area)) so case/whitespace variants of the
// same place collapse into one pin; MAX(area) just picks a display label.
const groupByArea = async (filters) => {
  const where = buildWhere(filters);
  return Lead.findAll({
    where,
    attributes: [
      [areaNormalizedExpr(), "areaNormalized"],
      [fn("MAX", col("area")), "area"],
      [fn("AVG", col("areaLat")), "areaLat"],
      [fn("AVG", col("areaLng")), "areaLng"],
      [fn("COUNT", col("id")), "leadCount"],
      [fn("COUNT", literal("CASE WHEN status = 'converted' THEN 1 END")), "convertedCount"],
    ],
    group: [areaNormalizedExpr()],
    raw: true,
  });
};

module.exports = {
  create,
  findById,
  update,
  softDelete,
  findDuplicate,
  list,
  findAllForExport,
  distinctAreas,
  groupByArea,
  findLastAreaForOwner,
  buildWhere,
};
