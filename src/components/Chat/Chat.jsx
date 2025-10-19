





// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { v4 as uuidv4 } from "uuid";
// import {
//   IoIosSend,
//   IoIosImages,
//   IoIosGift,
//   IoIosArrowBack,
//   IoIosCall,
//   IoIosVideocam,
//   IoIosClose,
// } from "react-icons/io";
// import { MdDiamond, MdLocalOffer } from "react-icons/md";
// import { FaCoins } from "react-icons/fa";

// import { auth } from "../../firebase/config";
// import { supabase } from "../../firebase/supabaseClient";
// import { setTypingStatus } from "./setTypingStatus";
// import usePaidStickers from "./usePaidStickers";
// import "./Chat.css";

// export default function Chat() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const params = location.state || {};

//   // State declarations
//   const chatId = params.id;
//   const partnerEmail = params.email;
//   const currentEmail = auth?.currentUser?.email;

//   const [messages, setMessages] = useState([]);
//   const [inputText, setInputText] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const [showStickerPicker, setShowStickerPicker] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   const [isOnline, setIsOnline] = useState(false);
//   const [isChatDisabled, setIsChatDisabled] = useState(false);
//   const [isBlocked, setIsBlocked] = useState(false);
//   const [selectedSticker, setSelectedSticker] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [activeTab, setActiveTab] = useState("gold");
//   const [userGold, setUserGold] = useState(0);
//   const [userDiamond, setUserDiamond] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(60 * 60);
//    const [showIncomingCall, setShowIncomingCall] = useState(false);
//    const [callerInfo, setCallerInfo] = useState(null);

//   // Refs
//   const typingTimeoutRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const messagesChannelRef = useRef(null);

//   // Hooks
//   const { giftImages, loading: stickersLoading } = usePaidStickers();

//   const filteredGifts = useCallback(
//     () =>
//       (giftImages || []).filter((item) =>
//         activeTab === "diamond" ? item.isTypeDiamond : !item.isTypeDiamond
//       ),
//     [giftImages, activeTab]
//   );

//   // Block user functionality
//   const handleBlockToggle = async () => {
//     const userEmail = auth?.currentUser?.email;
//     if (!userEmail || !partnerEmail) return;

//     try {
//       const { data, error } = await supabase
//         .from("blockusers")
//         .select("TotalBlockUser")
//         .eq("email", userEmail)
//         .single();

//       if (error && error.code !== "PGRST116") {
//         console.error("❌ handleBlockToggle fetch error:", error);
//         return;
//       }

//       let currentList = Array.isArray(data?.TotalBlockUser) ? data.TotalBlockUser : [];
//       let updatedList;

//       if (isBlocked) {
//         // Unblock
//         updatedList = currentList.filter((u) => u.email !== partnerEmail);
//       } else {
//         // Block
//         updatedList = [...currentList, { isblock: true, email: partnerEmail }];
//       }

//       const { error: upsertError } = await supabase
//         .from("blockusers")
//         .upsert({
//           email: userEmail,
//           TotalBlockUser: updatedList,
//         });

//       if (upsertError) {
//         console.error("❌ handleBlockToggle update error:", upsertError);
//       } else {
//         const newBlocked = !isBlocked;
//         setIsBlocked(newBlocked);
//         setIsChatDisabled(newBlocked);
//         console.log(`✅ ${newBlocked ? "Blocked" : "Unblocked"} user: ${partnerEmail}`);
//       }
//     } catch (error) {
//       console.error("❌ handleBlockToggle error:", error);
//     }
//   };



//     const handleAcceptCall = async () => {
//     try {
//       setShowIncomingCall(false);
//       stopRingtone();
      
//       const roomId = auth?.currentUser?.email;
//       const peerEmail = auth?.currentUser?.email;

//       navigate('JoinScreen', {
//         roomId,
//         peerEmail,
//         isVideoCall: true,
//         isCaller: false,
//         isTypeJoin: true,
//       });
//     } catch (error) {
//       console.log('Error accepting call:', error);
//     }
//   };

// //   const initiateCall = async (isVideo) => {
// //   try {
// //     const peerEmail = email;
    
// //     // Enhanced status checking with network resilience
// //     const { data: currentUser, error: currentError } = await supabase
// //       .from("users")
// //       .select("isoncallstatus, iscallingfrom, lastcallroom, updatedat")
// //       .eq("email", auth?.currentUser?.email)
// //       .single();

// //     const { data: peerUser, error: peerError } = await supabase
// //       .from("users")
// //       .select("isoncallstatus, iscallingfrom, lastcallroom, updatedat")
// //       .eq("email", peerEmail)
// //       .single();

// //     if (currentError || peerError) {
// //       console.log('Error fetching user status:', currentError || peerError);
// //       // Continue with call anyway - don't block due to network issues
// //     }

// //     // Enhanced busy check with stale call detection
// //     const isCurrentUserBusy = await checkIfActuallyBusy(currentUser);
// //     const isPeerUserBusy = await checkIfActuallyBusy(peerUser);

// //     if (isCurrentUserBusy || isPeerUserBusy) {
// //       alert('User is Busy', 'One of the users is already on another call');
      
// //       // Auto-cleanup if stale call detected
// //       if (isCurrentUserBusy && await isStaleCall(currentUser)) {
// //         await cleanupStaleCall(auth?.currentUser?.email);
// //       }
// //       if (isPeerUserBusy && await isStaleCall(peerUser)) {
// //         await cleanupStaleCall(peerEmail);
// //       }
      
// //       return;
// //     }

// //     // Update status BEFORE navigation with retry logic
// //     // await updateCallStatusWithRetry(auth?.currentUser?.email, peerEmail);

// //     // console.log('Navigation to CallScreen with:', {
// //     //   roomId: currentEmail,
// //     //   peerEmail,
// //     //   isVideo
// //     // });

// //     // navigate('call', {
// //     //   roomId: currentEmail,
// //     //   peerEmail,
// //     //   fcmToken,
// //     //   accessToken,
// //     //   selfFcmToken,
// //     //   avatar,
// //     //   avatars,
// //     //   selfAccessToken,
// //     //   isVideoCall: isVideo,
// //     //   isCaller: true,
// //     //   isTypeJoin: false,
// //     // });

// //       navigate('callscreen', {
// //       state: {
// //         roomId: currentEmail,
// //       peerEmail,
// //       fcmToken,
// //       accessToken,
// //       selfFcmToken,
// //       avatar,
// //       avatars,
// //       selfAccessToken,
// //       isVideoCall: isVideo,
// //       isCaller: true,
// //       isTypeJoin: false,
// //       }
// //     });

// //   } catch (error) {
// //     console.log("Call initiation error:", error);
    
// //     // Even if there's an error, try to cleanup any partial state
// //     try {
// //       await supabase
// //         .from("users")
// //         .update({
// //           iscallingfrom: "",
// //           isoncallstatus: false,
// //         })
// //         .eq("email", auth?.currentUser?.email);
// //     } catch (cleanupError) {
// //       console.log('Cleanup error:', cleanupError);
// //     }
    
// //     alert('Call error', error?.message || 'Failed to start call');
// //   }
// // };





// const initiateCall = async (isVideo) => {
//   try {
//     const peerEmail = auth?.currentUser?.email;
//      console.log('print the peerEmail',peerEmail);

//     const currentUserEmail = auth?.currentUser?.email;
    
//     if (!currentUserEmail || !peerEmail) {
//       alert('Error', 'User information missing');
//       return;
//     }

