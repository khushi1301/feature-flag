import { request } from "./client";

export const getFlags = () => request("/flags");
export const createFlag = (flag) => request("/flags", { method: "POST", body: flag });
export const updateFlag = (flag) => request(`/flags/${flag.id}`, { method: "PATCH", body: flag });
export const setFlagEnabled = ({ id, env, enabled }) =>
  request(`/flags/${id}/environments/${env}`, { method: "PATCH", body: { enabled } });
export const deleteFlag = (id) => request(`/flags/${id}`, { method: "DELETE" });
export const restoreFlag = (flag) => request("/flags/restore", { method: "POST", body: flag });
export const getAuditLogs = () => request("/audit-logs");
