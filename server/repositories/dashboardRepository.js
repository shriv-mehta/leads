const { fn, col, literal } = require("sequelize");
const Lead = require("../models/Lead");
const User = require("../models/User");
const LeadActivity = require("../models/LeadActivity");
const { buildWhere } = require("./leadRepository");
const { areaNormalizedExpr } = require("../utils/area");

const getTotals = async (filters) => {
  const where = buildWhere(filters);
  const row = await Lead.findOne({
    where,
    attributes: [
      [fn("COUNT", col("id")), "total"],
      [fn("COUNT", literal("CASE WHEN status = 'converted' THEN 1 END")), "converted"],
    ],
    raw: true,
  });
  return { total: Number(row.total), converted: Number(row.converted) };
};

const getStatusBreakdown = async (filters) => {
  const where = buildWhere(filters);
  return Lead.findAll({
    where,
    attributes: ["status", [fn("COUNT", col("id")), "count"]],
    group: ["status"],
    raw: true,
  });
};

const getChanceBreakdown = async (filters) => {
  const where = buildWhere(filters);
  return Lead.findAll({
    where,
    attributes: ["businessChance", [fn("COUNT", col("id")), "count"]],
    group: ["businessChance"],
    raw: true,
  });
};

// Leads created per month, and how many of those (as of now) are converted —
// same "created_at drives both sides" rule as the top-level conversion ratio.
const getMonthlyTrends = async (filters) => {
  const where = buildWhere(filters);
  return Lead.findAll({
    where,
    attributes: [
      [fn("date_trunc", "month", col("createdAt")), "month"],
      [fn("COUNT", col("id")), "leadCount"],
      [fn("COUNT", literal("CASE WHEN status = 'converted' THEN 1 END")), "convertedCount"],
    ],
    group: [fn("date_trunc", "month", col("createdAt"))],
    order: [[fn("date_trunc", "month", col("createdAt")), "ASC"]],
    raw: true,
  });
};

const getEmployeePerformance = async ({ mtdFilters, ytdFilters }) => {
  const mtdWhere = buildWhere(mtdFilters);
  const ytdWhere = buildWhere(ytdFilters);

  const employees = await User.findAll({
    where: { role: "employee" },
    attributes: ["id", "name", "email", "isActive"],
    raw: true,
  });

  const [mtdCounts, ytdCounts, lastActivity] = await Promise.all([
    Lead.findAll({
      where: mtdWhere,
      attributes: [
        "ownerId",
        [fn("COUNT", col("id")), "leadCount"],
        [fn("COUNT", literal("CASE WHEN status = 'converted' THEN 1 END")), "convertedCount"],
      ],
      group: ["ownerId"],
      raw: true,
    }),
    Lead.findAll({
      where: ytdWhere,
      attributes: [
        "ownerId",
        [fn("COUNT", col("id")), "leadCount"],
        [fn("COUNT", literal("CASE WHEN status = 'converted' THEN 1 END")), "convertedCount"],
      ],
      group: ["ownerId"],
      raw: true,
    }),
    Lead.findAll({
      attributes: ["ownerId", [fn("MAX", col("createdAt")), "lastActivity"]],
      where: { deletedAt: null },
      group: ["ownerId"],
      raw: true,
    }),
  ]);

  const toMap = (rows) => new Map(rows.map((r) => [r.ownerId, r]));
  const mtdMap = toMap(mtdCounts);
  const ytdMap = toMap(ytdCounts);
  const lastActivityMap = toMap(lastActivity);

  return employees.map((employee) => ({
    ...employee,
    leadsMtd: Number(mtdMap.get(employee.id)?.leadCount || 0),
    leadsYtd: Number(ytdMap.get(employee.id)?.leadCount || 0),
    convertedMtd: Number(mtdMap.get(employee.id)?.convertedCount || 0),
    convertedYtd: Number(ytdMap.get(employee.id)?.convertedCount || 0),
    lastActivity: lastActivityMap.get(employee.id)?.lastActivity || null,
  }));
};

const getAreaPerformance = async (filters) => {
  const where = buildWhere(filters);
  return Lead.findAll({
    where,
    attributes: [
      [areaNormalizedExpr(), "areaNormalized"],
      [fn("MAX", col("area")), "area"],
      [fn("COUNT", col("id")), "leadCount"],
      [fn("COUNT", literal("CASE WHEN status = 'converted' THEN 1 END")), "convertedCount"],
      [fn("COUNT", fn("DISTINCT", col("ownerId"))), "activeReps"],
    ],
    group: [areaNormalizedExpr()],
    order: [[literal("\"leadCount\""), "DESC"]],
    raw: true,
  });
};

module.exports = {
  getTotals,
  getStatusBreakdown,
  getChanceBreakdown,
  getMonthlyTrends,
  getEmployeePerformance,
  getAreaPerformance,
};
