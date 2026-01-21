const express = require("express");
const router = express.Router();
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

// Create routes
router.post("/", createShowtime);
router.post("/recurring", createRecurringShowtimes);

// Read routes
router.get("/", getAllShowtimes);
router.get("/:id", getShowtimeById);
router.get("/movie/:movieId", getShowtimesByMovie);
router.get("/date/:date", getShowtimesByDate);

// Update route
router.put("/:id", updateShowtime);

// Delete routes
router.delete("/:id", deleteShowtime);
router.delete("/bulk/delete", deleteMultipleShowtimes);

module.exports = router;
