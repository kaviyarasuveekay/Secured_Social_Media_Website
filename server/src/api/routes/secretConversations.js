// Importing npm modules
const express = require("express");

// Importing conversation controller
const {
  createConversation,
  getConversation,
  getConversationUsingUser,
  getConversationWithIds,
} = require("../controllers/secretConversationController");

// Router
const router = express.Router();

// Create a conversation
router.post("/", createConversation);

// Get a conversation
router.get("/convo/:conversationId", getConversation);

// Get conversations of particular user
router.get("/:userId", getConversationUsingUser);

// Get conversation between 2 users
router.get("/:firstId/:secondId", getConversationWithIds);

module.exports = router;
