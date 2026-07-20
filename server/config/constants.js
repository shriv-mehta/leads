const ROLES = Object.freeze({
  ADMIN: "admin",
  EMPLOYEE: "employee",
});

const BUSINESS_CHANCE = Object.freeze({
  HOT: "hot",
  WARM: "warm",
  COLD: "cold",
});

const LEAD_STATUS = Object.freeze({
  NEW: "new",
  IN_PROGRESS: "in_progress",
  CONVERTED: "converted",
  LOST: "lost",
});

const DEFAULT_PAGE_SIZE = 25;
const MAX_EXPORT_ROWS = 5000;

module.exports = {
  ROLES,
  BUSINESS_CHANCE,
  LEAD_STATUS,
  DEFAULT_PAGE_SIZE,
  MAX_EXPORT_ROWS,
};
