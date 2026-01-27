const express = require("express");
const router = express.Router();
const { getPricing, updatePricing } = require("../controllers/pricingController");
const authenticate = require("../middleware/authMiddleware");
const authorizeAdmin = require("../middleware/adminMiddleware");

router.get("/", getPricing);
router.put("/", authenticate, authorizeAdmin, updatePricing);

module.exports = router;
