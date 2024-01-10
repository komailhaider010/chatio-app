import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Avatar,
  MenuDivider,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { ProfileModal } from "./Features/ProfileModal";
import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { CiBellOn } from "react-icons/ci";
import { ChatState } from "../Context/ChatProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ChatsLoading } from "./Features/ChatsLoading";
import { UserListItem } from "./UserAvatar/UserListItem";
import { getSenderName } from "../config/ChatsLogic";
import NotificationBadge, { Effect } from 'react-notification-badge'

export const SideDrawer = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [search, setsearch] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const [loading, setloading] = useState(false);
  const [loadingChat, setloadingChat] = useState(false);

  const {
    user,
    setuser,
    setselectedChat,
    selectedChat,
    chats,
    setchats,
    notifications,
    setnotifications,
  } = ChatState();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSearch = async () => {
    if (search) {
      try {
        setloading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`/api/user?search=${search}`, config);
        setloading(false);
        setsearchResult(response.data);
      } catch (error) {
        console.log(error);
        toast({
          title: error.response.data.message,
          discription: "Failed to search Results",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
  };

  const accessChat = async (userId) => {
    setloadingChat(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post("/api/chat", { userId }, config);
      if (!chats.find((c) => c._id === data._id)) {
        setchats([data, ...chats]);
      }
      setselectedChat(data);
      setloadingChat(false);
      onClose();
    } catch (error) {
      console.log(error);
      toast({
        title: error.response.data.message,
        discription: "Failed to search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } finally {
      setloadingChat(false);
    }
  };

  console.log(notifications);

  return (
    <>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        bg={"white"}
        w={"100%"}
        borderWidth={"5px"}
        p={"5px 10px 5px 10px"}
      >
        <Tooltip label="Search User" hasArrow placement="bottom-end">
          <Button variant={"ghost"} onClick={onOpen}>
            <CiSearch />
            <Text display={{ base: "none", md: "flex" }} p={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize={"2xl"} fontFamily={"sans-serif"}>
          ChatIo
        </Text>

        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            width: "6rem",
          }}
        >
          <Menu>
            <MenuButton>
              <NotificationBadge
              count={notifications.length}
              effect={Effect.SCALE}
              />
              <CiBellOn fontSize={"1.5rem"} />
            </MenuButton>
            <MenuList pl={2}>
              {!notifications.length && "No New Notifications"}
              {notifications.map(notification => (
                <MenuItem key={notification._id} onClick={()=>{
                  setselectedChat(notification.chat);
                  setnotifications(notifications.filter((n)=> n!== notification))
                }}>
                  {notification.chat.isGroupChat
                    ? `New Message: ${notification.chat.chatName}`
                    : `New Message: ${getSenderName(user, notification.chat.users)} `}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton marginRight={4}>
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                src={`public${user.pic}`}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={"1px"}>Search User</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} mr={2} alignItems={"center"}>
              <Input
                placeholder="Search by Name or Email"
                margin={2}
                value={search}
                onChange={(e) => setsearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatsLoading />
            ) : (
              searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
