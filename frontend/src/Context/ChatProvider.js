import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setuser] = useState("");
  const [selectedChat, setselectedChat] = useState("");
  const [chats, setchats] = useState([]);
  const [notifications, setnotifications] = useState([]);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("token");
    try {
      const result = await axios.get("/api/currentuser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setuser(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    fetchCurrentUser();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setuser,
        selectedChat,
        setselectedChat,
        chats,
        setchats,
        notifications,
        setnotifications,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
