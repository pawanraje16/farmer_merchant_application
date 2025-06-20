// import { createContext, useContext, useState, useEffect } from "react";
// import { io } from "socket.io-client";
// import { useAuth } from "./AuthContext";

// const ChatContext = createContext();
// export const useChat = () => useContext(ChatContext);

// export const ChatProvider = ({ children }) => {
//   const { user } = useAuth();
//   const [socket, setSocket] = useState(null);
//   const [conversations, setConversations] = useState([]); // list of chat heads
//   const [messages, setMessages] = useState({}); // {convId: [msg,msg]}

//   useEffect(() => {
//     if (!user) return;
//     const s = io(import.meta.env.VITE_SOCKET_URL, { query: { userId: user._id } });
//     setSocket(s);
//     return () => s.disconnect();
//   }, [user]);

//   const sendMessage = (toId, text) => {
//     if (!socket) return;
//     socket.emit("private-message", { toId, text });
//   };

//   useEffect(() => {
//     if (!socket) return;
//     socket.on("private-message", ({ fromId, text, convId }) => {
//       setMessages((prev) => ({
//         ...prev,
//         [convId]: [...(prev[convId] || []), { fromId, text }],
//       }));
//     });
//   }, [socket]);

//   return (
//     <ChatContext.Provider value={{ conversations, messages, sendMessage }}>
//       {children}
//     </ChatContext.Provider>
//   );
// };
