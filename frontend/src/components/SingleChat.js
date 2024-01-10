import React, { useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { IoArrowBackOutline } from "react-icons/io5";
import { getSenderFull, getSenderName } from "../config/ChatsLogic";
import { ProfileModal } from "./Features/ProfileModal";
import { FaRegEye, FaTruckLoading } from "react-icons/fa";
import { UpdateGroupChatModal } from "./Features/UpdateGroupChatModal";
import { useState } from "react";
import axios from "axios";
import ScrolableChat from "./ScrolableChat";
import io from "socket.io-client";
import { Comment } from  'react-loader-spinner'

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

export const SingleChat = ({ fetchAgain, setfetchAgain }) => {
  const toast = useToast();
  const token = localStorage.getItem("token");
  const { user, selectedChat, setselectedChat, notifications, setnotifications} = ChatState();
  const [allmessages, setallmessages] = useState([]);
  const [loading, setloading] = useState(false);
  const [newMessage, setnewMessage] = useState();
  const [socketConnected, setsocketConnected] = useState(false);
  const [typing, settyping] = useState(false);
  const [isTyping, setisTyping] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setsocketConnected(true));
    socket.on("typing", () => setisTyping(true));
    socket.on("stop typing", () => setisTyping(false));
  }, []);

  useEffect(() => {
    socket.on("message recived", (newMessageRecived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecived.chat._id
      ) {
        // notification
        if (!notifications.includes(newMessageRecived)) {
          setnotifications([newMessageRecived, ...notifications]);
          setfetchAgain(!fetchAgain);
        }
      } else {
        setallmessages([...allmessages, newMessageRecived]);
      }
    });

  });

  const fetchChatMessages = async () => {
    if (!selectedChat) return;

    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setallmessages(data);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error);
      toast({
        title: error.response.data.message,
        discription: "Failed to Load Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setloading(false);
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        setnewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        socket.emit("new message", data);
        setallmessages([...allmessages, data]);
      } catch (error) {
        console.log(error);
        toast({
          title: error.response.data.message,
          discription: "Failed to Post Message",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const typingHandler = (e) => {
    setnewMessage(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
      settyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let LastTypingTime = new Date().getTime();
    var timer = 5000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - LastTypingTime;
      if (timeDiff >= timer && typing) {
        socket.emit("stop typing", selectedChat._id);
        settyping(false);
      }
    }, timer);
  };

  useEffect(() => {
    fetchChatMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "25px", md: "28px" }}
            pb={3}
            px={2}
            width={"100%"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<IoArrowBackOutline />}
              onClick={() => setselectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSenderName(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)}>
                  <IconButton display={{ base: "flex" }} icon={<FaRegEye />} />
                </ProfileModal>
              </>
            ) : (
              //   IF Group Chat
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setfetchAgain={setfetchAgain}
                  fetchChatMessages={fetchChatMessages}
                >
                  <IconButton display={{ base: "flex" }} icon={<FaRegEye />} />
                </UpdateGroupChatModal>
              </>
            )}
          </Text>
          <Box
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg={"whitesmoke"}
            width={"100%"}
            height={"100%"}
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            {loading ? (
              <Spinner
                size={"xl"}
                width={20}
                height={20}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <div style={{ height: "100%", overflowY: "auto" }}>
                <ScrolableChat allmessages={allmessages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? (
                <Comment
                  visible={true}
                  height="40"
                  width="45"
                  ariaLabel="comment-loading"
                  wrapperStyle={{}}
                  wrapperClass="comment-wrapper"
                  color="lightblue"
                  backgroundColor="grey"
                />
              ) : (
                <></>
              )}
              <Input
                variant={"fill"}
                bg={"#E0E0E0"}
                placeholder="Enter a Message.."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        // IF Does Not Select Any Chat
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          height={"100%"}
        >
          <Text fontSize={"3xl"} pb={3}>
            Click on User To Start Chat
          </Text>
        </Box>
      )}
    </>
  );
};
