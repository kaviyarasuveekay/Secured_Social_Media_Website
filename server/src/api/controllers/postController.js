// Importing models
const Post = require("../models/Post");
const User = require("../models/User");

// Function to create a post
const createPost = async (req, res) => {
  const { userId, desc, img } = req.body;

  try {
    // Creating new post
    const newPost = await new Post({ userId, desc, img });

    // Save post to mongoDB
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
};

// Function to get a Post
const getPost = async (req, res) => {
  try {
    // Get post from the id
    const post = await Post.findById(req.params.id);

    // If post not found
    if (post == null) {
      res.status(403).json({ error: "No such post exists !" });
      return;
    }

    // Removing unwanted information
    const { createdAt, __v, updatedAt, ...updatedPost } = post._doc;

    res.status(200).json(updatedPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
};

// Function to update a post
const updatePost = async (req, res) => {
  try {
    // Get post using the id
    const post = await Post.findById(req.params.id);

    // If post not found
    if (post == null) {
      res.status(403).json({ error: "No such post exists !" });
      return;
    }

    if (post.userId === req.body.userId) {
      // Updating post
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post updated successfully");
    } else {
      res.status(403).json({
        error: "Unauthorized Actions! You can update only your post.",
      });
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
};

// Function to delete a post
const deletePost = async (req, res) => {
  try {
    // Get post using the id
    const post = await Post.findById(req.params.id);

    // If post not found
    if (post == null) {
      res.status(403).json({ error: "No such post exists !" });
      return;
    }

    if (post.userId === req.body.userId) {
      // Updating post
      await post.deleteOne();
      res.status(200).json("Post deleted successfully");
    } else {
      res.status(403).json({
        error: "Unauthorized Actions! You can delete only your post.",
      });
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
};

// Function to like or dislike a post
const likeDislikePost = async (req, res) => {
  try {
    // Get post from the id
    const post = await Post.findById(req.params.id);

    // If post not found
    if (post == null) {
      res.status(403).json({ error: "No such post exists !" });
      return;
    }

    if (!post.likes.includes(req.body.userId)) {
      // Adding user into likes array of post
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("Post has been liked");
      return;
    } else {
      // Removing user from likes array of post
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("Post has been disliked");
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
};

// Function to get all user's posts
const getUserAllPosts = async (req, res) => {
  try {
    // Find current user
    const currentUser = await User.findOne({ username: req.params.username });

    // Getting all current user posts
    const userPosts = await Post.find({ userId: currentUser._id });

    res.status(200).json(userPosts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
};

// Function to get all timeline posts
const getTimelinePosts = async (req, res) => {
  try {
    // Find current user
    const currentUser = await User.findById(req.params.userId);

    // Getting all current user posts
    const userPosts = await Post.find({ userId: currentUser._id });

    // Finding all posts of friends
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );

    // Concatenating all posts
    const allPosts = userPosts.concat(...friendPosts);

    res.status(200).json(allPosts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  createPost,
  getPost,
  updatePost,
  deletePost,
  likeDislikePost,
  getUserAllPosts,
  getTimelinePosts,
};
