import React from "react";
import {
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
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import { UserListItem } from "../UserAvatar/UserListItem";
import { UserBadgeItem } from "./UserBadgeItem";

export const GroupChatModal = ({ children }) => {
  const token = localStorage.getItem("token");
  const { user, chats, setchats } = ChatState();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setgroupChatName] = useState("");
  const [selectedUsers, setselectedUsers] = useState([]);
  const [selectedUsersId, setselectedUsersId] = useState([]);
  const [search, setsearch] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const [loading, setloading] = useState(false);

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

  const handleSelectUser = (user)=>{
    if(selectedUsers.includes(user._id)){
        toast({
            title: "User Already Added",
            status: "warning",
            duration: 5000,
            isClosable: true,
          });
          return
    }
    setselectedUsers([...selectedUsers, user]);
    setselectedUsersId([...selectedUsersId, user._id]);
  }

  const handleUserRemove = (deluser)=>{
    setselectedUsers((prevSelectedUsers) =>
    prevSelectedUsers.filter((sel) => sel._id !== deluser._id)
  );
  setselectedUsersId((prevSelectedUsersId) =>
    prevSelectedUsersId.filter((sel) => sel !== deluser._id)
  );
  }


  const handleSubmitt = async () => {
    if (groupChatName && selectedUsersId) {
        try {
            const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              };
            const   {data} = await axios.post('/api/chat/groupchat', {
                name: groupChatName,
                users: selectedUsersId,
            }, config );

            setchats([data, ...chats])
            onClose();
            toast({
                title: "New Group Chat Created Sucessfully",
                status: 'success',
                duration: 5000,
                isClosable: true,
              }) 
        } catch (error) {
            console.log(error);
        }
    }
  };
    
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
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
          >
            <FormControl>
              <Input placeholder="Chat Group Name" mb={3}
              onChange={(e)=> setgroupChatName(e.target.value)} />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Search User To Add"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            <Box display={"flex"}
            flexWrap={"wrap"}>
            {selectedUsers && selectedUsers.map((user)=>(
                <UserBadgeItem user={user} handleFuntion={()=> handleUserRemove(user)} />
            ))}
            </Box>


            {loading ? <span>loading</span> :(
                searchResult?.slice(0,4).map((user)=>(
                    <UserListItem 
                    key={user._id}
                    user={user}
                    handleFunction={()=> handleSelectUser(user)}
                    />
                ))
            )
             }

          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmitt}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
