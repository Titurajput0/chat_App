


import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../firebase/supabaseClient";
import TypingIndicator from "../components/TypingIndicator";
import { FaCircle } from "react-icons/fa";
import "../../components/ChatHeader.css";

const ChatHeader = ({ chatName, chatId, email, avatar, about }) => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(false);
  const [selfEmail, setSelfEmail] = useState("");
  const channelRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const setupStatusListener = async () => {
      const storedEmail = localStorage.getItem("email");
      if (!storedEmail) return;

      setSelfEmail(storedEmail);

      // Fetch initial online status
      const { data: userData, error } = await supabase
        .from("users")
        .select("isactivestatus")
        .eq("email", email)
        .single();

      if (!error && userData) setIsOnline(Boolean(userData.isactivestatus));

      // Listen for real-time updates
      channelRef.current = supabase
        .channel(`user_status_${email}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "users",
            filter: `email=eq.${email}`,
          },
          (payload) => {
            if (mounted) setIsOnline(Boolean(payload.new?.isactivestatus));
          }
        )
        .subscribe();

      // Update current user’s online status
      const handleVisibility = async () => {
        const visible = document.visibilityState === "visible";
        await supabase
          .from("users")
          .update({ isactivestatus: visible })
          .eq("email", storedEmail);
      };

      document.addEventListener("visibilitychange", handleVisibility);

      return () => {
        document.removeEventListener("visibilitychange", handleVisibility);
      };
    };

    const cleanup = setupStatusListener();

    return () => {
      mounted = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      if (typeof cleanup === "function") cleanup();
    };
  }, [email]);

  const handleChatInfo = () => {
    navigate("/chat-info", {
      state: { chatId, chatName, avatar, about, isOnline },
    });
  };

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((s) => s[0]?.toUpperCase() || "")
      .slice(0, 2)
      .join("");

  return (
    <div className="chat-header" onClick={handleChatInfo}>
      <div className="chat-header-left">
        <div className="avatar-circle">
          {avatar ? (
            <img src={avatar} alt={chatName} className="avatar-img" />
          ) : (
            <div className="avatar-initials">{getInitials(chatName)}</div>
          )}
        </div>

        <div className="chat-meta">
          <div className="chat-name">{chatName}</div>
          <div className="chat-status">
            <FaCircle
              className="status-icon"
              style={{ color: isOnline ? "#24C55A" : "#D93E3E" }}
            />
            <span className="status-text">{isOnline ? "Online" : "Offline"}</span>
          </div>

          {selfEmail && (
            <TypingIndicator
              chatId={chatId}
              currentUserEmail={selfEmail}
              otherEmail={email}
            />
          )}
        </div>
      </div>
    </div>
  );
};

ChatHeader.propTypes = {
  chatName: PropTypes.string.isRequired,
  chatId: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  about: PropTypes.string,
};

export default ChatHeader;
