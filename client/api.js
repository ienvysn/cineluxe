import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const BASE_URL = `${API_BASE}/api`;

export const apiCall = async (method, endpoint, options = {}) => {
  const { data, params, headers } = options;

  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      data,
      params,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    const token = localStorage.getItem("cineluxe_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios(config);
    return response?.data;
  } catch (error) {
    console.error("API Error:", error.message);

    const skipAuthRedirect = endpoint.includes("/users/login") ||
                             endpoint.includes("/users/signup") ||
                             endpoint.includes("/users/forgot-password") ||
                             endpoint.includes("/bookings/validate");

    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !skipAuthRedirect
    ) {
      localStorage.removeItem("cineluxe_token");
      localStorage.removeItem("cineluxe_user");
      window.location.href = "/auth";
      throw new Error("Session expired. Please login again.");
    } else if (
      error.response &&
      error.response.data &&
      error.response.data.error
    ) {
      throw new Error(error.response.data.error);
    } else if (error.response) {
      throw new Error(error.response.statusText || "Something went wrong");
    } else if (error.request) {
      throw new Error("Server unreachable. Please check your connection.");
    } else {
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
};
