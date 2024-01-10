const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res
      .status(400)
      .json({ message: "Invalid Data passed to the Request" });
  }

  var newMessage = {
    sender: req.user.userId,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });

    res.status(200).json(message);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getChatMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const chatMessages = await Message.find({ chat: chatId })
      .populate("sender", "name email pic")
      .populate("chat");
      if (!chatMessages) {
        return res.status(400).json({ message: "Chat Messages Not Found" });
      }
      res.status(200).json(chatMessages);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  sendMessage,
  getChatMessages,
};
