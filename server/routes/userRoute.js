const express = require("express");
const { signup, login, getProfile, googleLogin } = require("../controllers/userController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.get("/profile", authenticate, getProfile);

module.exports = router;
