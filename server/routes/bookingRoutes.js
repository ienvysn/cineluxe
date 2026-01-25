const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

const authenticate = require("../middleware/authMiddleware");
const authorizeAdmin = require("../middleware/adminMiddleware");

router.post("/validate", authenticate, authorizeAdmin, bookingController.validateTicket);
router.get("/", authenticate, bookingController.getAllBookings);
router.get("/user", authenticate, bookingController.getUserBookings);
router.get("/:id", authenticate, bookingController.getBookingById);
router.post("/", authenticate, bookingController.createBooking);

module.exports = router;
