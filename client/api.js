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
    console.error("API Error:", error.message);

    if (error.response && error.response.data && error.response.data.error) {
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


export const showtimeApi = {
  getAll: (filters) => apiCall("GET", "/showtimes", { params: filters }),
  getById: (id) => apiCall("GET", `/showtimes/${id}`),
  getByMovie: (movieId, date) => apiCall("GET", `/showtimes/movie/${movieId}`, { params: { date } }),
  getByDate: (date) => apiCall("GET", `/showtimes/date/${date}`),
  create: (data) => apiCall("POST", "/showtimes", { data }),
  createRecurring: (data) => apiCall("POST", "/showtimes/recurring", { data }),
  update: (id, data) => apiCall("PUT", `/showtimes/${id}`, { data }),
  delete: (id) => apiCall("DELETE", `/showtimes/${id}`),
  deleteMultiple: (ids) => apiCall("DELETE", "/showtimes/bulk/delete", { data: { ids } }),
};


export const movieApi = {
  getAll: () => apiCall("GET", "/movies"),
  getById: (id) => apiCall("GET", `/movies/${id}`),
};

export const screenApi = {
  getAll: () => apiCall("GET", "/screens"),
  getById: (id) => apiCall("GET", `/screens/${id}`),
};