//     console.log('Initiating call:', { currentUserEmail, peerEmail, isVideo });

//     // Enhanced status checking with network resilience
//     const { data: currentUser, error: currentError } = await supabase
//       .from("users")
//       .select("isoncallstatus, iscallingfrom, lastcallroom, updatedat")
//       .eq("email", currentUserEmail)
//       .single();

//     const { data: peerUser, error: peerError } = await supabase
//       .from("users")
//       .select("isoncallstatus, iscallingfrom, lastcallroom, updatedat")
//       .eq("email", peerEmail)
//       .single();

//     if (currentError) {
//       console.log('Error fetching current user status:', currentError);
//     }

//     if (peerError) {
//       console.log('Error fetching peer user status:', peerError);
//     }

//     // Enhanced busy check with stale call detection
//     const isCurrentUserBusy = await checkIfActuallyBusy(currentUser);
//     const isPeerUserBusy = await checkIfActuallyBusy(peerUser);

//     if (isCurrentUserBusy || isPeerUserBusy) {
//       alert('User is Busy', 'One of the users is already on another call');
      
//       // Auto-cleanup if stale call detected
//       if (isCurrentUserBusy && await isStaleCall(currentUser)) {
//         await cleanupStaleCall(currentUserEmail);
//       }
//       if (isPeerUserBusy && await isStaleCall(peerUser)) {
//         await cleanupStaleCall(peerEmail);
//       }
      
//       return;
//     }

//     // Update user status before navigation
//     try {
//       const { error: updateError } = await supabase
//         .from("users")
//         .update({
//           iscallingfrom: peerEmail,
//           isoncallstatus: true,
//           isvideocall: isVideo,
//           updatedat: new Date().toISOString()
//         })
//         .eq("email", currentUserEmail);

//       if (updateError) {
//         console.log('Error updating user status:', updateError);
//         throw updateError;
//       }

//       console.log('User status updated successfully');

//     } catch (updateError) {
//       console.log('Failed to update user status:', updateError);
//       // Continue with call anyway - don't block the call due to status update failure
//     }

//     // Prepare navigation data
//     const callData = {
//       roomId: currentUserEmail, // Using email as room ID
//       peerEmail,
//       // fcmToken,
//       // accessToken,
//       // selfFcmToken,
//       // avatar,
//       // avatars,
//       // selfAccessToken,
//       isVideoCall: isVideo,
//       isCaller: true,
//       isTypeJoin: false,
//     };

//     console.log('Navigating to call screen with data:', callData);

//     // Navigate to call screen
//     navigate('/callscreen', { 
//       state: callData 
//     });

//   } catch (error) {
//     console.error("Call initiation error:", error);
    
//     // Cleanup any partial state on error
//     try {
//       await supabase
//         .from("users")
//         .update({
//           iscallingfrom: "",
//           isoncallstatus: false,
//           isvideocall: false,
//         })
//         .eq("email", auth?.currentUser?.email);
//     } catch (cleanupError) {
//       console.log('Cleanup error:', cleanupError);
//     }
    
//     alert('Call Error', error?.message || 'Failed to start call. Please try again.');
//   }
// };

// // Helper functions
// const checkIfActuallyBusy = async (user) => {
//   if (!user?.isoncallstatus) return false;
  
//   // Check if this is a stale call (more than 2 minutes old)
//   if (await isStaleCall(user)) {
//     console.log('Detected stale call, considering user as available');
//     return false;
//   }
  
//   return true;
// };

// const isStaleCall = async (user) => {
//   if (!user?.updatedat) return true; // No timestamp, consider stale
  
//   const lastUpdate = new Date(user.updatedat);
//   const now = new Date();
//   const diffMinutes = (now - lastUpdate) / (1000 * 60);
  
//   return diffMinutes > 2; // More than 2 minutes old
// };

// const cleanupStaleCall = async (email) => {
//   try {
//     console.log('Cleaning up stale call for:', email);
    
//     const { error } = await supabase
//       .from("users")
//       .update({
//         iscallingfrom: "",
//         isoncallstatus: false,
//         iscallerhangup: false,
//         lastcallroom: null,
//         isvideocall: false,
//         isvideoon: false,
//         updatedat: new Date().toISOString()
//       })
//       .eq("email", email);

//     if (error) {
//       console.error('Error cleaning up stale call:', error);
//     } else {
//       console.log('✅ Stale call cleaned up for:', email);
//     }
//   } catch (error) {
//     console.error('Exception during stale call cleanup:', error);
//   }
// };




//   // Check if user is blocked
//   const checkIfBlocked = async () => {
//     const userEmail = auth?.currentUser?.email;
//     if (!userEmail || !partnerEmail) return;

//     try {
//       const { data, error } = await supabase
//         .from("blockusers")
//         .select("TotalBlockUser")
//         .eq("email", userEmail)
//         .single();

//       if (error && error.code !== "PGRST116") {
//         console.error("❌ checkIfBlocked error:", error);
//         return;
//       }

//       const blockedList = Array.isArray(data?.TotalBlockUser) ? data.TotalBlockUser : [];
//       setIsBlocked(blockedList.some((u) => u.email === partnerEmail));
//     } catch (error) {
//       console.error("❌ checkIfBlocked error:", error);
//     }
//   };

//   // Block status monitoring
//   useEffect(() => {
//     const currentEmail = auth?.currentUser?.email;
//     if (!currentEmail || !partnerEmail) return;

//     const checkBlockStatus = async () => {
//       try {
//         // Check if I blocked them
//         const { data: myBlockData } = await supabase
//           .from("blockusers")
//           .select("TotalBlockUser")
//           .eq("email", currentEmail)
//           .single();

//         const iBlockedThem = Array.isArray(myBlockData?.TotalBlockUser)
//           ? myBlockData.TotalBlockUser.some((u) => u.email === partnerEmail)
//           : false;

//         // Check if they blocked me
//         const { data: targetBlockData } = await supabase
//           .from("blockusers")
//           .select("TotalBlockUser")
//           .eq("email", partnerEmail)
//           .single();

//         const theyBlockedMe = Array.isArray(targetBlockData?.TotalBlockUser)
//           ? targetBlockData.TotalBlockUser.some((u) => u.email === currentEmail)
//           : false;

//         setIsChatDisabled(iBlockedThem || theyBlockedMe);
//         setIsBlocked(iBlockedThem);
//       } catch (err) {
//         console.error("❌ checkBlockStatus error:", err);
//       }
//     };

//     checkBlockStatus();

//     // Realtime subscription for block status changes
//     const channel = supabase
//       .channel(`blockusers-changes-${currentEmail}-${partnerEmail}`)
//       .on(
//         "postgres_changes",
//         {
//           event: "*",
//           schema: "public",
//           table: "blockusers",
//           filter: `email=in.(${currentEmail},${partnerEmail})`,
//         },
//         () => {
//           checkBlockStatus();
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [partnerEmail]);

//   // Fetch messages
//   useEffect(() => {
//     if (!chatId) return;

//     let isMounted = true;
//     const loadMessages = async () => {
//       try {
//         const { data, error } = await supabase
//           .from("chat_messages")
//           .select("id, chat_id, user_email, message")
//           .eq("chat_id", chatId)
//           .order("id", { ascending: true });

//         if (error) {
//           console.error("Error loading messages:", error);
//           return;
//         }
//         if (!isMounted) return;

