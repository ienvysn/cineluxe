const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const authorizeAdmin = require("../middleware/adminMiddleware");
const {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
  getUpcomingMovies,
  getNowShowingMovies,
} = require("../controllers/movieController");

const router = express.Router();

router.get("/upcoming", getUpcomingMovies);
router.get("/now-showing", getNowShowingMovies);

router.get("/", getAllMovies);
router.get("/:id", getMovieById);
router.post("/", authenticate, authorizeAdmin, createMovie);
router.put("/:id", authenticate, authorizeAdmin, updateMovie);
router.delete("/:id", authenticate, authorizeAdmin, deleteMovie);

module.exports = router;
