







import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../firebase/supabaseClient";
import { auth } from "../config/firebase";
import {
  FiPhone,
  FiVideo,
  FiMoreVertical,
  FiTrash2,
  FiBan,
} from "react-icons/fi";
import "../../components/ChatMenu.css";

const ChatMenu = ({ chatName, chatId, email }) => {
  const navigate = useNavigate();
  const currentEmail = auth?.currentUser?.email || localStorage.getItem("email");
  const [isBlocked, setIsBlocked] = useState(false);
  const [isChatDisabled, setIsChatDisabled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const channelRef = useRef(null);

  useEffect(() => {
    if (!email || !currentEmail) return;

    const checkBlockedStatus = async () => {
      const { data } = await supabase
        .from("blockusers")
        .select("TotalBlockUser")
        .eq("email", currentEmail)
        .single();

      const blocked = data?.TotalBlockUser?.some((u) => u.email === email);
      setIsBlocked(blocked);
      setIsChatDisabled(blocked);
    };

    checkBlockedStatus();
  }, [email, currentEmail]);

  const handleBlockToggle = async () => {
    const { data } = await supabase
      .from("blockusers")
      .select("TotalBlockUser")
      .eq("email", currentEmail)
      .single();

    let list = Array.isArray(data?.TotalBlockUser)
      ? data.TotalBlockUser
      : [];

    if (isBlocked) {
      list = list.filter((u) => u.email !== email);
    } else {
      list.push({ email, isblock: true });
    }

    const { error } = await supabase
      .from("blockusers")
      .upsert({ email: currentEmail, TotalBlockUser: list });

    if (error) {
      alert("Failed to update block status");
    } else {
      setIsBlocked(!isBlocked);
      setIsChatDisabled(!isBlocked);
      alert(`${isBlocked ? "Unblocked" : "Blocked"} ${email}`);
    }
  };

  const handleDeleteChat = async () => {
    const confirmDelete = window.confirm(
      "Delete chat for you only? This will remove it from your view."
    );
    if (!confirmDelete) return;

    const { error } = await supabase.from("deletedchats").upsert({
      user_email: currentEmail,
      chat_id: chatId,
      deleted_at: new Date().toISOString(),
    });

    if (error) alert("Failed to delete chat");
    else alert("Chat deleted from your view");
  };

  const initiateCall = (isVideo) => {
    if (isChatDisabled) {
      alert("Blocked — cannot call this user.");
      return;
    }

    navigate("/call", {
      state: { roomId: currentEmail, peerEmail: email, isVideoCall: isVideo },
    });
  };

  return (
    <div className="chat-menu-row">
      <button className="icon-btn" onClick={() => initiateCall(false)} title="Audio Call">
        <FiPhone />
      </button>

      <button className="icon-btn" onClick={() => initiateCall(true)} title="Video Call">
        <FiVideo />
      </button>

      <div className="menu-root">
        <button
          className="icon-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          title="Menu"
        >
          <FiMoreVertical />
        </button>

        {menuOpen && (
          <div className="menu-dropdown" onMouseLeave={() => setMenuOpen(false)}>
            <button className="menu-item" onClick={handleDeleteChat}>
              <FiTrash2 /> Delete Chat
            </button>

            <button className="menu-item" onClick={handleBlockToggle}>
              <FiBan /> {isBlocked ? "Unblock User" : "Block User"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

ChatMenu.propTypes = {
  chatName: PropTypes.string.isRequired,
  chatId: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
};

export default ChatMenu;
