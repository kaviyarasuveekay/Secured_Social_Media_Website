// Importing npm modules
const express = require("express");

// Router
const router = express.Router();

// Importing models
const User = require("../models/User");
const Post = require("../models/Post");

// Importing post controllers
const {
  createPost,
  getPost,
  updatePost,
  deletePost,
  likeDislikePost,
  getTimelinePosts,
  getUserAllPosts,
} = require("../controllers/postController");

// Create a post
router.post("/", createPost);

// Get a post
router.get("/:id", getPost);

// Update a post
router.put("/:id", updatePost);

// Delete a post
router.delete("/:id", deletePost);

// Like / Dislike a post
router.put("/:id/like", likeDislikePost);

// Get all user's posts
router.get("/user/:username", getUserAllPosts);

// Get timeline posts
router.get("/timeline/:userId", getTimelinePosts);

module.exports = router;
