



// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { auth } from "../../firebase/config";
// import { supabase } from "../../firebase/supabaseClient";
// import "../../components/Chats/Chats.css";

// export default function Chats() {
//   const [chats, setChats] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [newMessages, setNewMessages] = useState({});
//   const navigate = useNavigate();
//   const location = useLocation();
//   const isFocused = location.pathname === "/chats";
//   const [refreshing, setRefreshing] = useState(false);

//   const translations = {
//     en: {
//       messages: "Messages",
//       noConversations: "No Conversations",
//       startChatting: "Start chatting by messaging your friends",
//       deleteChat: "Delete Chat",
//       deleteSelectedChats: "Delete Selected Chats",
//       deleteConfirmation: "Messages will be removed from this device.",
//       cancel: "Cancel",
//     },
//   };

//   // Load Chats
//   const loadChats = useCallback(async () => {
//     setLoading(true);
//     try {
//       const storedMessages = localStorage.getItem("newMessages");
//       const unreadBuffer = storedMessages ? JSON.parse(storedMessages) : {};
//       setNewMessages(unreadBuffer);

//       // const { data: chatsData, error: chatsError } = await supabase
//       //   .from("chats")
//       //   .select("*")
//       //   .contains("participants", [auth?.currentUser?.email])
//       //   .order("last_updated", { ascending: false });


// const { data: chatsData, error: chatsError } = await supabase
//   .from("chats")
//   .select("*")
//   .contains("participants", [auth?.currentUser?.email])
//   .order("last_updated", { ascending: false });


//       if (chatsError) {
//         console.log("❌ Error fetching chats:", chatsError.message);
//         setLoading(false);
//         return;
//       }

//       const chatsWithAvatars = await Promise.all(
//         chatsData.map(async (chat) => {
//           const usersWithAvatars = await Promise.all(
//             chat.users.map(async (user) => {
//               try {
//                 const { data: userData } = await supabase
//                   .from("users")
//                   .select("avatar, about, isactivestatus")
//                   .eq("email", user.email)
//                   .single();
//                 return {
//                   ...user,
//                   avatar: userData?.avatar ?? null,
//                   about: userData?.about ?? null,
//                   isactivestatus: userData?.isactivestatus ?? null,
//                 };
//               } catch (error) {
//                 return { ...user, avatar: null };
//               }
//             })
//           );
//           return { ...chat, users: usersWithAvatars };
//         })
//       );

//       setChats(chatsWithAvatars || []);
//     } catch (error) {
//       console.log("❌ Error loading chats:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await loadChats();
//     setTimeout(() => setRefreshing(false), 1000);
//   }, [loadChats]);

//   useEffect(() => {
//     if (isFocused) loadChats();
//   }, [isFocused, loadChats]);

//   const getChatName = useCallback((chat) => {
//     const currentUser = auth?.currentUser;
//     if (chat.groupName) return chat.groupName;
//     const otherUser = chat.users?.find((u) => u.email !== currentUser?.email);
//     return otherUser?.name || otherUser?.email || "Unknown";
//   }, []);

//   const getSubtitle = useCallback((chat) => {
//     const lastMessage = chat.last_message;
//     if (!lastMessage) return "No messages yet";
//     if (lastMessage.text)
//       return lastMessage.text.length > 25
//         ? `${lastMessage.text.substring(0, 25)}...`
//         : lastMessage.text;
//     if (lastMessage.image) return "📷 Image";
//     if (lastMessage.audio) return "🎵 Audio";
//     return "Sent a message";
//   }, []);

//   const getSubtitle2 = useCallback((chat) => {
//     const last_updated = chat.last_updated;
//     if (!last_updated) return "";
//     const now = new Date();
//     const msgDate = new Date(last_updated);
//     const diffTime = Math.abs(now - msgDate);
//     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
//     if (diffDays === 0)
//       return msgDate.toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     if (diffDays === 1) return "Yesterday";
//     if (diffDays < 7)
//       return msgDate.toLocaleDateString([], { weekday: "short" });
//     return msgDate.toLocaleDateString([], { month: "short", day: "numeric" });
//   }, []);

//   const handleChatPress = (chat) => {
//     const chatId = chat.id;
//     if (selectedItems.length) {
//       selectItems(chat);
//       return;
//     }

//     // Update local unread messages
//     const updated = { ...newMessages };
//     delete updated[chatId];
//     localStorage.setItem("newMessages", JSON.stringify(updated));
//     localStorage.setItem(`lastSeen_${chatId}`, Date.now().toString());
//     setNewMessages(updated);

