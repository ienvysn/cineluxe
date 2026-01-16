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

const upload = require("../middleware/multerConfig");

const router = express.Router();

router.get("/upcoming", getUpcomingMovies);
router.get("/now-showing", getNowShowingMovies);

router.get("/", getAllMovies);
router.get("/:id", getMovieById);
router.post("/", authenticate, authorizeAdmin, upload.single("posterFile"), createMovie);
router.put("/:id", authenticate, authorizeAdmin, upload.single("posterFile"), updateMovie);
router.delete("/:id", authenticate, authorizeAdmin, deleteMovie);

module.exports = router;
