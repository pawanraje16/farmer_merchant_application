import { createContext, useContext, useState, useEffect } from "react";
// import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import api from "../utils/api";
import toast from "react-hot-toast";

const ChatContext = createContext();
export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    const {socket} = useAuth();

    // function to get all users for chatList
    const getUsers = async () => {
        try {
           
            const { data } = await api.get(`/api/v1/messages/users`)
            if(data.success){
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
            }
        } catch (error) {
            toast.error(error.messages)
        }
    }

    // function to get message for selected user
    const getMessages = async (userId) => {
        try {
            const { data } = await api.get(`/api/v1/messages/${userId}`);
            if(data.success){
                setMessages(data.messages)
            }
        } catch (error) {
            toast.error(error.messages)
        }
    }

    // function to send message to selected user
    const sendMessage = async (messagesData) => {
        try {
            const {data} = await api.post(`/api/v1/messages/send/${selectedUser._id}`,messagesData);
            if(data.success){
                setMessages((prevMessages) => [...prevMessages, data.newMessage])
            }else {
                toast.error(data.messages);
            }
        } catch (error) {
            toast.error(error.messages);
        }
    }

    // function to subscribe to messages for selected user
    const subscribeToMessages = async () => {
        if(!socket) return ;

        socket.on("newMessage", (newMessage) => {
            if(selectedUser && newMessage.senderId === selectedUser._id){
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                api.put(`/api/v1/messages/mark/${newMessage._id}`);
            } else {
                setUnseenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages, [newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }
        })
    }

    // function to unsubscribe from messages
    const unsubscribeFromMessages = () => {
        if(socket) socket.off("newMessage");
    }

    useEffect(() => {
        subscribeToMessages();
        return () => unsubscribeFromMessages();
    },[socket, selectedUser])

    useEffect(() => {
        const cachedUsers = localStorage.getItem("chat_users");
        const cachedUnseen = localStorage.getItem("chat_unseen");

        if(cachedUsers){
            setUsers(JSON.parse(cachedUsers));
        }

        if(cachedUnseen){
            setUnseenMessages(JSON.parse(cachedUnseen));
        }
       
        // Always refresh from server
        getUsers();
    }, []);

     //  Whenever users/unseenMessages updates, cache them
    useEffect(() => {
        localStorage.setItem("chat_users", JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        localStorage.setItem("chat_unseen", JSON.stringify(unseenMessages));
    }, [unseenMessages]);

    const value = {
        messages, users, selectedUser, getUsers, getMessages, sendMessage, setSelectedUser, unseenMessages, setUnseenMessages
    }

  return (
    <ChatContext.Provider value={ value }>
      {children}
    </ChatContext.Provider>
  );
};
