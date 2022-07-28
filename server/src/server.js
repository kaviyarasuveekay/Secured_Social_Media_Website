// Importing npm modules
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const path = require("path");
const multer = require("multer");

// Express app instance
const app = express();

// Fetching environmental variables
dotenv.config();
const port = process.env.SERVER_PORT;
const mongoUri = process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET;

// Importing config files
const { initDB } = require("./config/database");

// Importing routers
const authRouter = require("./api/routes/auth");
const userRouter = require("./api/routes/users");
const postRouter = require("./api/routes/posts");
const messageRouter = require("./api/routes/messages");
const secretMessageRouter = require("./api/routes/secretMessages");
const conversationRouter = require("./api/routes/conversations");
const secretConversationRouter = require("./api/routes/secretConversations");

/*
		MOUNTING MIDDLEWARES FUNCTIONS
		TO EXPRESS APP INSTANCE
*/

// For recognizing incoming request object as JSON
app.use(express.json());

// Disabling X-powered-by for security reasons
app.disable("x-powered-by");

// Enabling CORS
// app.use(cors());

app.options("*", cors());
// MongoDB Connection
initDB();

/*
HANDLING ROUTES
*/

app.use("/images", express.static(path.join(__dirname, "../public/images")));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/message", messageRouter);
app.use("/api/secretMessage", secretMessageRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/secretConversation", secretConversationRouter);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/posts/");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload/", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploaded successfully");
  } catch (error) {
    console.error(error);
  }
});

//Serving and listening at port
app.listen(port, () => {
  console.log(`Backend server running at localhost:${port}`);
});