//     const otherUser = chat.users?.find((u) => u.email !== auth.currentUser?.email);
//     navigate("/chat", {
//       state: {
//         id: chatId,
//         chatName: getChatName(chat),
//         email: otherUser?.email || "",
//         avatar: otherUser?.avatar || "",
//         name: otherUser?.name || "",
//         about: otherUser?.about || "",
//         isactivestatus: otherUser?.isactivestatus || "",
//       },
//     });
//   };

//   const handleChatLongPress = (chat) => selectItems(chat);

//   const selectItems = (chat) =>
//     setSelectedItems((prev) =>
//       prev.includes(chat.id) ? prev.filter((id) => id !== chat.id) : [...prev, chat.id]
//     );

//   const deSelectItems = useCallback(() => setSelectedItems([]), []);

//   const handleDeleteChat = useCallback(() => {
//     if (!selectedItems.length) return;
//     const confirmDelete = window.confirm(
//       selectedItems.length > 1
//         ? "Delete selected chats? Messages will be removed from this device."
//         : "Delete this chat? Messages will be removed from this device."
//     );
//     if (!confirmDelete) return;
//     deleteSelectedChats();
//   }, [selectedItems]);

//   const deleteSelectedChats = async () => {
//     try {
//       const email = auth?.currentUser?.email;
//       const deletePromises = selectedItems.map(async (chatId) => {
//         await supabase
//           .from("deletedchats")
//           .upsert({ user_email: email, chat_id: chatId }, { onConflict: "user_email,chat_id" });
//         const { data: chatData } = await supabase
//           .from("chats")
//           .select("participants")
//           .eq("id", chatId)
//           .single();
//         const { data: deletedUsers } = await supabase
//           .from("deletedchats")
//           .select("user_email")
//           .eq("chat_id", chatId);
//         if (chatData.participants.every((p) => deletedUsers?.some((d) => d.user_email === p))) {
//           await supabase.from("chats").delete().eq("id", chatId);
//         }
//       });
//       await Promise.all(deletePromises);
//       deSelectItems();
//       loadChats();
//     } catch (err) {
//       console.log("Error deleting chat:", err.message);
//     }
//   };

//   const ModernChatItem = ({ chat, isSelected }) => {
//     const otherUser = chat.users?.find((u) => u.email !== auth.currentUser?.email);
//     const avatarUrl = otherUser?.avatar;
//     const unreadCount = newMessages[chat.id] || 0;

//     return (
//       <div
//         className={`chat-card ${isSelected ? "selected-chat-card" : ""}`}
//         onClick={() => handleChatPress(chat)}
//         onContextMenu={(e) => {
//           e.preventDefault();
//           handleChatLongPress(chat);
//         }}
//       >
//         <div className="avatar-container">
//           {avatarUrl ? (
//             <img src={avatarUrl} alt={getChatName(chat)} className="avatar-image" />
//           ) : (
//             <div className="avatar-gradient">
//               <span className="avatar-text">{getChatName(chat).charAt(0).toUpperCase()}</span>
//             </div>
//           )}
//           {otherUser?.isactivestatus && <div className="online-indicator" />}
//         </div>
//         <div className="chat-content">
//           <div className="chat-header">
//             <span className="chat-name">{getChatName(chat)}</span>
//             <span className="time-text">{getSubtitle2(chat)}</span>
//           </div>
//           <div className="chat-footer">
//             <span className="last-message">{getSubtitle(chat)}</span>
//             {unreadCount > 0 && (
//               <div className="badge">
//                 <span className="badge-text">{unreadCount > 99 ? "99+" : unreadCount}</span>
//               </div>
//             )}
//           </div>
//         </div>
//         {isSelected && (
//           <div className="selection-overlay">
//             <div className="checkbox">✓</div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   const injectAdsInChats = (chats) => {
//     const newData = [];
//     chats.forEach((chat, index) => {
//       newData.push({ type: "chat", data: chat });
//       if ((index + 1) % 3 === 0) newData.push({ type: "ad", id: `ad-${index}` });
//     });
//     return newData;
//   };

//   return (
//     <div className="chats-container">
//       <div className="background-gradient">
//         <div className="floating-circle circle1"></div>
//         <div className="floating-circle circle2"></div>
//         <div className="floating-circle circle3"></div>
//       </div>

//       <div className="header">
//         <div className="header-content">
//           <div className="header-text-container">
//             <h1 className="app-name">Hiddo</h1>
//             <p className="app-subtitle">{translations.en.messages}</p>
//           </div>
//           <button className="refresh-button" onClick={onRefresh}>
//             ⟳ Refresh
//           </button>
//         </div>
//       </div>