//         const normalized = (data || []).map((d) => ({
//           _id: d.id || d.message?._id || uuidv4(),
//           createdAt: d.message?.createdAt || new Date().toISOString(),
//           text: d.message?.text ?? d.message?.text ?? null,
//           image: d.message?.image ?? null,
//           video: d.message?.video ?? null,
//           status: d.message?.status ?? "sent",
//           user: d.message?.user ?? { _id: d.user_email, name: d.user_email },
//         }));

//         setMessages(normalized);
//       } catch (err) {
//         console.error("loadMessages error:", err);
//       }
//     };

//     loadMessages();

//     return () => {
//       isMounted = false;
//     };
//   }, [chatId]);

//   // Realtime messages listener
//   useEffect(() => {
//     if (!chatId) return;

//     if (messagesChannelRef.current) {
//       supabase.removeChannel(messagesChannelRef.current);
//       messagesChannelRef.current = null;
//     }

//     const channel = supabase
//       .channel(`chat_messages_listener_${chatId}`)
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "chat_messages",
//           filter: `chat_id=eq.${chatId}`,
//         },
//         (payload) => {
//           try {
//             const d = payload.new;
//             const msgObj = d.message || {};
//             const normalized = {
//               _id: d.id || msgObj._id || uuidv4(),
//               createdAt: msgObj.createdAt || new Date().toISOString(),
//               text: msgObj.text ?? null,
//               image: msgObj.image ?? null,
//               video: msgObj.video ?? null,
//               status: msgObj.status ?? "sent",
//               user: msgObj.user ?? { _id: d.user_email, name: d.user_email },
//             };

//             setMessages((prev) => {
//               const exists = prev.some(
//                 (m) =>
//                   m._id === normalized._id ||
//                   (m.createdAt === normalized.createdAt &&
//                     m.user?._id === normalized.user?._id &&
//                     m.text === normalized.text)
//               );
//               if (exists) return prev;
//               return [...prev, normalized];
//             });
//           } catch (err) {
//             console.error("Realtime message processing error:", err);
//           }
//         }
//       )
//       .subscribe();

//     messagesChannelRef.current = channel;

//     return () => {
//       if (messagesChannelRef.current) {
//         supabase.removeChannel(messagesChannelRef.current);
//         messagesChannelRef.current = null;
//       }
//     };
//   }, [chatId]);

//   // Auto-scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Typing indicator
//   const handleChangeText = useCallback(
//     (value) => {
//       setInputText(value);
//       if (!chatId || !currentEmail) return;
      
//       setTypingStatus(chatId, currentEmail, true);
//       setIsTyping(true);

//       if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
//       typingTimeoutRef.current = setTimeout(() => {
//         setTypingStatus(chatId, currentEmail, false);
//         setIsTyping(false);
//       }, 1500);
//     },
//     [chatId, currentEmail]
//   );

//   // Message sending functions
//   const sendMessage = async (chatIdParam, text) => {
//     if (!chatIdParam || !currentEmail) throw new Error("Missing chatId or user");
    
//     const nowISO = new Date().toISOString();
//     const optimistic = {
//       _id: uuidv4(),
//       createdAt: nowISO,
//       text,
//       status: "sending",
//       user: {
//         _id: currentEmail,
//         name: auth.currentUser?.displayName || currentEmail,
//         avatar: auth.currentUser?.photoURL || null,
//       },
//     };

//     setMessages((prev) => [...prev, optimistic]);
//     setInputText("");
//     setTypingStatus(chatIdParam, currentEmail, false);
//     setIsTyping(false);

//     try {
//       const { error } = await supabase.from("chat_messages").insert([
//         {
//           chat_id: chatIdParam,
//           user_email: currentEmail,
//           message: optimistic,
//         },
//       ]);

//       if (error) throw error;

//       await supabase
//         .from("chats")
//         .update({ last_message: text, last_updated: new Date().toISOString() })
//         .eq("id", chatIdParam);
//     } catch (err) {
//       console.error("sendMessage error:", err);
//       setMessages((prev) =>
//         prev.map((m) => (m._id === optimistic._id ? { ...m, status: "failed" } : m))
//       );
//       alert("Failed to send message");
//     }
//   };

//   const sendMessageWithImage = async (chatIdParam, imageUrl) => {
//     if (!chatIdParam || !currentEmail) throw new Error("Missing chatId or user");
    
//     const nowISO = new Date().toISOString();
//     const msg = {
//       _id: uuidv4(),
//       createdAt: nowISO,
//       text: "",
//       image: imageUrl,
//       status: "sending",
//       user: {
//         _id: currentEmail,
//         name: auth.currentUser?.displayName || currentEmail,
//         avatar: auth.currentUser?.photoURL || null,
//       },
//     };

//     setMessages((prev) => [...prev, msg]);
    
//     try {
//       const { error } = await supabase.from("chat_messages").insert([
//         {
//           chat_id: chatIdParam,
//           user_email: currentEmail,
//           message: msg,
//         },
//       ]);

//       if (error) throw error;

//       await supabase
//         .from("chats")
//         .update({ last_message: "[gift 🎁]", last_updated: new Date().toISOString() })
//         .eq("id", chatIdParam);
//     } catch (err) {
//       console.error("sendMessageWithImage error:", err);
//       setMessages((prev) =>
//         prev.map((m) => (m._id === msg._id ? { ...m, status: "failed" } : m))
//       );
//       alert("Failed to send sticker");
//     }
//   };

//   const sendMessageWithMedia = async (chatIdParam, mediaUrl, type) => {
//     const nowISO = new Date().toISOString();
//     const msg = {
//       _id: uuidv4(),
//       createdAt: nowISO,
//       text: null,
//       [type]: mediaUrl,
//       type,
//       status: "sending",
//       user: {
//         _id: currentEmail,
//         name: auth.currentUser?.displayName || currentEmail,
//         avatar: auth.currentUser?.photoURL || null,
//       },
//     };

//     setMessages((prev) => [...prev, msg]);

//     try {
//       const { error } = await supabase.from("chat_messages").insert([
//         {
//           chat_id: chatIdParam,
//           user_email: currentEmail,
//           message: msg,
//         },
//       ]);
      
//       if (error) throw error;
//     } catch (err) {
//       console.error("sendMessageWithMedia error:", err);
//       setMessages((prev) =>
//         prev.map((m) => (m._id === msg._id ? { ...m, status: "failed" } : m))
//       );
//       alert("Failed to send media");
//     }
//   };

//   // Media handling
//   const pickMedia = useCallback(() => {
//     const input = document.createElement("input");
//     input.type = "file";
//     input.accept = "image/*,video/*";
//     input.onchange = async (e) => {
//       const file = e.target.files[0];
//       if (!file) return;
//       const fileType = file.type.startsWith("image") ? "image" : "video";
//       await handleMediaUpload(chatId, file, fileType);
//     };
//     input.click();
//   }, [chatId]);

//   const handleMediaUpload = async (chatIdParam, file, type) => {
//     try {
//       setUploading(true);

//       const ext = file.name.split(".").pop() || (type === "image" ? "jpg" : "mp4");
//       const filePath = `${currentEmail}/${type === "image" ? "images" : "videos"}/${Date.now()}.${ext}`;

//       const { error: uploadError } = await supabase.storage
//         .from("chat_messages")
//         .upload(filePath, file, { contentType: file.type });

//       if (uploadError) throw uploadError;

//       const { data: publicUrlData } = supabase.storage
//         .from("chat_messages")
//         .getPublicUrl(filePath);
//       const publicUrl = publicUrlData?.publicUrl;

