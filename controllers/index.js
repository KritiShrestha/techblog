// Required dependencies
const express = require("express");
const router = express.Router();

// Import individual controller files
const authController = require("./authController");
const blogController = require("./blogController");

// Set up routes
router.use("/auth", authController);
router.use("/", blogController);

module.exports = router;
