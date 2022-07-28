// Importing npm modules
const express = require("express");

// Router
const router = express.Router();

// Importing auth controller
const { registerUser, loginUser } = require("../controllers/authController");

// POST api/auth/register
router.post("/register", registerUser);

// POST api/auth/login
router.post("/login", loginUser);

module.exports = router;
