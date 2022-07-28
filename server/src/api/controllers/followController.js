// Importing user model
const User = require("../models/User");

// Function to follow user
const followUser = async (req, res) => {
  // Check if user id's is same
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);

      // If no user found
      if (user == null) {
        res.status(403).json({ error: "No such user found !" });
        return;
      }

      const currentUser = await User.findById(req.body.userId);

      if (!user.followers.includes(req.body.userId)) {
        // Adding currentUser into followers of user
        await user.updateOne({ $push: { followers: req.body.userId } });

        // Adding user into followings of currentUser
        await currentUser.updateOne({ $push: { followings: req.params.id } });

        res.status(200).json("User has been followed successfully");
      } else {
        res.status(403).json({
          error: "Unauthorized Actions! You already follow this user.",
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Server Error" });
    }
  } else {
    res.status(403).json({
      error: "Unauthorized Actions! You cant follow / unfollow yourself.",
    });
  }
};

// Function to unfollow user
const unfollowUser = async (req, res) => {
  // Check if user id's is same
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);

      // If no user found
      if (user == null) {
        res.status(403).json({ error: "No such user found !" });
        return;
      }

      const currentUser = await User.findById(req.body.userId);

      if (user.followers.includes(req.body.userId)) {
        // Removing currentUser from followers of user
        await user.updateOne({ $pull: { followers: req.body.userId } });

        // Removing user from followings of currentUser
        await currentUser.updateOne({ $pull: { followings: req.params.id } });

        res.status(200).json("User has been unfollowed successfully");
      } else {
        res.status(403).json({
          error: "Unauthorized Actions! You don't follow this user.",
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Server Error" });
    }
  } else {
    res.status(403).json({
      error: "Unauthorized Actions! You cant follow / unfollow yourself.",
    });
  }
};

module.exports = { followUser, unfollowUser };
