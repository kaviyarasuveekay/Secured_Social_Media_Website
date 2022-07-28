// Importing npm modules
const express = require("express");

// Importing message controller
const {
  createMessage,
  deleteMessage,
  getMessage,
} = require("../controllers/secretMessageController");

// Router
const router = express.Router();

// Create a message
router.post("/", createMessage);

// Delete a message
router.delete("/:messageId", deleteMessage);

// Get a message
router.get("/:conversationId", getMessage);

module.exports = router;