//       <div className="content-container" onClick={deSelectItems}>
//         {loading ? (
//           <div className="skeleton-container">
//             {[1, 2, 3, 4, 5].map((i) => (
//               <div key={i} className="skeleton-item">
//                 <div className="skeleton-avatar" />
//                 <div className="skeleton-content">
//                   <div className="skeleton-line" />
//                   <div className="skeleton-line skeleton-short" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : chats.length === 0 ? (
//           <div className="empty-container">
//             <div className="empty-icon">💬</div>
//             <h3 className="empty-title">{translations.en.noConversations}</h3>
//             <p className="empty-subtitle">{translations.en.startChatting}</p>
//           </div>
//         ) : (
//           <div className="chats-list">
//             {injectAdsInChats(chats).map((item) => {
//               if (item.type === "chat")
//                 return (
//                   <ModernChatItem
//                     key={item.data.id}
//                     chat={item.data}
//                     isSelected={selectedItems.includes(item.data.id)}
//                   />
//                 );
//               if (item.type === "ad")
//                 return (
//                   <div key={item.id} className="ad-container">
//                     <div className="ad-placeholder">Advertisement</div>
//                   </div>
//                 );
//               return null;
//             })}
//           </div>
//         )}
//       </div>

//       <div className="fab" onClick={() => navigate("/users")}>
//         <div className="fab-gradient">+</div>
//       </div>

//       {selectedItems.length > 0 && (
//         <div className="selection-toolbar">
//           <span className="item-count">{selectedItems.length} selected</span>
//           <button className="delete-button" onClick={handleDeleteChat}>
//             Delete
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }






import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../../firebase/config";
import { supabase } from "../../firebase/supabaseClient";
import "./Chats.css";

