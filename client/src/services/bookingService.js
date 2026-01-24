import { apiCall } from "../../api";

export const bookingService = {
  create: (data, token) =>
    apiCall("POST", "/bookings", {
      data,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),
  getAll: () => apiCall("GET", "/bookings"),
  getById: (id) => apiCall("GET", `/bookings/${id}`),
  getUserBookings: () => apiCall("GET", "/bookings/user"),
};
