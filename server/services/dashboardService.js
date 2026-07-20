const dashboardRepository = require("../repositories/dashboardRepository");
const { getMtdRange, getYtdRange, getCustomRange } = require("../utils/dateRange");
const { normalizeArea } = require("../utils/area");

const conversionRatio = (totals) => (totals.total === 0 ? 0 : totals.converted / totals.total);

const baseFilters = (query) => {
  const filters = {
    status: query.status,
    chance: query.chance,
    ownerId: query.employee_id,
  };
  if (query.area) filters.areaNormalized = normalizeArea(query.area);
  return filters;
};

const resolveRange = (query) => {
  if (query.from && query.to) return getCustomRange(query.from, query.to);
  return null;
};

const getKpis = async (query) => {
  const filters = baseFilters(query);
  const customRange = resolveRange(query);

  const mtdFilters = { ...filters, ...(customRange || getMtdRange()) };
  const ytdFilters = { ...filters, ...(customRange || getYtdRange()) };

  const [mtdTotals, ytdTotals, statusBreakdown, chanceBreakdown] = await Promise.all([
    dashboardRepository.getTotals(mtdFilters),
    dashboardRepository.getTotals(ytdFilters),
    dashboardRepository.getStatusBreakdown(ytdFilters),
    dashboardRepository.getChanceBreakdown(ytdFilters),
  ]);

  return {
    totalLeads: { mtd: mtdTotals.total, ytd: ytdTotals.total },
    leadsConverted: { mtd: mtdTotals.converted, ytd: ytdTotals.converted },
    conversionRatio: { mtd: conversionRatio(mtdTotals), ytd: conversionRatio(ytdTotals) },
    statusBreakdown,
    chanceBreakdown,
  };
};

const getTrends = async (query) => {
  const filters = { ...baseFilters(query), ...getYtdRange() };
  const monthly = await dashboardRepository.getMonthlyTrends(filters);

  return monthly.map((row) => ({
    month: row.month,
    leadCount: Number(row.leadCount),
    convertedCount: Number(row.convertedCount),
    conversionRatio: row.leadCount > 0 ? Number(row.convertedCount) / Number(row.leadCount) : 0,
  }));
};

const getEmployeePerformance = async (query) => {
  const filters = baseFilters(query);
  const customRange = resolveRange(query);

  const performance = await dashboardRepository.getEmployeePerformance({
    mtdFilters: { ...filters, ...(customRange || getMtdRange()) },
    ytdFilters: { ...filters, ...(customRange || getYtdRange()) },
  });

  return performance.map((row) => ({
    ...row,
    conversionPct:
      row.leadsYtd > 0 ? Number(((row.convertedYtd / row.leadsYtd) * 100).toFixed(1)) : 0,
  }));
};

const getAreaPerformance = async (query) => {
  const filters = { ...baseFilters(query), ...(resolveRange(query) || {}) };
  const areas = await dashboardRepository.getAreaPerformance(filters);

  return areas.map((row) => ({
    area: row.area,
    leadCount: Number(row.leadCount),
    convertedCount: Number(row.convertedCount),
    conversionPct:
      row.leadCount > 0 ? Number(((row.convertedCount / row.leadCount) * 100).toFixed(1)) : 0,
    activeReps: Number(row.activeReps),
  }));
};

module.exports = { getKpis, getTrends, getEmployeePerformance, getAreaPerformance };
