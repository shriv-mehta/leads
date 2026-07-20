const { fn, col, where: sequelizeWhere } = require("sequelize");

const normalizeArea = (area) => area.trim().toLowerCase().replace(/\s+/g, " ");

// SQL-side equivalent of normalizeArea(), for matching/grouping directly on
// the "area" column without a persisted normalized copy of it.
const areaNormalizedExpr = () => fn("lower", fn("trim", col("area")));

const whereAreaNormalized = (value) => sequelizeWhere(areaNormalizedExpr(), value);

module.exports = { normalizeArea, areaNormalizedExpr, whereAreaNormalized };
