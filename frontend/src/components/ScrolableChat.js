import React from "react";
import ScrolableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatsLogic";
import { ChatState } from "../Context/ChatProvider";
import { Avatar, Tooltip } from "@chakra-ui/react";

const ScrolableChat = ({ allmessages }) => {

  const { user, selectedChat } = ChatState();
  return (
    <ScrolableFeed>
      Created Date:
      {new Date(selectedChat.createdAt).toLocaleDateString()}
      {allmessages &&
        allmessages.map((message, index) => (
          <div style={{ display: "flex" }} key={message._id}>
            {(isSameSender(allmessages, message, index, user._id) ||
              isLastMessage(allmessages, index, user._id)) && (
              <Tooltip
                label={message.sender.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt={"7px"}
                  mr={1}
                  size={"sm"}
                  cursor={"pointer"}
                  name={message.sender.name}
                  src={`public${message.sender.pic}`}
                />
              </Tooltip>
            )}

            <span
              style={{
                backgroundColor:
                  message.sender._id === user._id ? "greenyellow" : "lightblue",
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(
                  allmessages,
                  message,
                  index,
                  user._id
                ),
                marginTop: isSameUser(allmessages, message, index, user._id)
                  ? 3
                  : 10,
              }}
            >
              {message.content}
              <span
                style={{
                  fontSize: "10px",
                  display: "block",
                }}
              >
                {new Date(message.createdAt).toLocaleTimeString()}
              </span>
            </span>
          </div>
        ))}
    </ScrolableFeed>
  );
};

export default ScrolableChat;
