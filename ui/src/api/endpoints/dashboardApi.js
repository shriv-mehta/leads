import apiService from "../apiService";
import { toQueryString } from "../../utils/queryParams";

export const getKpis = (params) => apiService.get(`dashboard/kpis?${toQueryString(params)}`);
export const getTrends = (params) => apiService.get(`dashboard/trends?${toQueryString(params)}`);
export const getEmployeePerformance = (params) =>
  apiService.get(`dashboard/employees?${toQueryString(params)}`);
export const getAreaPerformance = (params) =>
  apiService.get(`dashboard/areas?${toQueryString(params)}`);
