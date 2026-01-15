const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const authorizeAdmin = require("../middleware/adminMiddleware");
const {
  createScreen,
  getAllScreens,
  getScreenById,
  updateScreen,
  deleteScreen,
} = require("../controllers/screenController");

const router = express.Router();

router.get("/", getAllScreens);
router.get("/:id", getScreenById);
router.post("/", authenticate, authorizeAdmin, createScreen);
router.put("/:id", authenticate, authorizeAdmin, updateScreen);
router.delete("/:id", authenticate, authorizeAdmin, deleteScreen);

module.exports = router;