//       if (!publicUrl) throw new Error("No public URL returned");

//       await sendMessageWithMedia(chatIdParam, publicUrl, type);
//     } catch (err) {
//       console.error("handleMediaUpload failed:", err);
//       alert("Upload failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   // Sticker sending
//   const handleSendSticker = async () => {
//     if (!selectedSticker) return;
    
//     try {
//       const userEmail = currentEmail;
//       const { data: userData } = await supabase
//         .from("users")
//         .select("totalgold, totaldiamond")
//         .eq("email", userEmail)
//         .single();

//       const cost = (selectedSticker.coins || 0) * quantity;
//       const isGold = activeTab === "gold";
//       const currentBalance = isGold ? userData?.totalgold || 0 : userData?.totaldiamond || 0;

//       if (cost > currentBalance) {
//         alert(`Insufficient ${isGold ? "Gold" : "Diamond"} Coins`);
//         return;
//       }

//       const updateField = isGold
//         ? { totalgold: currentBalance - cost }
//         : { totaldiamond: currentBalance - cost };
      
//       await supabase.from("users").update(updateField).eq("email", userEmail);
//       await sendMessageWithImage(chatId, selectedSticker.imageUrl);
//       closeStickerModal();
//     } catch (err) {
//       console.error("handleSendSticker error:", err);
//       alert("Failed to send gift");
//     }
//   };

//   const closeStickerModal = () => {
//     setShowStickerPicker(false);
//     setSelectedSticker(null);
//   };

//   // Timer effect
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft((prev) => (prev <= 1 ? 60 * 60 : prev - 1));
//     }, 1000);
    
//     return () => clearInterval(timer);
//   }, []);

//   // Fetch user balances
//   useEffect(() => {
//     const fetchBalances = async () => {
//       try {
//         if (!currentEmail) return;
//         const { data } = await supabase
//           .from("users")
//           .select("totalgold, totaldiamond")
//           .eq("email", currentEmail)
//           .single();
        
//         if (data) {
//           setUserGold(data.totalgold || 0);
//           setUserDiamond(data.totaldiamond || 0);
//         }
//       } catch (err) {
//         console.error("fetch balances err", err);
//       }
//     };

//     fetchBalances();
//   }, [currentEmail]);

//   // UI Components
//   const Header = () => (
//     <div className="header">
//       <button onClick={() => navigate(-1)} className="backButton">
//         <IoIosArrowBack size={24} />
//       </button>

//       <img
//         src={params.avatar || params.image || "https://i.pravatar.cc/300"}
//         className="avatar"
//         alt={params.name || params.email || "User"}
//       />

//       <div className="headerTextContainer">
//         <div className="headerName">{params.name || params.email || "Unknown User"}</div>
//         <div className="headerStatus">
//           {isTyping ? "typing..." : isOnline ? "online" : "offline"}
//         </div>
//       </div>

//       <div className="headerActions">
//         <button
//           className="callButton"
//           onClick={() => {
//             if (isChatDisabled) {
//               alert("Blocked", "You can't call this user.");
//             } else {
//                initiateCall(false);
//               //  alert("Call functionality placeholder");
//             }
//           }}
//         >
//           <IoIosCall size={20} />
//         </button>
        
//         <button
//           className="videoCallButton"
//           onClick={() => {
//             if (isChatDisabled) {
//               alert("Blocked", "You can't video call this user.");
//             } else {
//                initiateCall(true);
//               // alert("Video call functionality placeholder");
//             }
//           }}
//         >
//           <IoIosVideocam size={20} />
//         </button>
//       </div>
//     </div>
//   );

//   const MessageBubble = React.memo(({ message }) => {
//     const isSelf = message.user?._id === currentEmail;
    
//     return (
//       <div className={`messageContainer ${isSelf ? "selfMessageContainer" : "otherMessageContainer"}`}>
//         <div className={`messageBubble ${isSelf ? "selfBubble" : "otherBubble"}`}>
//           {message.image && (
//             <img src={message.image} className="messageImage" alt="img" loading="lazy" />
//           )}
          
//           {message.video && (
//             <div className="videoContainer">
//               <video src={message.video} className="messageVideo" controls />
//             </div>
//           )}
          
//           {message.text && (
//             <div className={`messageText ${isSelf ? "selfMessageText" : "otherMessageText"}`}>
//               {message.text}
//             </div>
//           )}
          
//           <div className="messageMeta">
//             <span className="messageTime">
//               {new Date(message.createdAt).toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })}
//             </span>
            
//             {isSelf && (
//               <span className="messageStatus">
//                 {message.status === "failed" ? "!" : message.status === "sending" ? "…" : "✓"}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   });

//   const StickerModal = () => (
//     <div className="modalOverlay" onClick={closeStickerModal}>
//       <div className="stickerModal" onClick={(e) => e.stopPropagation()}>
//         <div className="banner">
//           <div className="bannerContent">
//             <MdLocalOffer /> 
//             <span style={{ marginLeft: 8 }}>
//               Get newbie bonus, recharge for free lottery.
//             </span>
//           </div>
//           <div className="timerBox">
//             <span>
//               {Math.floor(timeLeft / 60)
//                 .toString()
//                 .padStart(2, "0")}
//               :{(timeLeft % 60).toString().padStart(2, "0")}
//             </span>
//           </div>
//         </div>

//         <div className="stickerModalHeader">
//           <h3>Send a Gift</h3>
//           <div className="headerRight">
//             <div className="coinsBox">
//               <div className="coinItem">
//                 <MdDiamond size={16} />
//                 <span style={{ marginLeft: 6 }}>{userDiamond}</span>
//               </div>
//               <div className="coinItem">
//                 <FaCoins size={16} />
//                 <span style={{ marginLeft: 6 }}>{userGold}</span>
//               </div>
//             </div>
//             <button className="closeButton" onClick={closeStickerModal}>
//               <IoIosClose />
//             </button>
//           </div>
//         </div>

//         <div className="tabRow">
//           <button
//             className={`tabButton ${activeTab === "gold" ? "activeTab" : ""}`}
//             onClick={() => setActiveTab("gold")}
//           >
//             <FaCoins /> <span style={{ marginLeft: 6 }}>Gold</span>
//           </button>
          
//           <button
//             className={`tabButton ${activeTab === "diamond" ? "activeTab" : ""}`}
//             onClick={() => setActiveTab("diamond")}
//           >
//             <MdDiamond /> <span style={{ marginLeft: 6 }}>Diamond</span>
//           </button>
//         </div>

//         {stickersLoading ? (
//           <div className="loadingContainer">Loading...</div>
//         ) : (
//           <div className="listContainer">
//             {filteredGifts().map((it, idx) => (
//               <button
//                 key={idx}
//                 className={`stickerItem ${selectedSticker === it ? "selectedSticker" : ""}`}
//                 onClick={() => setSelectedSticker(it)}
//               >
//                 <div className="stickerImageContainer">
//                   <img src={it.imageUrl} alt={it.name} className="stickerImage" />
//                   {it.isNew && <span className="newBadge">NEW</span>}
//                 </div>
//                 <div className="coinRow">
//                   <span>{it.coins}</span>
//                 </div>
//               </button>
//             ))}
//           </div>
//         )}

//         <div className="footer">
//           <div className="recipientInfo">
//             <div className="recipientAvatar">
//               {params.name?.charAt(0) || "U"}
//             </div>
//             <span className="recipientName">{params.name || "User"}</span>
//           </div>

