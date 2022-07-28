const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    groupAdmin: {
      type: String,
      default: "",
    },
    groupName: {
      type: String,
      default: "",
    },
    groupPicture: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
