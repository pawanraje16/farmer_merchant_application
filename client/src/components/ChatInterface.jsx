// src/components/ChatInterface.js
import { useParams } from "react-router-dom";
import UserChat from "./UserChat"; // We'll create this in the next step
import AgroConnectAssistantChat from "./AgroAssistan";

const ChatInterface = () => {
  const { userId } = useParams();

  // Conditionally render the correct chat component
  if (userId === "agro-assistant") {
    return <AgroConnectAssistantChat />;
  } else {
    return <UserChat />;
  }
};

export default ChatInterface;