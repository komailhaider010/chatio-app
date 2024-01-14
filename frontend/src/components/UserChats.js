import React from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box, Button, Stack, useToast, Text } from "@chakra-ui/react";
import axios from "axios";
import { useEffect } from "react";
import { IoAddOutline } from "react-icons/io5";
import { ChatsLoading } from "./Features/ChatsLoading";
import { getSenderName } from "../config/ChatsLogic";
import { GroupChatModal } from "./Features/GroupChatModal";

export const UserChats = ({fetchAgain}) => {
  const token = localStorage.getItem("token");
  const { user, setselectedChat, selectedChat, chats, setchats } = ChatState();
  const toast = useToast();

  const fetchUserChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      const sortedData = data.sort((a, b) => b.updatedAt - a.updatedAt);
      setchats(sortedData);
    } catch (error) {
      toast({
        title: error.response.data.message,
        discription: "Failed to search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchUserChats();
  }, [fetchAgain]);

  return (
    <>
      <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDirection={"column"}
        alignItems={"center"}
        p={3}
        bg={"white"}
        w={{ base: "100%", md: "31%" }}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Box
          pb={3}
          px={3}
          fontSize={{ base: "20px", md: "25px" }}
          display={"flex"}
          width={"100%"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Text>My Chats</Text>
          <GroupChatModal>
            <Button
              display={"flex"}
              fontSize={{ base: "17px", md: "10px", lg: "17px" }}
              rightIcon={<IoAddOutline />}
            >
              Create Group
            </Button>
          </GroupChatModal>
        </Box>

        <Box
          display={"flex"}
          flexDirection={"column"}
          p={3}
          bg={"#F8F8F8"}
          width={"100%"}
          height={"100%"}
          borderRadius={"lg"}
          overflowY={"hidden"}
        >
          {chats ? (
            <Stack overflowY={"scroll"}>
              {chats.map((chat) => (
                <Box
                  onClick={() => setselectedChat(chat)}
                  cursor={"pointer"}
                  bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius={"lg"}
                  key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat
                      ? getSenderName(user, chat.users)
                      : chat.chatName}
                  </Text>
                </Box>
              ))}
            </Stack>
          ) : (
            <ChatsLoading />
          )}
        </Box>
      </Box>
    </>
  );
};
