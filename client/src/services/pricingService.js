import { apiCall } from "../../api";

export const pricingService = {
  getPricing: async () => {
    try {
      return await apiCall("GET", "/pricing");
    } catch (error) {
      console.error("Error fetching pricing:", error.message);
      throw error;
    }
  },

  updatePricing: async (pricingData) => {
    try {
      return await apiCall("PUT", "/pricing", {
        data: pricingData,
      });
    } catch (error) {
      console.error("Error updating pricing:", error.message);
      throw error;
    }
  },
};
