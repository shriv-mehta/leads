import apiService from "../apiService";

export const login = (payload) => apiService.post("auth/login", payload);
export const refresh = (refreshToken) => apiService.post("auth/refresh", { refreshToken });
export const logout = () => apiService.post("auth/logout");
export const getMe = () => apiService.get("auth/me");
