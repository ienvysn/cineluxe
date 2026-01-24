const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const authorizeAdmin = require("../middleware/adminMiddleware");
const {
  createShowtime,
  createRecurringShowtimes,
  getAllShowtimes,
  getShowtimeById,
  getShowtimesByMovie,
  getShowtimesByDate,
  updateShowtime,
  deleteShowtime,
  deleteMultipleShowtimes,
} = require("../controllers/showtimeController");

router.post("/", authenticate, authorizeAdmin, createShowtime);
router.post("/recurring", authenticate, authorizeAdmin, createRecurringShowtimes);

router.get("/", getAllShowtimes);
router.get("/:id", getShowtimeById);
router.get("/movie/:movieId", getShowtimesByMovie);
router.get("/date/:date", getShowtimesByDate);

router.put("/:id", authenticate, authorizeAdmin, updateShowtime);

router.delete("/:id", authenticate, authorizeAdmin, deleteShowtime);
router.delete("/bulk/delete", authenticate, authorizeAdmin, deleteMultipleShowtimes);

module.exports = router;
