import { apiCall } from "../../api";

export const screenService = {
  getAll: (filters) => apiCall("GET", "/screens"),
  getById: (id) => apiCall("GET", `/screens/${id}`),
  create: (data, token) =>
    apiCall("POST", "/screens", {
      data,
      headers: { Authorization: `Bearer ${token}` },
    }),
  update: (id, data, token) =>
    apiCall("PUT", `/screens/${id}`, {
      data,
      headers: { Authorization: `Bearer ${token}` },
    }),
  delete: (id, token) =>
    apiCall("DELETE", `/screens/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};
