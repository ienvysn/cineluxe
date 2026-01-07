import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export const apiCall = async (method, endpoint, options = {}) => {
  const { data, params, headers } = options;

  try {
    const response = await axios({
      method,
      url: `${BASE_URL}${endpoint}`,
      data,
      params,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });
    return response?.data;
  } catch (error) {
    console.error("API Error:", error);


    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }

    else if (error.response) {
      throw new Error(error.response.statusText || "Something went wrong");
    }

    else if (error.request) {
      throw new Error("Server unreachable. Please check your connection.");
    }

    else {
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
};
