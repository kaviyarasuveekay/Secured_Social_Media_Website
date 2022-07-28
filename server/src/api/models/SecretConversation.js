const mongoose = require("mongoose");

const SecretConversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SecretConversation", SecretConversationSchema);
