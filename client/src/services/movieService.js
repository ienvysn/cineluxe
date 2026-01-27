import { apiCall } from "../../api";

export const movieService = {
  getAllMovies: async () => {
    try {
      return await apiCall("GET", "/movies");
    } catch (error) {
      console.error("Error fetching movies:", error.message);
      throw error;
    }
  },

  getMovieById: async (movieId) => {
    try {
      return await apiCall("GET", `/movies/${movieId}`);
    } catch (error) {
      console.error(`Error fetching movie ${movieId}:`, error.message);
      throw error;
    }
  },

  addMovie: async (movieData, token) => {
    try {
      const isFormData = movieData instanceof FormData;
      return await apiCall("POST", "/movies", {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(isFormData ? { "Content-Type": "multipart/form-data" } : {}),
        },
        data: movieData,
      });
    } catch (error) {
      console.error("Error adding movie:", error.message);
      throw error;
    }
  },

  updateMovie: async (movieId, movieData, token) => {
    try {
      const isFormData = movieData instanceof FormData;
      return await apiCall("PUT", `/movies/${movieId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(isFormData ? { "Content-Type": "multipart/form-data" } : {}),
        },
        data: movieData,
      });
    } catch (error) {
      console.error("Error updating movie:", error.message);
      throw error;
    }
  },

  deleteMovie: async (movieId, token) => {
    try {
      return await apiCall("DELETE", `/movies/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error deleting movie:", error.message);
      throw error;
    }
  },

  getUpcomingMovies: async () => {
    try {
      return await apiCall("GET", "/movies/upcoming");
    } catch (error) {
      console.error("Error fetching upcoming movies:", error.message);
      throw error;
    }
  },
};
