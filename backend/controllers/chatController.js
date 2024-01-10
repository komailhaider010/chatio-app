const { model } = require('mongoose');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const { loginUser } = require('./userController');

// const createChat = async(req, res)=>{
//     const currentUserId = req.user.userId;
//     const {userId} = req.body
    
//     var isChat = await Chat.find({
//         isGroupChat: false,
//         $and: [
//             {users: { $elemMatch: {$eq: currentUserId} } },
//             {users: { $elemMatch: {$eq: userId} } },
//         ],
//     }).populate("users", '-password').populate("latestMessage");

//     isChat = Chat.populate(isChat, {
//         path: 'latestMessage.sender',
//         select: "name pic email",
//     });

//     if (isChat.length > 0 ) {
//         return res.status(200).json(isChat[0]);
//     } else{
//         var chatData = {
//             chatName: "sender",
//             isGroupChat: false,
//             users: [currentUserId, userId],
//         }

//         try {
//             const createChat = await Chat.create(chatData);

//             const fullChat = await Chat.findOne({_id: createChat._id}).populate("users", '-password');
            
//             res.status(200).send(fullChat);
//         } catch (error) {
//             res.status(400).json(error.message);
//             console.log(error);

//         }
//     }

//  }

const createChat = async (req, res) => {
    const currentUserId = req.user.userId;
    const { userId } = req.body;
  
    try {
      // Check if a chat exists between the two users
      const existingChat = await Chat.findOne({
        isGroupChat: false,
        users: { $all: [currentUserId, userId] },
      }).populate('users', '-password').populate('latestMessage');
  
      if (existingChat) {
        const populatedChat = await User.populate(existingChat, {
          path: 'latestMessage.sender',
          select: 'name pic email',
        });
        return res.status(200).json(populatedChat);
      } else {
        // Create a new chat if it doesn't exist
        const chatData = {
          chatName: 'sender',
          isGroupChat: false,
          users: [currentUserId, userId],
        };
  
        const createdChat = await Chat.create(chatData);
  
        const fullChat = await Chat.findOne({ _id: createdChat._id }).populate('users', '-password');
  
        return res.status(200).json(fullChat);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }



  const getChat = async (req, res) => {
    const currentUserId = req.user.userId;
    try {
        const chatData = await Chat.find({ users: currentUserId })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage").sort({updatedAt: -1});

        const populatedChat = await Chat.populate(chatData, {
            path: 'latestMessage.sender',
            select: 'name pic email',
          });
        res.status(200).json(populatedChat);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
//  const createGroupChat = async(req, res)=>{
//     if (!req.body.users || !req.body.name) {
//         return res.status(400).send({message: "Please Enter All the Fields"});
//     }
//     const users = JSON.parse(req.body.users);

//     if(users.length < 2){
//         return res.status(400).json({message: "More then 2 Users Required for Creating Group Chat"});
//     }

//     stringUserId = currentUserId.toString()
//     // Adding Current User Also to the Group
//     users.push(stringUserId);

//     try {
//         const groupChat = await Chat.create({
//             chatName: req.body.name,
//             users: users,
//             isGroupChat: true,
//             groupAdmin: currentUserId,
//         });

//         const fullGroupChat = await Chat.findOne({_id: groupChat._id})
//         .populate("users", "-password")
//         .populate("groupAdmin", "-password");

//         res.status(200).json(fullGroupChat);

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }

//  }
const createGroupChat = async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).json({ message: 'Please Enter All the Fields' });
    }

    try {
        const users = req.body.users || [];

        if (users.length < 2) {
            return res.status(400).json({ message: 'More than 2 Users Required for Creating Group Chat' });
        }

        // Adding Current User Also to the Group
        users.push(req.user.userId);

        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user.userId,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate('users', '-password')
            .populate('groupAdmin', '-password');

        res.status(200).json(fullGroupChat);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
 const updateGroupName = async(req, res)=>{
  const {chatId , newChatName} = req.body;
  try {
    const updatedChat = await Chat.findByIdAndUpdate({_id: chatId}, {chatName: newChatName})

    if (!updatedChat) {
      res.status(400).json("Group Not Found")
    }
    res.status(200).json(updatedChat);
    
  } catch (error) {
    console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
  }

 }
 const removeFromGroup = async(req, res)=>{
  const {chatId , userId} = req.body;
  try {
    const userRemove = await Chat.findByIdAndUpdate({_id: chatId},
       {$pull: {users: userId}},
       {new: true}
       ).populate('users', '-password')
       .populate('groupAdmin', '-password');

    if (!userRemove) {
      res.status(400).json("Group Not Found")
    }
    res.status(200).json( userRemove);
    
  } catch (error) {
    console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
  }

 }
 const addToGroup = async(req, res)=>{
  const {chatId , userId} = req.body;
  try {
    const userAdded = await Chat.findByIdAndUpdate({_id: chatId},
       {$push: {users: userId}},
       {new: true}
       ).populate('users', '-password')
       .populate('groupAdmin', '-password');

    if (!userAdded) {
      res.status(400).json("Group Not Found")
    }
    res.status(200).json(userAdded);
    
  } catch (error) {
    console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
  }
 }
 module.exports = {
    createChat,
    getChat,
    createGroupChat,
    updateGroupName,
    removeFromGroup,
    addToGroup,
 }