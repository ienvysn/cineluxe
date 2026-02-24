const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwtUtils");
const User = require("../models/userModel");
const redisClient = require("../utils/redisClient");
const { sendResetPasswordEmail } = require("../utils/emailService");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    client.setCredentials({ access_token: token });
    const response = await client.request({
      url: "https://www.googleapis.com/oauth2/v3/userinfo",
    });

    const { name, email, sub: googleId } = response.data;

    let user = await User.findOne({ where: { google_id: googleId } });

    if (!user) {
      user = await User.findOne({ where: { email } });
      if (user) {
        user.google_id = googleId;
        await user.save();
      } else {
        user = await User.create({
          fullname: name,
          email,
          google_id: googleId,
          role: "user",
        });
      }
    }

    const jwtToken = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(200).json({
      message: "Google login successful",
      token: jwtToken,
      user: {
        id: user.id,
        fullName: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({
      error: "Google login failed",
      details: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

const signup = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullname: fullName,
      email,
      password_hash,
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user.id,
        fullName: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        fullName: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password_hash"] },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate 6-digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in Redis with 10 min expiry
    await redisClient.set(`reset:${email}`, resetCode, {
      EX: 600,
    });

    await sendResetPasswordEmail(email, resetCode);

    res.status(200).json({ message: "Reset code sent to your email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, code, password } = req.body;

    const storedCode = await redisClient.get(`reset:${email}`);

    if (!storedCode || storedCode !== code) {
      return res.status(400).json({ error: "Invalid or expired reset code" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    user.password_hash = password_hash;
    await user.save();

    // Delete code from Redis after successful reset
    await redisClient.del(`reset:${email}`);

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { signup, login, getProfile, googleLogin, forgotPassword, resetPassword };
