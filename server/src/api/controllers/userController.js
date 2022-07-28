// Importing user model
const User = require("../models/User");

// Function to get a user
const getUser = async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;

  try {
    // Find user by id
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });

    // If no user found
    if (user == null) {
      res.status(403).json({ error: "No such user found !" });
      return;
    }

    // Removing unwanted information
    const { password, createdAt, __v, updatedAt, ...updatedUser } = user._doc;
    console.log(updatedUser);

    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
};

// Function to get a user
const getSearch = async (req, res) => {
  const username = req.params.username;

  try {
    // Find user by id
    const users = await User.find({ username: { $regex: '.*' + username + '.*' } });

    let userList = [];

    users.map((user) => {
      const { _id, username, profilePicture } = user;
      userList.push({ _id, username, profilePicture });
    });

    res.status(200).json(userList);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
};

// Function to get friends
const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );

    let friendList = [];

    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Function to update user
const updateUser = async (req, res) => {
  // Check if user is authenticated user
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    // If password is updated
    if (req.body.password) {
      try {
        // Generating new hashed password
        req.body.password = await bcrypt.hash(req.body.password, 12);
      } catch (err) {
        res.status(500).json({ error: "Server Error" });
        return;
      }
    }

    try {
      // Updating user
      const user = await User.findByIdAndUpdate(req.body.userId, {
        $set: req.body,
      });

      // If no user found
      if (user == null) {
        res.status(400).json({
          error: "Unauthorized Actions! You can update only your account.",
        });
      }

      console.log(user);
      res.status(200).json("User updated successfully");
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Server Error" });
      return;
    }
  } else {
    res.status(403).json({
      error: "Unauthorized Actions! You can update only your account.",
    });
  }
};

// Function to delete user
const deleteUser = async (req, res) => {
  // Check if user is authenticated user
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      // Deleting user
      const user = await User.findByIdAndDelete(req.body.userId);

      // If no user found
      if (user == null) {
        res.status(400).json({
          error: "Unauthorized Actions! You can delete only your account.",
        });
      }
      res.status(200).json("User deleted successfully");
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Server Error" });
      return;
    }
  } else {
    res.status(403).json({
      error: "Unauthorized Actions! You can delete only your account.",
    });
  }
};

module.exports = { getUser, getFriends, updateUser, deleteUser, getSearch };
