import apiService from "../apiService";
import { toQueryString } from "../../utils/queryParams";

export const getLeads = (params) => apiService.get(`leads?${toQueryString(params)}`);
export const getLeadById = (id) => apiService.get(`leads/${id}`);
export const createLead = (payload) => apiService.post("leads", payload);
export const updateLead = (id, payload) => apiService.patch(`leads/${id}`, payload);
export const deleteLead = (id) => apiService.delete(`leads/${id}`);

export const getLeadMap = (params) => apiService.get(`leads/map?${toQueryString(params)}`);
export const downloadLeadsCsv = (params) => apiService.getBlob(`leads/export?${toQueryString(params)}`);

export const getActivities = (leadId) => apiService.get(`leads/${leadId}/activities`);
export const addActivity = (leadId, payload) =>
  apiService.post(`leads/${leadId}/activities`, payload);