//           <select
//             value={quantity}
//             onChange={(e) => setQuantity(Number(e.target.value))}
//             className="dropdown"
//           >
//             {Array.from({ length: 10 }, (_, i) => (
//               <option key={i + 1} value={i + 1}>
//                 {i + 1}
//               </option>
//             ))}
//           </select>

//           <button
//             className="sendButton"
//             onClick={handleSendSticker}
//             disabled={!selectedSticker}
//           >
//             Send{selectedSticker ? ` (${selectedSticker.coins * quantity})` : ""}
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="chatContainer">
//       {uploading && (
//         <div className="uploadOverlay">
//           <div className="activityIndicator" />
//           <div className="uploadText">Uploading...</div>
//         </div>
//       )}

//       <Header />

//       <div className="messagesContainer">
//         {messages.map((m, idx) => (
//           <MessageBubble key={m._id || idx} message={m} />
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {showStickerPicker && <StickerModal />}

//       <div className="inputContainer">
//         <button
//           className="iconButton"
//           onClick={() => setShowStickerPicker(true)}
//           disabled={isChatDisabled}
//         >
//           <IoIosGift size={24} />
//         </button>

//         <input
//           className="messageInput"
//           placeholder={
//             isChatDisabled ? "You can't send messages to this user" : "Type a message..."
//           }
//           value={inputText}
//           onChange={(e) => handleChangeText(e.target.value)}
//           disabled={isChatDisabled}
//           onKeyDown={(e) => {
//             if (e.key === "Enter") {
//               e.preventDefault();
//               sendMessage(chatId, inputText.trim());
//             }
//           }}
//         />

//         <button
//           className="iconButton"
//           onClick={pickMedia}
//           disabled={isChatDisabled || uploading}
//         >
//           <IoIosImages size={24} />
//         </button>

//         <button
//           className={`sendButton ${!inputText.trim() ? "sendButtonDisabled" : ""}`}
//           onClick={() => sendMessage(chatId, inputText.trim())}
//           disabled={!inputText.trim() || isChatDisabled || uploading}
//         >
//           <IoIosSend size={20} />
//         </button>
//       </div>

//          {showIncomingCall && callerInfo && (
//           <IncomingCallScreen
//             callerName={callerInfo.name}
//             callerImage={callerInfo.image}
//             onAccept={handleAcceptCall}
//             onReject={handleRejectCall}
//             isVideoCall={true}
//             ringtone={ringtone}
//             stopRingtone={stopRingtone}
//           />
//         )}
//     </div>
//   );
// }






import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  IoIosSend,
  IoIosImages,
  IoIosGift,
  IoIosArrowBack,
  IoIosCall,
  IoIosVideocam,
  IoIosClose,
} from "react-icons/io";
import { MdDiamond, MdLocalOffer } from "react-icons/md";
import { FaCoins } from "react-icons/fa";

