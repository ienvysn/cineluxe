const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

const authenticate = require("../middleware/authMiddleware");

router.get("/", authenticate, bookingController.getAllBookings);
router.get("/user", authenticate, bookingController.getUserBookings);
router.get("/:id", authenticate, bookingController.getBookingById);
router.post("/", authenticate, bookingController.createBooking);

module.exports = router;
