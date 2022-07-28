// Importing npm modules
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Importing user model
const User = require("../models/User");

// Function to register user
const registerUser = async (req, res) => {
  const { username, email, password, gender } = req.body;

  try {
    // Generating new hashed password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Creating new user
    const newUser = await new User({
      username,
      email,
      password: hashedPassword,
      gender
    });

    // Save user to mongoDB
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    // Duplicate username error
    if (err.code == 11000) {
      res.status(400).json({ error: "Username already present" });
      return;
    }

    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
};

// Function to login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if email is present
    const user = await User.findOne({ email: email });

    // If no user with given email is present
    if (!user) {
      res.status(400).json({ message: "Invalid email* / password" });
      return;
    }

    // Comparing password with stored hashed password
    const passCheck = await bcrypt.compare(password, user.password);

    // If wrong password
    if (!passCheck) {
      res.status(400).json({ message: "Invalid email / password*" });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;

    const token = jwt.sign(
      { _id: user._id, username: user.username, email: user.email },
      jwtSecret,
      { expiresIn: "1d" }
    );

    // res.status(200).json(token);
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { registerUser, loginUser };
