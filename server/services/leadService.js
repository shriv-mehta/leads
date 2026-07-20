const AppError = require("../utils/AppError");
const leadRepository = require("../repositories/leadRepository");
const leadActivityRepository = require("../repositories/leadActivityRepository");
const geocodeService = require("./geocodeService");
const { normalizeArea } = require("../utils/area");
const { toCsv } = require("../utils/csv");
const { DEFAULT_PAGE_SIZE, MAX_EXPORT_ROWS, LEAD_STATUS, ROLES } = require("../config/constants");

const isOwner = (lead, requestingUser) =>
  requestingUser.role === ROLES.ADMIN || lead.ownerId === requestingUser.id;

const assertAccess = (lead, requestingUser) => {
  if (!lead || !isOwner(lead, requestingUser)) {
    throw new AppError("Lead not found", 404);
  }
};

const buildDuplicateWarning = async ({ phone, email }, excludeId, requestingUser) => {
  const duplicate = await leadRepository.findDuplicate({ phone, email, excludeId });
  if (!duplicate) return null;

  const canLink = requestingUser.role === ROLES.ADMIN || duplicate.ownerId === requestingUser.id;

  return {
    leadId: canLink ? duplicate.id : undefined,
    contactName: duplicate.contactName,
    companyName: duplicate.companyName,
    ownerName: duplicate.owner?.name,
    metOn: duplicate.metOn,
  };
};

const createLead = async (requestingUser, payload) => {
  const area = payload.area.trim();
  const geo = await geocodeService.geocodeArea(area);

  const duplicateWarning = await buildDuplicateWarning(payload, null, requestingUser);

  const lead = await leadRepository.create({
    ...payload,
    area,
    ownerId: requestingUser.id,
    areaLat: geo?.lat ?? null,
    areaLng: geo?.lng ?? null,
  });

  return { lead: await leadRepository.findById(lead.id), duplicateWarning };
};

const getLead = async (requestingUser, id) => {
  const lead = await leadRepository.findById(id);
  assertAccess(lead, requestingUser);
  return lead;
};

const updateLead = async (requestingUser, id, updates) => {
  const existing = await leadRepository.findById(id);
  assertAccess(existing, requestingUser);

  const patch = { ...updates };

  if (updates.area && updates.area.trim() !== existing.area) {
    const geo = await geocodeService.geocodeArea(updates.area);
    patch.areaLat = geo?.lat ?? null;
    patch.areaLng = geo?.lng ?? null;
  }

  if (updates.status && updates.status !== existing.status) {
    patch.convertedAt = updates.status === LEAD_STATUS.CONVERTED ? new Date() : null;
  }

  const updated = await leadRepository.update(id, patch);

  const duplicateWarning = await buildDuplicateWarning(
    { phone: updates.phone ?? existing.phone, email: updates.email ?? existing.email },
    id,
    requestingUser
  );

  return { lead: await leadRepository.findById(updated.id), duplicateWarning };
};

const deleteLead = async (id) => {
  const deleted = await leadRepository.softDelete(id);
  if (!deleted) throw new AppError("Lead not found", 404);
};

const scopedFilters = (requestingUser, query) => {
  const filters = {
    status: query.status,
    chance: query.chance,
    q: query.q,
    from: query.from ? new Date(query.from) : undefined,
    to: query.to ? new Date(query.to) : undefined,
  };

  if (query.area) filters.areaNormalized = normalizeArea(query.area);

  if (requestingUser.role === ROLES.EMPLOYEE) {
    filters.ownerId = requestingUser.id;
  } else if (query.owner_id) {
    filters.ownerId = query.owner_id;
  }

  return filters;
};

const listLeads = async (requestingUser, query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || DEFAULT_PAGE_SIZE;

  const filters = scopedFilters(requestingUser, query);
  const { rows, count } = await leadRepository.list(filters, { page, limit });

  return {
    data: rows,
    pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
  };
};

const getMapGroups = async (requestingUser, query) => {
  const filters = scopedFilters(requestingUser, query);
  return leadRepository.groupByArea(filters);
};

const getAreaSuggestions = async () => leadRepository.distinctAreas();

const getLastAreaForRep = async (requestingUser) =>
  leadRepository.findLastAreaForOwner(requestingUser.id);

const addActivity = async (requestingUser, leadId, { note, activityDate }) => {
  const lead = await leadRepository.findById(leadId);
  assertAccess(lead, requestingUser);

  return leadActivityRepository.create({
    leadId,
    userId: requestingUser.id,
    note,
    activityDate,
  });
};

const listActivities = async (requestingUser, leadId) => {
  const lead = await leadRepository.findById(leadId);
  assertAccess(lead, requestingUser);
  return leadActivityRepository.listForLead(leadId);
};

const exportCsv = async (requestingUser, query) => {
  const filters = scopedFilters(requestingUser, query);
  const rows = (await leadRepository.findAllForExport(filters)).slice(0, MAX_EXPORT_ROWS);

  return toCsv(rows, [
    { label: "Contact Name", value: (r) => r.contactName },
    { label: "Company", value: (r) => r.companyName },
    { label: "Designation", value: (r) => r.designation },
    { label: "Email", value: (r) => r.email },
    { label: "Phone", value: (r) => r.phone },
    { label: "Met On", value: (r) => r.metOn },
    { label: "Business Chance", value: (r) => r.businessChance },
    { label: "Status", value: (r) => r.status },
    { label: "Area", value: (r) => r.area },
    { label: "Owner", value: (r) => r.owner?.name },
    { label: "Next Follow-up", value: (r) => r.nextFollowupOn },
    { label: "Created At", value: (r) => r.createdAt?.toISOString() },
  ]);
};

module.exports = {
  createLead,
  getLead,
  updateLead,
  deleteLead,
  listLeads,
  getMapGroups,
  getAreaSuggestions,
  getLastAreaForRep,
  addActivity,
  listActivities,
  exportCsv,
};
