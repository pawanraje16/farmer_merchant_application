"use client"

import { useParams } from "react-router-dom"
import ChatInterface from "../components/ChatInterface"
import ChatList from "../components/ChatList"

const Chat = () => {
  const { userId } = useParams()
  
  // If userId is provided, show chat interface, otherwise show chat list
  return <div className="w-full">{userId ? <ChatInterface /> : <ChatList />}</div>
}

export default Chat
