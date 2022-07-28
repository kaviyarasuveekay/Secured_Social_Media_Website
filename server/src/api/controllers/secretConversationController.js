// Importing model
const SecretConversation = require("../models/SecretConversation");

// Function to create a conversation
const createConversation = async (req, res) => {
  const newConversation = new SecretConversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Function to get conversations using user id
const getConversationUsingUser = async (req, res) => {
  try {
    const conversation = await SecretConversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Function to get conversations using conversation id
const getConversation = async (req, res) => {
  try {
    const conversation = await SecretConversation.find({
      _id: { $in: [req.params.conversationId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Function to get conversations using user id
const getConversationWithIds = async (req, res) => {
  try {
    const conversation = await SecretConversation.find({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  createConversation,
  getConversation,
  getConversationWithIds,
  getConversationUsingUser,
};
