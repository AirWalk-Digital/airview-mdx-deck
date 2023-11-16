import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { initializeIcons } from "@fluentui/react";

import styles from "./ChatBot.module.css";

import Chat from "./pages/chat/Chat";

// import "./index.css";

initializeIcons();

const ChatBot = () => {
  const [isChatActive, setIsChatActive] = useState(false);

  const toggleChat = () => {
    setIsChatActive(!isChatActive);
  };

  useEffect(() => {
    let display = isChatActive ? "block" : "none";
    document.documentElement.style.setProperty("--chat-active", display);
  }, [isChatActive]);

  return (
    <div className={styles.chatBotContainer}>
      <div
        className={styles.chatBotHeader}
        onClick={toggleChat}
        role="button"
      >
        Ask Jim!
        <span>{isChatActive ? "-" : "+"}</span>
      </div>
      <div
        className={`${styles.chatBotContent} ${
          isChatActive ? "active" : ""
        }`}
      >
        <div className={styles.chatBotChat}>
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default ChatBot;

