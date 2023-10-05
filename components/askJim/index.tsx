import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { initializeIcons } from "@fluentui/react";

import styles from "./MyComponent.module.css";

import Layout from "./pages/layout/Layout";
import Chat from "./pages/chat/Chat";

// import "./index.css";

initializeIcons();

const MyComponent = () => {
  const [isChatActive, setIsChatActive] = useState(false);

  const toggleChat = () => {
    setIsChatActive(!isChatActive);
  };

  useEffect(() => {
    let display = isChatActive ? "block" : "none";
    document.documentElement.style.setProperty("--chat-active", display);
  }, [isChatActive]);

  return (
    <div className={styles.myComponentContainer}>
      <div
        className={styles.myComponentHeader}
        onClick={toggleChat}
        role="button"
      >
        Ask Jim!
        <span>{isChatActive ? "-" : "+"}</span>
      </div>
      <div
        className={`${styles.myComponentContent} ${
          isChatActive ? "active" : ""
        }`}
      >
        <div className={styles.myComponentChat}>
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default MyComponent;

