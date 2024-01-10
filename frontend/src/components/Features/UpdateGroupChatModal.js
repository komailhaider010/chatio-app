import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { UserBadgeItem } from "./UserBadgeItem";
import axios from "axios";
import { UserListItem } from "../UserAvatar/UserListItem";

export const UpdateGroupChatModal = ({
  fetchAgain,
  setfetchAgain,
  children,
  fetchChatMessages,
}) => {
    const { user, selectedChat, setselectedChat } = ChatState();
    const token = localStorage.getItem("token");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setgroupChatName] = useState("");
  const [search, setsearch] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const [selectedUsers, setselectedUsers] = useState([]);
  const [selectedUsersId, setselectedUsersId] = useState([]);
  const [loading, setloading] = useState(false);
  const [loadingName, setloadingName] = useState(false);
  const toast = useToast();  

  const handleSearch = async (value) => {
    setsearch(value);
    if (search) {
      try {
        setloading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await axios.get(`/api/user?search=${value}`, config);
        setsearchResult(data);
        setloading(false);
      } catch (error) {
        console.log(error);
        toast({
          title: error.response.data.message,
          discription: "Failed to search Results",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleUserRemove = async(removeuser)=>{
    if (selectedChat.groupAdmin._id !== user._id) {
        toast({
            title: "Only Admin Can Add To the Group",
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        return
    }
    try {
        setloading(true);
        const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        const {data} = await axios.put('/api/chat/removefromgroup', {
            chatId: selectedChat._id,
            userId: removeuser._id,
        }, config);

        setselectedChat(data);
        setfetchAgain(!fetchAgain);
        fetchChatMessages();
        setloading(false);
        toast({
            title: "User Removed From the Group",
            status: 'success',
            duration: 5000,
            isClosable: true,
          })   
    } catch (error) {
        console.log(error);
        toast({
            title: error.response.data.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
    }


  }
  const handleLeavGroup = (user)=>{

  }
  const handleAddUser = async(adduser)=>{
    if (selectedChat.groupAdmin._id !== user._id) {
        toast({
            title: "Only Admin Can Add To the Group",
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        return
    }

    if (selectedChat.users.find((u)=> u._id === adduser._id)) {
        toast({
            title: "User Already in Group",
            status: 'warning',
            duration: 5000,
            isClosable: true,
          });
        return
    }

    try {
        setloading(true);
        const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        const {data} = await axios.put('/api/chat/addtogroup', {
            chatId: selectedChat._id,
            userId: adduser._id,
        }, config);

        setselectedChat(data);
        setfetchAgain(!fetchAgain);
        setloading(false);
        toast({
            title: "User Added to the Group",
            status: 'success',
            duration: 5000,
            isClosable: true,
          })   
    } catch (error) {
        console.log(error);
        toast({
            title: error.response.data.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
    }



  }
  const handleGroupRename = async()=>{
    if (groupChatName) {
        try {
            setloadingName(true)
            const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              };
            const {data} = await axios.put("/api/chat/updategroupname", {
                chatId: selectedChat._id,
                newChatName: groupChatName,
            }, config)
            setselectedChat('');
            setfetchAgain(!fetchAgain);
            toast({
                title: "Group Chat Name Updated Sucessfully",
                status: 'success',
                duration: 5000,
                isClosable: true,
              })
              onClose()
            setgroupChatName("")
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
  }

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"30px"}
            display={"flex"}
            justifyContent={"center"}
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
          >
            <Box display={"flex"} flexWrap={"wrap"}>
                {selectedChat.users && selectedChat.users.map((user)=>(
                    <UserBadgeItem user={user} handleFuntion={()=> handleUserRemove(user)} />
                ))}
            </Box>
            <FormControl display={"flex"}>
              <Input placeholder="Chat Group Name" mb={3}
              onChange={(e)=> setgroupChatName(e.target.value)} value={groupChatName} />
              <Button onClick={handleGroupRename}>Update</Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Search User To Add"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? <span>loading</span> :(
                searchResult?.slice(0,4).map((user)=>(
                    <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={()=> handleAddUser(user)}
                    />
                ))
            )
             }
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={()=> handleLeavGroup(user)}>Create Group</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
