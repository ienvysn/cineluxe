import { apiCall } from "../../api";

export const dashboardService = {
  getStats: () => apiCall("GET", "/dashboard"),
};
