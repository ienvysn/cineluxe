import { apiCall } from "../../api";

export const showtimeService = {
  getAll: (filters) => apiCall("GET", "/showtimes", { params: filters }),
  getById: (id) => apiCall("GET", `/showtimes/${id}`),
  getByMovie: (movieId, date) =>
    apiCall("GET", `/showtimes/movie/${movieId}`, { params: { date } }),
  getByDate: (date) => apiCall("GET", `/showtimes/date/${date}`),
  create: (data) => apiCall("POST", "/showtimes", { data }),
  createRecurring: (data) => apiCall("POST", "/showtimes/recurring", { data }),
  update: (id, data) => apiCall("PUT", `/showtimes/${id}`, { data }),
  delete: (id) => apiCall("DELETE", `/showtimes/${id}`),
  deleteMultiple: (ids) =>
    apiCall("DELETE", "/showtimes/bulk/delete", { data: { ids } }),
};
