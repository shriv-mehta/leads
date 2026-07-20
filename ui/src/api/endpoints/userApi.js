import apiService from "../apiService";
import { toQueryString } from "../../utils/queryParams";

export const getUsers = (params) => apiService.get(`users?${toQueryString(params)}`);
export const createEmployee = (payload) => apiService.post("users", payload);
export const updateUser = (id, payload) => apiService.patch(`users/${id}`, payload);