import { auth } from "../../firebase/config";
import { supabase } from "../../firebase/supabaseClient";
import { setTypingStatus } from "./setTypingStatus";
import usePaidStickers from "./usePaidStickers";
import "./Chat.css";

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = location.state || {};

  // State declarations
  const chatId = params.id;
  const partnerEmail = params.email;
  const currentEmail = auth?.currentUser?.email;

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [isChatDisabled, setIsChatDisabled] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("gold");
  const [userGold, setUserGold] = useState(0);
  const [userDiamond, setUserDiamond] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const [callerInfo, setCallerInfo] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  // Refs
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesChannelRef = useRef(null);
  const audioRecorderRef = useRef(null);

  // Hooks
  const { giftImages, loading: stickersLoading } = usePaidStickers();

  const filteredGifts = useCallback(
    () =>
      (giftImages || []).filter((item) =>
        activeTab === "diamond" ? item.isTypeDiamond : !item.isTypeDiamond
      ),
    [giftImages, activeTab]
  );

  // Block user functionality
  const handleBlockToggle = async () => {
    const userEmail = auth?.currentUser?.email;
    if (!userEmail || !partnerEmail) return;

    try {
      const { data, error } = await supabase
        .from("blockusers")
        .select("TotalBlockUser")
        .eq("email", userEmail)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("❌ handleBlockToggle fetch error:", error);
        return;
      }

      let currentList = Array.isArray(data?.TotalBlockUser) ? data.TotalBlockUser : [];
      let updatedList;

      if (isBlocked) {
        // Unblock
        updatedList = currentList.filter((u) => u.email !== partnerEmail);
      } else {
        // Block
        updatedList = [...currentList, { isblock: true, email: partnerEmail }];
      }

      const { error: upsertError } = await supabase
        .from("blockusers")
        .upsert({
          email: userEmail,
          TotalBlockUser: updatedList,
        });

      if (upsertError) {
        console.error("❌ handleBlockToggle update error:", upsertError);
      } else {
        const newBlocked = !isBlocked;
        setIsBlocked(newBlocked);
        setIsChatDisabled(newBlocked);
        console.log(`✅ ${newBlocked ? "Blocked" : "Unblocked"} user: ${partnerEmail}`);
      }
    } catch (error) {
      console.error("❌ handleBlockToggle error:", error);
    }
  };

  const handleAcceptCall = async () => {
    try {
      setShowIncomingCall(false);
      
      const roomId = auth?.currentUser?.email;
      const peerEmail = auth?.currentUser?.email;

      navigate('JoinScreen', {
        roomId,
        peerEmail,
        isVideoCall: true,
        isCaller: false,
        isTypeJoin: true,
      });
    } catch (error) {
      console.log('Error accepting call:', error);
    }
  };

  const initiateCall = async (isVideo) => {
    try {
      const peerEmail = auth?.currentUser?.email;
      console.log('print the peerEmail',peerEmail);

      const currentUserEmail = auth?.currentUser?.email;
      
      if (!currentUserEmail || !peerEmail) {
        alert('Error', 'User information missing');
        return;
      }

      console.log('Initiating call:', { currentUserEmail, peerEmail, isVideo });

      // Enhanced status checking with network resilience
      const { data: currentUser, error: currentError } = await supabase
        .from("users")
        .select("isoncallstatus, iscallingfrom, lastcallroom, updatedat")
        .eq("email", currentUserEmail)
        .single();

      const { data: peerUser, error: peerError } = await supabase
        .from("users")
        .select("isoncallstatus, iscallingfrom, lastcallroom, updatedat")
        .eq("email", peerEmail)
        .single();

      if (currentError) {
        console.log('Error fetching current user status:', currentError);
      }

      if (peerError) {
        console.log('Error fetching peer user status:', peerError);
      }

      // Enhanced busy check with stale call detection
      const isCurrentUserBusy = await checkIfActuallyBusy(currentUser);
      const isPeerUserBusy = await checkIfActuallyBusy(peerUser);

      if (isCurrentUserBusy || isPeerUserBusy) {
        alert('User is Busy', 'One of the users is already on another call');
        
        // Auto-cleanup if stale call detected
        if (isCurrentUserBusy && await isStaleCall(currentUser)) {
          await cleanupStaleCall(currentUserEmail);
        }
        if (isPeerUserBusy && await isStaleCall(peerUser)) {
          await cleanupStaleCall(peerEmail);
        }
        
        return;
      }

      // Update user status before navigation
      try {
        const { error: updateError } = await supabase
          .from("users")
          .update({
            iscallingfrom: peerEmail,
            isoncallstatus: true,
            isvideocall: isVideo,
            updatedat: new Date().toISOString()
          })
          .eq("email", currentUserEmail);

        if (updateError) {
          console.log('Error updating user status:', updateError);
          throw updateError;
        }

        console.log('User status updated successfully');

      } catch (updateError) {
        console.log('Failed to update user status:', updateError);
        // Continue with call anyway - don't block the call due to status update failure
      }

      // Prepare navigation data
      const callData = {
        roomId: currentUserEmail, // Using email as room ID
        peerEmail,
        isVideoCall: isVideo,
        isCaller: true,
        isTypeJoin: false,
      };

      console.log('Navigating to call screen with data:', callData);

      // Navigate to call screen
      navigate('/callscreen', { 
        state: callData 
      });

    } catch (error) {
      console.error("Call initiation error:", error);
      
      // Cleanup any partial state on error
      try {
        await supabase
          .from("users")
          .update({
            iscallingfrom: "",
            isoncallstatus: false,
            isvideocall: false,
          })
          .eq("email", auth?.currentUser?.email);
      } catch (cleanupError) {
        console.log('Cleanup error:', cleanupError);
      }
      
      alert('Call Error', error?.message || 'Failed to start call. Please try again.');
    }
  };

  // Helper functions
  const checkIfActuallyBusy = async (user) => {
    if (!user?.isoncallstatus) return false;
    
    // Check if this is a stale call (more than 2 minutes old)
    if (await isStaleCall(user)) {
      console.log('Detected stale call, considering user as available');
      return false;
    }
    
    return true;
  };

  const isStaleCall = async (user) => {
    if (!user?.updatedat) return true; // No timestamp, consider stale
    
    const lastUpdate = new Date(user.updatedat);
    const now = new Date();
    const diffMinutes = (now - lastUpdate) / (1000 * 60);
    
    return diffMinutes > 2; // More than 2 minutes old
  };

  const cleanupStaleCall = async (email) => {
    try {
      console.log('Cleaning up stale call for:', email);
      
      const { error } = await supabase
        .from("users")
        .update({
          iscallingfrom: "",
          isoncallstatus: false,
          iscallerhangup: false,
          lastcallroom: null,
          isvideocall: false,
          isvideoon: false,
          updatedat: new Date().toISOString()
        })
        .eq("email", email);

      if (error) {
        console.error('Error cleaning up stale call:', error);
      } else {
        console.log('✅ Stale call cleaned up for:', email);
      }
    } catch (error) {
      console.error('Exception during stale call cleanup:', error);
    }
  };

  // Check if user is blocked
  const checkIfBlocked = async () => {
    const userEmail = auth?.currentUser?.email;
    if (!userEmail || !partnerEmail) return;

    try {
      const { data, error } = await supabase
        .from("blockusers")
        .select("TotalBlockUser")
        .eq("email", userEmail)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("❌ checkIfBlocked error:", error);
        return;
      }

      const blockedList = Array.isArray(data?.TotalBlockUser) ? data.TotalBlockUser : [];
      setIsBlocked(blockedList.some((u) => u.email === partnerEmail));
    } catch (error) {
      console.error("❌ checkIfBlocked error:", error);
    }
  };

  // Block status monitoring
  useEffect(() => {
    const currentEmail = auth?.currentUser?.email;
    if (!currentEmail || !partnerEmail) return;

    const checkBlockStatus = async () => {
      try {
        // Check if I blocked them
        const { data: myBlockData } = await supabase
          .from("blockusers")
          .select("TotalBlockUser")
          .eq("email", currentEmail)
          .single();

        const iBlockedThem = Array.isArray(myBlockData?.TotalBlockUser)
          ? myBlockData.TotalBlockUser.some((u) => u.email === partnerEmail)
          : false;

        // Check if they blocked me
        const { data: targetBlockData } = await supabase
          .from("blockusers")
          .select("TotalBlockUser")
          .eq("email", partnerEmail)
          .single();

        const theyBlockedMe = Array.isArray(targetBlockData?.TotalBlockUser)
          ? targetBlockData.TotalBlockUser.some((u) => u.email === currentEmail)
          : false;

        setIsChatDisabled(iBlockedThem || theyBlockedMe);
        setIsBlocked(iBlockedThem);
      } catch (err) {
        console.error("❌ checkBlockStatus error:", err);
      }
    };

    checkBlockStatus();

    // Realtime subscription for block status changes
    const channel = supabase
      .channel(`blockusers-changes-${currentEmail}-${partnerEmail}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "blockusers",
          filter: `email=in.(${currentEmail},${partnerEmail})`,
        },
        () => {
          checkBlockStatus();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [partnerEmail]);

  // Fetch messages
  useEffect(() => {
    if (!chatId) return;

    let isMounted = true;
    const loadMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("chat_messages")
          .select("id, chat_id, user_email, message")
          .eq("chat_id", chatId)
          .order("id", { ascending: true });

        if (error) {
          console.error("Error loading messages:", error);
          return;
        }
        if (!isMounted) return;

        const normalized = (data || []).map((d) => ({
          _id: d.id || d.message?._id || uuidv4(),
          createdAt: d.message?.createdAt || new Date().toISOString(),
          text: d.message?.text ?? d.message?.text ?? null,
          image: d.message?.image ?? null,
          video: d.message?.video ?? null,
          status: d.message?.status ?? "sent",
          user: d.message?.user ?? { _id: d.user_email, name: d.user_email },
        }));

        setMessages(normalized);
      } catch (err) {
        console.error("loadMessages error:", err);
      }
    };

    loadMessages();

    return () => {
      isMounted = false;
    };
  }, [chatId]);

  // Realtime messages listener
  useEffect(() => {
    if (!chatId) return;

    if (messagesChannelRef.current) {
      supabase.removeChannel(messagesChannelRef.current);
      messagesChannelRef.current = null;
    }

    const channel = supabase
      .channel(`chat_messages_listener_${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          try {
            const d = payload.new;
            const msgObj = d.message || {};
            const normalized = {
              _id: d.id || msgObj._id || uuidv4(),
              createdAt: msgObj.createdAt || new Date().toISOString(),
              text: msgObj.text ?? null,
              image: msgObj.image ?? null,
              video: msgObj.video ?? null,
              status: msgObj.status ?? "sent",
              user: msgObj.user ?? { _id: d.user_email, name: d.user_email },
            };

            setMessages((prev) => {
              const exists = prev.some(
                (m) =>
                  m._id === normalized._id ||
                  (m.createdAt === normalized.createdAt &&
                    m.user?._id === normalized.user?._id &&
                    m.text === normalized.text)
              );
              if (exists) return prev;
              return [...prev, normalized];
            });
          } catch (err) {
            console.error("Realtime message processing error:", err);
          }
        }
      )
      .subscribe();

    messagesChannelRef.current = channel;

    return () => {
      if (messagesChannelRef.current) {
        supabase.removeChannel(messagesChannelRef.current);
        messagesChannelRef.current = null;
      }
    };
  }, [chatId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Typing indicator
  const handleChangeText = useCallback(
    (value) => {
      setInputText(value);
      if (!chatId || !currentEmail) return;
      
      setTypingStatus(chatId, currentEmail, true);
      setIsTyping(true);

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setTypingStatus(chatId, currentEmail, false);
        setIsTyping(false);
      }, 1500);
    },
    [chatId, currentEmail]
  );

  // Message sending functions
  const sendMessage = async (chatIdParam, text) => {
    if (!chatIdParam || !currentEmail) throw new Error("Missing chatId or user");
    
    const nowISO = new Date().toISOString();
    const optimistic = {
      _id: uuidv4(),
      createdAt: nowISO,
      text,
      status: "sending",
      user: {
        _id: currentEmail,
        name: auth.currentUser?.displayName || currentEmail,
        avatar: auth.currentUser?.photoURL || null,
      },
    };

    setMessages((prev) => [...prev, optimistic]);
    setInputText("");
    setTypingStatus(chatIdParam, currentEmail, false);
    setIsTyping(false);

    try {
      const { error } = await supabase.from("chat_messages").insert([
        {
          chat_id: chatIdParam,
          user_email: currentEmail,
          message: optimistic,
        },
      ]);

      if (error) throw error;

      await supabase
        .from("chats")
        .update({ last_message: text, last_updated: new Date().toISOString() })
        .eq("id", chatIdParam);
    } catch (err) {
      console.error("sendMessage error:", err);
      setMessages((prev) =>
        prev.map((m) => (m._id === optimistic._id ? { ...m, status: "failed" } : m))
      );
      alert("Failed to send message");
    }
  };

  const sendMessageWithImage = async (chatIdParam, imageUrl) => {
    if (!chatIdParam || !currentEmail) throw new Error("Missing chatId or user");
    
    const nowISO = new Date().toISOString();
    const msg = {
      _id: uuidv4(),
      createdAt: nowISO,
      text: "",
      image: imageUrl,
      status: "sending",
      user: {
        _id: currentEmail,
        name: auth.currentUser?.displayName || currentEmail,
        avatar: auth.currentUser?.photoURL || null,
      },
    };

    setMessages((prev) => [...prev, msg]);
    
    try {
      const { error } = await supabase.from("chat_messages").insert([
        {
          chat_id: chatIdParam,
          user_email: currentEmail,
          message: msg,
        },
      ]);

      if (error) throw error;

      await supabase
        .from("chats")
        .update({ last_message: "[gift 🎁]", last_updated: new Date().toISOString() })
        .eq("id", chatIdParam);
    } catch (err) {
      console.error("sendMessageWithImage error:", err);
      setMessages((prev) =>
        prev.map((m) => (m._id === msg._id ? { ...m, status: "failed" } : m))
      );
      alert("Failed to send sticker");
    }
  };

  const sendMessageWithMedia = async (chatIdParam, mediaUrl, type) => {
    const nowISO = new Date().toISOString();
    const msg = {
      _id: uuidv4(),
      createdAt: nowISO,
      text: null,
      [type]: mediaUrl,
      type,
      status: "sending",
      user: {
        _id: currentEmail,
        name: auth.currentUser?.displayName || currentEmail,
        avatar: auth.currentUser?.photoURL || null,
      },
    };

    setMessages((prev) => [...prev, msg]);

    try {
      const { error } = await supabase.from("chat_messages").insert([
        {
          chat_id: chatIdParam,
          user_email: currentEmail,
          message: msg,
        },
      ]);
      
      if (error) throw error;
    } catch (err) {
      console.error("sendMessageWithMedia error:", err);
      setMessages((prev) =>
        prev.map((m) => (m._id === msg._id ? { ...m, status: "failed" } : m))
      );
      alert("Failed to send media");
    }
  };

  // Media handling
  const pickMedia = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,video/*";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const fileType = file.type.startsWith("image") ? "image" : "video";
      await handleMediaUpload(chatId, file, fileType);
    };
    input.click();
  }, [chatId]);

  const handleMediaUpload = async (chatIdParam, file, type) => {
    try {
      setUploading(true);

      const ext = file.name.split(".").pop() || (type === "image" ? "jpg" : "mp4");
      const filePath = `${currentEmail}/${type === "image" ? "images" : "videos"}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("chat_messages")
        .upload(filePath, file, { contentType: file.type });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("chat_messages")
        .getPublicUrl(filePath);
      const publicUrl = publicUrlData?.publicUrl;

      if (!publicUrl) throw new Error("No public URL returned");

      await sendMessageWithMedia(chatIdParam, publicUrl, type);
    } catch (err) {
      console.error("handleMediaUpload failed:", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Sticker sending
  const handleSendSticker = async () => {
    if (!selectedSticker) return;
    
    try {
      const userEmail = currentEmail;
      const { data: userData } = await supabase
        .from("users")
        .select("totalgold, totaldiamond")
        .eq("email", userEmail)
        .single();

      const cost = (selectedSticker.coins || 0) * quantity;
      const isGold = activeTab === "gold";
      const currentBalance = isGold ? userData?.totalgold || 0 : userData?.totaldiamond || 0;

      if (cost > currentBalance) {
        alert(`Insufficient ${isGold ? "Gold" : "Diamond"} Coins`);
        return;
      }

      const updateField = isGold
        ? { totalgold: currentBalance - cost }
        : { totaldiamond: currentBalance - cost };
      
      await supabase.from("users").update(updateField).eq("email", userEmail);
      await sendMessageWithImage(chatId, selectedSticker.imageUrl);
      closeStickerModal();
    } catch (err) {
      console.error("handleSendSticker error:", err);
      alert("Failed to send gift");
    }
  };

  const closeStickerModal = () => {
    setShowStickerPicker(false);
    setSelectedSticker(null);
  };

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 60 * 60 : prev - 1));
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Fetch user balances
  useEffect(() => {
    const fetchBalances = async () => {
      try {
        if (!currentEmail) return;
        const { data } = await supabase
          .from("users")
          .select("totalgold, totaldiamond")
          .eq("email", currentEmail)
          .single();
        
        if (data) {
          setUserGold(data.totalgold || 0);
          setUserDiamond(data.totaldiamond || 0);
        }
      } catch (err) {
        console.error("fetch balances err", err);
      }
    };

    fetchBalances();
  }, [currentEmail]);

  // Voice message recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioRecorderRef.current = new MediaRecorder(stream);
      setIsRecording(true);
      
      audioRecorderRef.current.start();
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (audioRecorderRef.current && isRecording) {
      audioRecorderRef.current.stop();
      setIsRecording(false);
      // Handle the recorded audio here
    }
  };

  // UI Components
  const Header = () => (
    <div className="modern-header">
      <div className="modern-header-content">
        <button onClick={() => navigate(-1)} className="modern-back-button">
          <IoIosArrowBack size={24} />
        </button>

        <div className="modern-user-info">
          <div className="modern-avatar-container">
            <img
              src={params.avatar || params.image || "https://i.pravatar.cc/300"}
              className="modern-avatar"
              alt={params.name || params.email || "User"}
            />
            <div className={`modern-status-indicator ${isOnline ? 'online' : 'offline'}`} />
          </div>

          <div className="modern-user-details">
            <h2 className="modern-user-name">{params.name || params.email || "Unknown User"}</h2>
            <p className="modern-user-status">
              {isTyping ? (
                <span className="modern-typing-indicator">
                  <span className="modern-typing-dot"></span>
                  <span className="modern-typing-dot"></span>
                  <span className="modern-typing-dot"></span>
                  typing...
                </span>
              ) : isOnline ? (
                "Online"
              ) : (
                "Offline"
              )}
            </p>
          </div>
        </div>

        <div className="modern-header-actions">
          <button
            className="modern-call-button"
            onClick={() => {
              if (isChatDisabled) {
                alert("Blocked", "You can't call this user.");
              } else {
                initiateCall(false);
              }
            }}
          >
            <IoIosCall size={22} />
          </button>
          
          <button
            className="modern-video-call-button"
            onClick={() => {
              if (isChatDisabled) {
                alert("Blocked", "You can't video call this user.");
              } else {
                initiateCall(true);
              }
            }}
          >
            <IoIosVideocam size={22} />
          </button>

          <button
            className={`modern-block-button ${isBlocked ? 'blocked' : ''}`}
            onClick={handleBlockToggle}
          >
            {isBlocked ? 'Unblock' : 'Block'}
          </button>
        </div>
      </div>
    </div>
  );

  const MessageBubble = React.memo(({ message }) => {
    const isSelf = message.user?._id === currentEmail;
    
    return (
      <div className={`modern-message-container ${isSelf ? "self" : "other"}`}>
        {!isSelf && (
          <img
            src={params.avatar || "https://i.pravatar.cc/300"}
            className="modern-sender-avatar"
            alt="Sender"
          />
        )}
        
        <div className={`modern-message-bubble ${isSelf ? "self" : "other"}`}>
          {message.image && (
            <div className="modern-media-container">
              <img src={message.image} className="modern-message-image" alt="Shared content" />
              <div className="modern-media-overlay">🎁 Gift</div>
            </div>
          )}
          
          {message.video && (
            <div className="modern-media-container">
              <video src={message.video} className="modern-message-video" controls />
              <div className="modern-media-overlay">📹 Video</div>
            </div>
          )}
          
          {message.text && (
            <div className="modern-message-text">
              {message.text}
            </div>
          )}
          
          <div className="modern-message-meta">
            <span className="modern-message-time">
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            
            {isSelf && (
              <span className={`modern-message-status ${message.status}`}>
                {message.status === "failed" ? "⚠️" : message.status === "sending" ? "⏳" : "✓✓"}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  });

  const StickerModal = () => (
    <div className="modern-modal-overlay" onClick={closeStickerModal}>
      <div className="modern-sticker-modal" onClick={(e) => e.stopPropagation()}>
        {/* Banner */}
        <div className="modern-banner">
          <div className="modern-banner-content">
            <MdLocalOffer className="modern-banner-icon" /> 
            <span>Get newbie bonus, recharge for free lottery</span>
          </div>
          <div className="modern-timer-box">
            <span className="modern-timer">
              {Math.floor(timeLeft / 60).toString().padStart(2, "0")}:
              {(timeLeft % 60).toString().padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="modern-sticker-header">
          <h3 className="modern-sticker-title">Send a Special Gift</h3>
          <div className="modern-header-right">
            <div className="modern-coins-display">
              <div className="modern-coin-item diamond">
                <MdDiamond size={18} />
                <span>{userDiamond}</span>
              </div>
              <div className="modern-coin-item gold">
                <FaCoins size={18} />
                <span>{userGold}</span>
              </div>
            </div>
            <button className="modern-close-modal" onClick={closeStickerModal}>
              <IoIosClose size={24} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="modern-tab-row">
          <button
            className={`modern-tab-button ${activeTab === "gold" ? "active" : ""}`}
            onClick={() => setActiveTab("gold")}
          >
            <FaCoins className="modern-tab-icon" />
            <span>Gold Gifts</span>
          </button>
          
          <button
            className={`modern-tab-button ${activeTab === "diamond" ? "active" : ""}`}
            onClick={() => setActiveTab("diamond")}
          >
            <MdDiamond className="modern-tab-icon" />
            <span>Premium Gifts</span>
          </button>
        </div>

        {/* Stickers Grid */}
        {stickersLoading ? (
          <div className="modern-loading-stickers">
            <div className="modern-loading-spinner"></div>
            <p>Loading amazing gifts...</p>
          </div>
        ) : (
          <div className="modern-stickers-grid">
            {filteredGifts().map((it, idx) => (
              <button
                key={idx}
                className={`modern-sticker-item ${selectedSticker === it ? "selected" : ""}`}
                onClick={() => setSelectedSticker(it)}
              >
                <div className="modern-sticker-image-container">
                  <img src={it.imageUrl} alt={it.name} className="modern-sticker-image" />
                  {it.isNew && <span className="modern-new-badge">NEW</span>}
                  <div className="modern-sticker-cost">
                    {it.coins} {activeTab === "gold" ? "🥇" : "💎"}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="modern-sticker-footer">
          <div className="modern-recipient-info">
            <div className="modern-recipient-avatar">
              {params.name?.charAt(0) || "U"}
            </div>
            <span className="modern-recipient-name">To: {params.name || "User"}</span>
          </div>

          <div className="modern-quantity-control">
            <label>Quantity:</label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="modern-quantity-dropdown"
            >
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <button
            className="modern-send-sticker-button"
            onClick={handleSendSticker}
            disabled={!selectedSticker}
          >
            <IoIosGift className="modern-send-icon" />
            Send Gift
            {selectedSticker && (
              <span className="modern-total-cost">
                ({selectedSticker.coins * quantity} {activeTab === "gold" ? "🥇" : "💎"})
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="modern-chat-container">
      {/* Upload Overlay */}
      {uploading && (
        <div className="modern-upload-overlay">
          <div className="modern-upload-spinner"></div>
          <div className="modern-upload-text">Uploading your media...</div>
        </div>
      )}

      {/* Header */}
      <Header />

      {/* Messages Area */}
      <div className="modern-messages-container">
        <div className="modern-messages-list">
          {messages.map((m, idx) => (
            <MessageBubble key={m._id || idx} message={m} />
          ))}
          <div ref={messagesEndRef} className="modern-messages-end" />
        </div>
      </div>

      {/* Sticker Modal */}
      {showStickerPicker && <StickerModal />}

      {/* Input Area */}
      <div className="modern-input-container">
        <button
          className="modern-input-button modern-gift-button"
          onClick={() => setShowStickerPicker(true)}
          disabled={isChatDisabled}
          title="Send Gift"
        >
          <IoIosGift size={24} />
        </button>

        <div className="modern-input-wrapper">
          <input
            className="modern-message-input"
            placeholder={
              isChatDisabled ? "You can't send messages to this user" : "Type a message..."
            }
            value={inputText}
            onChange={(e) => handleChangeText(e.target.value)}
            disabled={isChatDisabled}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (inputText.trim()) {
                  sendMessage(chatId, inputText.trim());
                }
              }
            }}
          />
          
          {/* Voice Message Button */}
          <button
            className={`modern-voice-button ${isRecording ? 'recording' : ''}`}
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            disabled={isChatDisabled}
            title="Hold to record voice message"
          >
            🎤
          </button>
        </div>

        <button
          className="modern-input-button modern-media-button"
          onClick={pickMedia}
          disabled={isChatDisabled || uploading}
          title="Attach Media"
        >
          <IoIosImages size={24} />
        </button>

        <button
          className={`modern-send-button ${!inputText.trim() ? "disabled" : ""}`}
          onClick={() => sendMessage(chatId, inputText.trim())}
          disabled={!inputText.trim() || isChatDisabled || uploading}
          title="Send Message"
        >
          <IoIosSend size={20} />
        </button>
      </div>

      {/* Incoming Call Screen */}
      {showIncomingCall && callerInfo && (
        <div className="modern-incoming-call-overlay">
          <div className="modern-incoming-call-modal">
            <h3>Incoming Call</h3>
            <p>From: {callerInfo.name}</p>
            <div className="modern-call-actions">
              <button onClick={handleAcceptCall}>Accept</button>
              <button onClick={() => setShowIncomingCall(false)}>Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}