export default function Chats() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [newMessages, setNewMessages] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();
  const location = useLocation();
  const isFocused = location.pathname === "/chats";
  const [refreshing, setRefreshing] = useState(false);

  const translations = {
    en: {
      messages: "Messages",
      noConversations: "No Conversations",
      startChatting: "Start chatting by messaging your friends",
      deleteChat: "Delete Chat",
      deleteSelectedChats: "Delete Selected Chats",
      deleteConfirmation: "Messages will be removed from this device.",
      cancel: "Cancel",
      search: "Search conversations...",
      all: "All",
      unread: "Unread",
      groups: "Groups"
    },
  };

  // Define these functions BEFORE they are used
  const getChatName = useCallback((chat) => {
    const currentUser = auth?.currentUser;
    if (chat.groupName) return chat.groupName;
    const otherUser = chat.users?.find((u) => u.email !== currentUser?.email);
    return otherUser?.name || otherUser?.email || "Unknown";
  }, []);

  const getSubtitle = useCallback((chat) => {
    const lastMessage = chat.last_message;
    if (!lastMessage) return "No messages yet";
    if (lastMessage.text)
      return lastMessage.text.length > 25
        ? `${lastMessage.text.substring(0, 25)}...`
        : lastMessage.text;
    if (lastMessage.image) return "📷 Image";
    if (lastMessage.audio) return "🎵 Audio";
    return "Sent a message";
  }, []);

  const getSubtitle2 = useCallback((chat) => {
    const last_updated = chat.last_updated;
    if (!last_updated) return "";
    const now = new Date();
    const msgDate = new Date(last_updated);
    const diffTime = Math.abs(now - msgDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0)
      return msgDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7)
      return msgDate.toLocaleDateString([], { weekday: "short" });
    return msgDate.toLocaleDateString([], { month: "short", day: "numeric" });
  }, []);

  // Now define filteredChats AFTER the functions it depends on
  const filteredChats = chats.filter(chat => {
    const matchesSearch = getChatName(chat).toLowerCase().includes(searchQuery.toLowerCase()) ||
                         getSubtitle(chat).toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      activeFilter === "all" ? true :
      activeFilter === "unread" ? (newMessages[chat.id] > 0) :
      activeFilter === "groups" ? (chat.groupName !== null) : true;
    
    return matchesSearch && matchesFilter;
  });

  // Load Chats
  const loadChats = useCallback(async () => {
    setLoading(true);
    try {
      const storedMessages = localStorage.getItem("newMessages");
      const unreadBuffer = storedMessages ? JSON.parse(storedMessages) : {};
      setNewMessages(unreadBuffer);

      const { data: chatsData, error: chatsError } = await supabase
        .from("chats")
        .select("*")
        .contains("participants", [auth?.currentUser?.email])
        .order("last_updated", { ascending: false });

      if (chatsError) {
        console.log("❌ Error fetching chats:", chatsError.message);
        setLoading(false);
        return;
      }

      const chatsWithAvatars = await Promise.all(
        chatsData.map(async (chat) => {
          const usersWithAvatars = await Promise.all(
            chat.users.map(async (user) => {
              try {
                const { data: userData } = await supabase
                  .from("users")
                  .select("avatar, about, isactivestatus")
                  .eq("email", user.email)
                  .single();
                return {
                  ...user,
                  avatar: userData?.avatar ?? null,
                  about: userData?.about ?? null,
                  isactivestatus: userData?.isactivestatus ?? null,
                };
              } catch (error) {
                return { ...user, avatar: null };
              }
            })
          );
          return { ...chat, users: usersWithAvatars };
        })
      );

      setChats(chatsWithAvatars || []);
    } catch (error) {
      console.log("❌ Error loading chats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadChats();
    setTimeout(() => setRefreshing(false), 1000);
  }, [loadChats]);

  useEffect(() => {
    if (isFocused) loadChats();
  }, [isFocused, loadChats]);

  const handleChatPress = (chat) => {
    const chatId = chat.id;
    if (selectedItems.length) {
      selectItems(chat);
      return;
    }

    // Update local unread messages
    const updated = { ...newMessages };
    delete updated[chatId];
    localStorage.setItem("newMessages", JSON.stringify(updated));
    localStorage.setItem(`lastSeen_${chatId}`, Date.now().toString());
    setNewMessages(updated);

    const otherUser = chat.users?.find((u) => u.email !== auth.currentUser?.email);
    navigate("/chat", {
      state: {
        id: chatId,
        chatName: getChatName(chat),
        email: otherUser?.email || "",
        avatar: otherUser?.avatar || "",
        name: otherUser?.name || "",
        about: otherUser?.about || "",
        isactivestatus: otherUser?.isactivestatus || "",
      },
    });
  };

  const handleChatLongPress = (chat) => selectItems(chat);

  const selectItems = (chat) =>
    setSelectedItems((prev) =>
      prev.includes(chat.id) ? prev.filter((id) => id !== chat.id) : [...prev, chat.id]
    );

  const deSelectItems = useCallback(() => setSelectedItems([]), []);

  const handleDeleteChat = useCallback(() => {
    if (!selectedItems.length) return;
    const confirmDelete = window.confirm(
      selectedItems.length > 1
        ? "Delete selected chats? Messages will be removed from this device."
        : "Delete this chat? Messages will be removed from this device."
    );
    if (!confirmDelete) return;
    deleteSelectedChats();
  }, [selectedItems]);

  const deleteSelectedChats = async () => {
    try {
      const email = auth?.currentUser?.email;
      const deletePromises = selectedItems.map(async (chatId) => {
        await supabase
          .from("deletedchats")
          .upsert({ user_email: email, chat_id: chatId }, { onConflict: "user_email,chat_id" });
        const { data: chatData } = await supabase
          .from("chats")
          .select("participants")
          .eq("id", chatId)
          .single();
        const { data: deletedUsers } = await supabase
          .from("deletedchats")
          .select("user_email")
          .eq("chat_id", chatId);
        if (chatData.participants.every((p) => deletedUsers?.some((d) => d.user_email === p))) {
          await supabase.from("chats").delete().eq("id", chatId);
        }
      });
      await Promise.all(deletePromises);
      deSelectItems();
      loadChats();
    } catch (err) {
      console.log("Error deleting chat:", err.message);
    }
  };

  const ModernChatItem = ({ chat, isSelected }) => {
    const otherUser = chat.users?.find((u) => u.email !== auth.currentUser?.email);
    const avatarUrl = otherUser?.avatar;
    const unreadCount = newMessages[chat.id] || 0;
    const isGroupChat = chat.groupName;

    return (
      <div
        className={`modern-chat-card ${isSelected ? "modern-selected-chat-card" : ""}`}
        onClick={() => handleChatPress(chat)}
        onContextMenu={(e) => {
          e.preventDefault();
          handleChatLongPress(chat);
        }}
      >
        <div className="modern-avatar-container">
          {avatarUrl ? (
            <img src={avatarUrl} alt={getChatName(chat)} className="modern-avatar-image" />
          ) : (
            <div className="modern-avatar-gradient">
              <span className="modern-avatar-text">{getChatName(chat).charAt(0).toUpperCase()}</span>
            </div>
          )}
          {otherUser?.isactivestatus && !isGroupChat && <div className="modern-online-indicator" />}
          {isGroupChat && <div className="group-indicator">👥</div>}
        </div>
        
        <div className="modern-chat-content">
          <div className="modern-chat-header">
            <span className="modern-chat-name">{getChatName(chat)}</span>
            <span className="modern-time-text">{getSubtitle2(chat)}</span>
          </div>
          <div className="modern-chat-footer">
            <span className="modern-last-message">{getSubtitle(chat)}</span>
            {unreadCount > 0 && (
              <div className="modern-badge">
                <span className="modern-badge-text">{unreadCount > 99 ? "99+" : unreadCount}</span>
              </div>
            )}
          </div>
        </div>
        
        {isSelected && (
          <div className="modern-selection-overlay">
            <div className="modern-checkbox">✓</div>
          </div>
        )}
      </div>
    );
  };

  const injectAdsInChats = (chats) => {
    const newData = [];
    chats.forEach((chat, index) => {
      newData.push({ type: "chat", data: chat });
      if ((index + 1) % 3 === 0) newData.push({ type: "ad", id: `ad-${index}` });
    });
    return newData;
  };

  return (
    <div className="modern-chats-container">
      {/* Animated Background */}
      <div className="modern-background-gradient">
        <div className="modern-floating-shape shape1"></div>
        <div className="modern-floating-shape shape2"></div>
        <div className="modern-floating-shape shape3"></div>
        <div className="modern-floating-shape shape4"></div>
      </div>

      {/* Header Section */}
      <div className="modern-header">
        <div className="modern-header-content">
          <div className="modern-header-text">
            <h1 className="modern-app-name">Hiddo</h1>
            <p className="modern-app-subtitle">{translations.en.messages}</p>
          </div>
          <div className="modern-header-actions">
            <button 
              className={`modern-refresh-button ${refreshing ? 'refreshing' : ''}`} 
              onClick={onRefresh}
            >
              <span className="refresh-icon">⟳</span>
              Refresh
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="modern-search-container">
          <div className="modern-search-input">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder={translations.en.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-field"
            />
            {searchQuery && (
              <button 
                className="clear-search"
                onClick={() => setSearchQuery("")}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="modern-filter-tabs">
          {["all", "unread", "groups"].map(filter => (
            <button
              key={filter}
              className={`modern-filter-tab ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {translations.en[filter]}
              {filter === "unread" && Object.keys(newMessages).length > 0 && (
                <span className="filter-badge">{Object.keys(newMessages).length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="modern-content-container" onClick={deSelectItems}>
        {loading ? (
          <div className="modern-skeleton-container">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="modern-skeleton-item">
                <div className="modern-skeleton-avatar" />
                <div className="modern-skeleton-content">
                  <div className="modern-skeleton-line" />
                  <div className="modern-skeleton-line modern-skeleton-short" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="modern-empty-container">
            <div className="modern-empty-icon">
              <div className="empty-gradient">💬</div>
            </div>
            <h3 className="modern-empty-title">
              {searchQuery ? "No matches found" : translations.en.noConversations}
            </h3>
            <p className="modern-empty-subtitle">
              {searchQuery ? "Try adjusting your search terms" : translations.en.startChatting}
            </p>
            {searchQuery && (
              <button 
                className="modern-clear-search-button"
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="modern-chats-list">
            {injectAdsInChats(filteredChats).map((item) => {
              if (item.type === "chat")
                return (
                  <ModernChatItem
                    key={item.data.id}
                    chat={item.data}
                    isSelected={selectedItems.includes(item.data.id)}
                  />
                );
              if (item.type === "ad")
                return (
                  <div key={item.id} className="modern-ad-container">
                    <div className="modern-ad-placeholder">
                      <div className="ad-gradient">📢 Advertisement</div>
                    </div>
                  </div>
                );
              return null;
            })}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="modern-fab" onClick={() => navigate("/users")}>
        <div className="modern-fab-gradient">
          <span className="fab-icon">+</span>
          <div className="fab-pulse"></div>
        </div>
      </div>

      {/* Selection Toolbar */}
      {selectedItems.length > 0 && (
        <div className="modern-selection-toolbar">
          <div className="modern-toolbar-content">
            <span className="modern-item-count">
              <span className="count-bubble">{selectedItems.length}</span>
              {selectedItems.length === 1 ? ' chat selected' : ' chats selected'}
            </span>
            <div className="modern-toolbar-actions">
              <button className="modern-cancel-button" onClick={deSelectItems}>
                Cancel
              </button>
              <button className="modern-delete-button" onClick={handleDeleteChat}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}