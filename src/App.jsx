// // import React, { useState, useEffect, useRef } from 'react';
// // import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, where } from 'firebase/firestore';
// // import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
// // import { db, auth } from './firebase/config';

// // import { 
// //   FaVideo, 
// //   FaPhoneSlash, 
// //   FaShareSquare,
// //   FaCopy,
// //   FaTimes,
// //   FaCrown,
// //   FaVideo as FaVideoIcon,
// //   FaSignOutAlt,
// //   FaCheckCircle,
// //   FaCircle,
// //   FaPaperPlane,
// //   FaUsers,
// //   FaMicrophone,
// //   FaMicrophoneSlash,
// //   FaVideoSlash,
// //   FaComments,
// //   FaUserFriends,
// //   FaBell
// // } from 'react-icons/fa';

// // import { 
// //   HiUsers, 
// //   HiChatAlt2,
// //   HiDotsVertical,
// //   HiVolumeUp,
// //   HiVolumeOff
// // } from 'react-icons/hi';

// // function App() {
// //   const [users, setUsers] = useState([]);
// //   const [messages, setMessages] = useState([]);
// //   const [newMessage, setNewMessage] = useState('');
// //   const [currentUser, setCurrentUser] = useState(null);
// //   const [isVideoCallActive, setIsVideoCallActive] = useState(false);
// //   const [videoRoomId, setVideoRoomId] = useState(`meet-${Math.random().toString(36).substr(2, 9)}`);
// //   const [activeVideoUsers, setActiveVideoUsers] = useState([]);
// //   const [isVideoInitialized, setIsVideoInitialized] = useState(false);
// //   const [showInviteModal, setShowInviteModal] = useState(false);
// //   const [sidebarTab, setSidebarTab] = useState('participants');
// //   const [isCopied, setIsCopied] = useState(false);
// //   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
// //   const [audioMuted, setAudioMuted] = useState(false);
// //   const [videoMuted, setVideoMuted] = useState(false);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [notification, setNotification] = useState('');
  
// //   // Refs
// //   const videoContainerRef = useRef(null);
// //   const zpInstanceRef = useRef(null);
// //   const messagesEndRef = useRef(null);
// //   const audioRef = useRef(null);

// //   // Auto scroll to bottom of messages
// //   const scrollToBottom = () => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //   };

// //   useEffect(() => {
// //     scrollToBottom();
// //   }, [messages]);

// //   // Firebase se real-time messages
// //   useEffect(() => {
// //     setIsLoading(true);
// //     const messagesQuery = query(
// //       collection(db, 'messages'), 
// //       orderBy('timestamp', 'asc')
// //     );
    
// //     const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
// //       const messagesData = snapshot.docs.map(doc => ({
// //         id: doc.id,
// //         ...doc.data()
// //       }));
// //       setMessages(messagesData);
// //       setIsLoading(false);
// //     }, (error) => {
// //       console.error('Error fetching messages:', error);
// //       setIsLoading(false);
// //     });

// //     return unsubscribe;
// //   }, []);

// //   // Auto-create 25 users on app start
// //   useEffect(() => {
// //     const savedUsers = localStorage.getItem('videoAppUsers');
// //     if (savedUsers) {
// //       setUsers(JSON.parse(savedUsers));
// //     } else {
// //       createDummyUsers();
// //     }

// //     // Play notification sound for new messages
// //     audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/286/286-preview.mp3');
// //   }, []);

// //   // 25 Dummy Users with realistic data
// //   const createDummyUsers = () => {
// //     const names = [
// //       'Aarav Sharma', 'Vivaan Patel', 'Aditya Singh', 'Arjun Kumar', 'Reyansh Gupta',
// //       'Saanvi Reddy', 'Ananya Mishra', 'Diya Choudhury', 'Aarna Joshi', 'Prisha Malhotra',
// //       'Ishaan Verma', 'Shaurya Das', 'Vihaan Nair', 'Krishna Iyer', 'Rudra Menon',
// //       'Myra Kapoor', 'Avni Sengupta', 'Anika Banerjee', 'Pari Bansal', 'Kiara Chatterjee',
// //       'Rohan Desai', 'Aryan Tiwari', 'Atharva Mehta', 'Dev Khanna', 'Yash Oberoi'
// //     ];

// //     const dummyUsers = names.map((name, index) => ({
// //       id: index + 1,
// //       name: name,
// //       email: `${name.toLowerCase().replace(' ', '.')}@gmail.com`,
// //       avatar: `https://i.pravatar.cc/150?img=${(index % 70) + 1}`,
// //       online: Math.random() > 0.3,
// //       lastSeen: new Date().toLocaleTimeString(),
// //       inVideoCall: false,
// //       isTyping: false
// //     }));
    
// //     setUsers(dummyUsers);
// //     localStorage.setItem('videoAppUsers', JSON.stringify(dummyUsers));
// //     showNotification('25 users loaded successfully!');
// //   };

// //   // Firebase mein message send karo
// //   const sendMessage = async (e) => {
// //     e.preventDefault();
// //     if (!newMessage.trim() || !currentUser) return;

// //     setIsLoading(true);
// //     try {
// //       await addDoc(collection(db, 'messages'), {
// //         text: newMessage,
// //         userName: currentUser.name,
// //         userId: currentUser.id,
// //         userAvatar: currentUser.avatar,
// //         timestamp: serverTimestamp(),
// //         isSystemMessage: false
// //       });
// //       setNewMessage('');
// //     } catch (error) {
// //       console.error('Error sending message:', error);
// //       showNotification('Failed to send message');
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   // Notification system
// //   const showNotification = (message) => {
// //     setNotification(message);
// //     setTimeout(() => setNotification(''), 3000);
    
// //     // Play notification sound
// //     if (audioRef.current) {
// //       audioRef.current.play().catch(() => console.log('Audio play failed'));
// //     }
// //   };

// //   // User login karo
// //   const loginUser = (user) => {
// //     setCurrentUser(user);
// //     setIsMobileMenuOpen(false);
// //     showNotification(`Welcome ${user.name}!`);
    
// //     // Send login notification
// //     addDoc(collection(db, 'messages'), {
// //       text: `${user.name} joined the chat`,
// //       userName: 'System',
// //       userId: 'system',
// //       timestamp: serverTimestamp(),
// //       isSystemMessage: true
// //     });
// //   };

// //   // Logout karo
// //   const logoutUser = () => {
// //     if (currentUser) {
// //       addDoc(collection(db, 'messages'), {
// //         text: `${currentUser.name} left the chat`,
// //         userName: 'System',
// //         userId: 'system',
// //         timestamp: serverTimestamp(),
// //         isSystemMessage: true
// //       });
// //     }
    
// //     setCurrentUser(null);
// //     stopVideoCall();
// //     setIsMobileMenuOpen(false);
// //     showNotification('Logged out successfully');
// //   };

// //   // VIDEO CALLING FUNCTIONS
// //   const startVideoCall = async () => {
// //     if (!currentUser) {
// //       showNotification('Please login first to join video call');
// //       return;
// //     }
    
// //     if (isVideoInitialized) {
// //       return;
// //     }
    
// //     setIsLoading(true);
// //     setIsVideoCallActive(true);
// //     setIsVideoInitialized(true);
    
// //     // Update user status to in video call
// //     const updatedUsers = users.map(user => 
// //       user.id === currentUser.id ? { ...user, inVideoCall: true } : user
// //     );
// //     setUsers(updatedUsers);
    
// //     // Start video call
// //     setTimeout(() => {
// //       initializeVideoCall();
// //     }, 500);
// //   };

// //   const stopVideoCall = () => {
// //     if (zpInstanceRef.current) {
// //       zpInstanceRef.current.leaveRoom();
// //       zpInstanceRef.current = null;
// //     }
    
// //     setIsVideoCallActive(false);
// //     setIsVideoInitialized(false);
// //     setAudioMuted(false);
// //     setVideoMuted(false);
    
// //     // Update user status to not in video call
// //     const updatedUsers = users.map(user => 
// //       user.id === currentUser.id ? { ...user, inVideoCall: false } : user
// //     );
// //     setUsers(updatedUsers);
    
// //     // Clear video container
// //     if (videoContainerRef.current) {
// //       videoContainerRef.current.innerHTML = '';
// //     }
    
// //     setActiveVideoUsers([]);
// //     showNotification('Meeting ended');
// //   };

// //   // ZEGOCLOUD Video Call Setup
// //   const initializeVideoCall = async () => {
// //     if (!videoContainerRef.current || !currentUser) {
// //       console.error('Video container or user not found');
// //       setIsLoading(false);
// //       return;
// //     }

// //     const serverSecret = "7002f9833bbd967759a04a1b040d3d9d";
    
// //     if (!serverSecret) {
// //       showNotification("Server Secret not found!");
// //       setIsVideoCallActive(false);
// //       setIsVideoInitialized(false);
// //       setIsLoading(false);
// //       return;
// //     }

// //     try {
// //       // Clear previous instance
// //       if (zpInstanceRef.current) {
// //         zpInstanceRef.current.leaveRoom();
// //         zpInstanceRef.current = null;
// //       }

// //       const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
// //         1476383802,
// //         serverSecret,
// //         videoRoomId,
// //         currentUser.id.toString(),
// //         currentUser.name
// //       );

// //       const zp = ZegoUIKitPrebuilt.create(kitToken);
// //       zpInstanceRef.current = zp;
      
// //       // Clear container before joining
// //       videoContainerRef.current.innerHTML = '';
      
// //       await zp.joinRoom({
// //         container: videoContainerRef.current,
// //         scenario: {
// //           mode: ZegoUIKitPrebuilt.GroupCall,
// //         },
// //         turnOnMicrophoneWhenJoining: !audioMuted,
// //         turnOnCameraWhenJoining: !videoMuted,
// //         showPreJoinView: false,
// //         showUserList: true,
// //         sharedLinks: [
// //           {
// //             name: 'Copy invitation',
// //             url: `${window.location.origin}${window.location.pathname}?room=${videoRoomId}`
// //           }
// //         ],
// //         onUserJoin: (userList) => {
// //           console.log('User joined:', userList);
// //           setActiveVideoUsers(prev => [...prev, ...userList]);
// //           sendCallNotification(`${userList[0]?.userName || 'Someone'} joined the meeting`);
// //           showNotification(`${userList[0]?.userName || 'New user'} joined the meeting`);
          
// //           // Auto-join user to video call
// //           const joinedUserId = userList[0]?.userID;
// //           if (joinedUserId) {
// //             const updatedUsers = users.map(user => 
// //               user.id == joinedUserId ? { ...user, inVideoCall: true } : user
// //             );
// //             setUsers(updatedUsers);
// //           }
// //         },
// //         onUserLeave: (userList) => {
// //           console.log('User left:', userList);
// //           setActiveVideoUsers(prev => 
// //             prev.filter(u => u.userID !== userList[0]?.userID)
// //           );
// //           sendCallNotification(`${userList[0]?.userName || 'Someone'} left the meeting`);
// //           showNotification(`${userList[0]?.userName || 'User'} left the meeting`);
          
// //           // Update user status
// //           const leftUserId = userList[0]?.userID;
// //           if (leftUserId) {
// //             const updatedUsers = users.map(user => 
// //               user.id == leftUserId ? { ...user, inVideoCall: false } : user
// //             );
// //             setUsers(updatedUsers);
// //           }
// //         },
// //         onJoinRoom: () => {
// //           console.log('✅ Meeting joined successfully');
// //           sendCallNotification(`${currentUser.name} joined the meeting`);
// //           showNotification('Meeting started successfully!');
// //           setIsLoading(false);
// //         },
// //         onLeaveRoom: () => {
// //           console.log('❌ Meeting left');
// //           sendCallNotification(`${currentUser.name} left the meeting`);
// //         },
// //         onJoinRoomFailed: (error) => {
// //           console.error('❌ Meeting join failed:', error);
// //           showNotification('Meeting failed to start: ' + error.message);
// //           setIsVideoCallActive(false);
// //           setIsVideoInitialized(false);
// //           setIsLoading(false);
// //         }
// //       });
// //     } catch (error) {
// //       console.error('Meeting error:', error);
// //       showNotification('Meeting failed: ' + error.message);
// //       setIsVideoCallActive(false);
// //       setIsVideoInitialized(false);
// //       setIsLoading(false);
// //     }
// //   };

// //   // Video call join/leave notification bhejo
// //   const sendCallNotification = async (message) => {
// //     try {
// //       await addDoc(collection(db, 'messages'), {
// //         text: message,
// //         userName: 'System',
// //         userId: 'system',
// //         timestamp: serverTimestamp(),
// //         isSystemMessage: true
// //       });
// //     } catch (error) {
// //       console.error('Error sending call notification:', error);
// //     }
// //   };

// //   // Invite link copy karo
// //   const copyInviteLink = () => {
// //     const inviteLink = `${window.location.origin}${window.location.pathname}?room=${videoRoomId}&user=${currentUser?.id || 'guest'}`;
// //     navigator.clipboard.writeText(inviteLink);
// //     setIsCopied(true);
// //     showNotification('Invite link copied to clipboard!');
// //     setTimeout(() => setIsCopied(false), 2000);
// //     setShowInviteModal(false);
// //   };

// //   // Join meeting via link
// //   const joinMeeting = (user) => {
// //     if (!isVideoCallActive) {
// //       startVideoCall();
// //     }
// //     loginUser(user);
// //   };

// //   // Toggle audio
// //   const toggleAudio = () => {
// //     setAudioMuted(!audioMuted);
// //     showNotification(audioMuted ? 'Microphone unmuted' : 'Microphone muted');
// //     // Implement actual audio toggle logic with Zego SDK
// //   };

// //   // Toggle video
// //   const toggleVideo = () => {
// //     setVideoMuted(!videoMuted);
// //     showNotification(videoMuted ? 'Camera turned on' : 'Camera turned off');
// //     // Implement actual video toggle logic with Zego SDK
// //   };

// //   // Format timestamp
// //   const formatTime = (timestamp) => {
// //     if (!timestamp) return '';
// //     const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
// //     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// //   };

// //   // Cleanup on component unmount
// //   useEffect(() => {
// //     return () => {
// //       if (zpInstanceRef.current) {
// //         zpInstanceRef.current.leaveRoom();
// //       }
// //     };
// //   }, []);

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
// //       {/* Notification */}
// //       {notification && (
// //         <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
// //           <div className="bg-green-500 text-white px-6 py-3 rounded-2xl shadow-2xl border-2 border-green-300 flex items-center space-x-3">
// //             <FaBell className="text-white animate-pulse" />
// //             <span className="font-semibold text-sm sm:text-base">{notification}</span>
// //           </div>
// //         </div>
// //       )}

// //       {/* Header */}
// //       <header className="bg-white/80 backdrop-blur-lg shadow-2xl border-b border-blue-200/50 sticky top-0 z-50">
// //         <div className="max-w-8xl mx-auto px-3 sm:px-6 lg:px-8">
// //           <div className="flex justify-between items-center h-16 lg:h-20">
// //             {/* Logo */}
// //             <div className="flex items-center space-x-3 lg:space-x-4">
// //               <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
// //                 <FaVideo className="text-white text-lg lg:text-xl" />
// //               </div>
// //               <div>
// //                 <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
// //                   VideoMeet Pro
// //                 </h1>
// //                 <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">HD Video Conferencing</p>
// //               </div>
// //             </div>

// //             {/* Mobile Menu Button */}
// //             <div className="lg:hidden">
// //               <button 
// //                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
// //                 className="p-3 rounded-2xl bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
// //               >
// //                 <HiDotsVertical className="text-xl text-gray-700" />
// //               </button>
// //             </div>

// //             {/* User Info & Controls - Desktop */}
// //             {currentUser ? (
// //               <div className="hidden lg:flex items-center space-x-4 lg:space-x-6">
// //                 <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl px-4 lg:px-6 py-2 lg:py-3 border-2 border-blue-200/50 shadow-lg transform hover:scale-105 transition-transform duration-300">
// //                   <img 
// //                     src={currentUser.avatar} 
// //                     alt={currentUser.name}
// //                     className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-blue-500 shadow-lg"
// //                   />
// //                   <div>
// //                     <span className="text-sm lg:text-base font-semibold text-gray-800">
// //                       {currentUser.name}
// //                     </span>
// //                     <p className="text-xs text-gray-600">Online</p>
// //                   </div>
// //                 </div>
                
// //                 <div className="flex items-center space-x-3">
// //                   {!isVideoCallActive ? (
// //                     <>
// //                       <button 
// //                         onClick={startVideoCall}
// //                         disabled={isLoading}
// //                         className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 lg:px-7 py-3 lg:py-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
// //                       >
// //                         <FaVideo className="text-sm lg:text-base" />
// //                         <span className="font-bold text-sm lg:text-base">New Meeting</span>
// //                       </button>
// //                       <button 
// //                         onClick={() => setShowInviteModal(true)}
// //                         className="flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 px-5 lg:px-7 py-3 lg:py-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
// //                       >
// //                         <FaShareSquare className="text-sm lg:text-base" />
// //                         <span className="font-bold text-sm lg:text-base">Invite</span>
// //                       </button>
// //                     </>
// //                   ) : (
// //                     <button 
// //                       onClick={stopVideoCall}
// //                       className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-5 lg:px-7 py-3 lg:py-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
// //                     >
// //                       <FaPhoneSlash className="text-sm lg:text-base" />
// //                       <span className="font-bold text-sm lg:text-base">Leave Call</span>
// //                     </button>
// //                   )}
// //                   <button 
// //                     onClick={logoutUser}
// //                     className="flex items-center space-x-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 px-4 lg:px-5 py-3 lg:py-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
// //                   >
// //                     <FaSignOutAlt className="text-sm lg:text-base" />
// //                     <span className="font-bold text-sm lg:text-base">Logout</span>
// //                   </button>
// //                 </div>
// //               </div>
// //             ) : (
// //               <div className="hidden lg:block">
// //                 <button 
// //                   onClick={createDummyUsers}
// //                   className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
// //                 >
// //                   <HiUsers className="text-lg lg:text-xl" />
// //                   <span className="font-bold text-sm lg:text-base">Load Users</span>
// //                 </button>
// //               </div>
// //             )}
// //           </div>

// //           {/* Mobile Menu */}
// //           {isMobileMenuOpen && (
// //             <div className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200 py-4 animate-fade-in rounded-b-2xl shadow-2xl">
// //               {currentUser ? (
// //                 <div className="space-y-4">
// //                   <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200">
// //                     <img 
// //                       src={currentUser.avatar} 
// //                       alt={currentUser.name}
// //                       className="w-12 h-12 rounded-full border-2 border-blue-500 shadow-lg"
// //                     />
// //                     <div>
// //                       <p className="font-bold text-gray-900">{currentUser.name}</p>
// //                       <p className="text-sm text-gray-600">{currentUser.email}</p>
// //                     </div>
// //                   </div>
                  
// //                   <div className="grid grid-cols-2 gap-3">
// //                     {!isVideoCallActive ? (
// //                       <>
// //                         <button 
// //                           onClick={startVideoCall}
// //                           disabled={isLoading}
// //                           className="flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 disabled:opacity-50"
// //                         >
// //                           <FaVideo className="text-lg" />
// //                           <span className="font-bold text-xs">New Meeting</span>
// //                         </button>
// //                         <button 
// //                           onClick={() => setShowInviteModal(true)}
// //                           className="flex flex-col items-center justify-center space-y-2 bg-white text-gray-700 border-2 border-gray-300 p-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
// //                         >
// //                           <FaShareSquare className="text-lg" />
// //                           <span className="font-bold text-xs">Invite</span>
// //                         </button>
// //                       </>
// //                     ) : (
// //                       <button 
// //                         onClick={stopVideoCall}
// //                         className="col-span-2 flex items-center justify-center space-x-3 bg-gradient-to-r from-red-600 to-pink-600 text-white p-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
// //                       >
// //                         <FaPhoneSlash className="text-lg" />
// //                         <span className="font-bold">Leave Call</span>
// //                       </button>
// //                     )}
// //                   </div>
                  
// //                   <button 
// //                     onClick={logoutUser}
// //                     className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 p-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
// //                   >
// //                     <FaSignOutAlt className="text-lg" />
// //                     <span className="font-bold">Logout</span>
// //                   </button>
// //                 </div>
// //               ) : (
// //                 <button 
// //                   onClick={createDummyUsers}
// //                   className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
// //                 >
// //                   <HiUsers className="text-xl" />
// //                   <span className="font-bold">Load Users</span>
// //                 </button>
// //               )}
// //             </div>
// //           )}
// //         </div>
// //       </header>

// //       {/* Loading Spinner */}
// //       {isLoading && (
// //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
// //           <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center space-y-4">
// //             <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
// //             <p className="text-gray-700 font-semibold">Loading...</p>
// //           </div>
// //         </div>
// //       )}

// //       {/* Invite Modal */}
// //       {showInviteModal && (
// //         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
// //           <div className="bg-white rounded-3xl shadow-3xl max-w-md w-full p-6 lg:p-8 transform transition-all duration-300 scale-95 hover:scale-100 border-2 border-blue-200">
// //             <div className="flex justify-between items-center mb-6">
// //               <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-4">
// //                 <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
// //                   <FaShareSquare className="text-blue-600 text-xl" />
// //                 </div>
// //                 <span>Invite People</span>
// //               </h3>
// //               <button 
// //                 onClick={() => setShowInviteModal(false)}
// //                 className="text-gray-400 hover:text-gray-600 transition-colors duration-300 p-3 hover:bg-gray-100 rounded-2xl"
// //               >
// //                 <FaTimes className="text-xl" />
// //               </button>
// //             </div>
            
// //             <p className="text-gray-600 mb-6 text-lg">
// //               Share this link to invite others to join:
// //             </p>
            
// //             <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-4 mb-8">
// //               <code className="text-sm text-gray-800 break-all font-mono bg-white/50 p-2 rounded-xl">
// //                 {`${window.location.origin}?room=${videoRoomId}`}
// //               </code>
// //             </div>
            
// //             <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
// //               <button 
// //                 onClick={copyInviteLink}
// //                 className="flex-1 flex items-center justify-center space-x-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 lg:py-5 px-6 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
// //               >
// //                 {isCopied ? (
// //                   <FaCheckCircle className="text-green-300 text-xl" />
// //                 ) : (
// //                   <FaCopy className="text-xl" />
// //                 )}
// //                 <span className="font-bold text-lg">{isCopied ? 'Copied!' : 'Copy Link'}</span>
// //               </button>
// //               <button 
// //                 onClick={() => setShowInviteModal(false)}
// //                 className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 py-4 lg:py-5 px-6 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 font-bold text-lg"
// //               >
// //                 Cancel
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Video Call Section */}
// //       {isVideoCallActive && currentUser && (
// //         <div className="bg-gray-900 min-h-screen animate-fade-in">
// //           {/* Meeting Header */}
// //           <div className="bg-gray-800/95 backdrop-blur-lg border-b border-gray-700 shadow-2xl">
// //             <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
// //               <div className="flex flex-col sm:flex-row justify-between items-center h-16 lg:h-20 space-y-3 sm:space-y-0">
// //                 <div className="flex items-center space-x-4 lg:space-x-6">
// //                   <h2 className="text-white font-bold text-lg lg:text-xl flex items-center space-x-3 lg:space-x-4">
// //                     <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
// //                       <FaVideo className="text-white text-lg lg:text-xl" />
// //                     </div>
// //                     <span className="text-sm sm:text-base lg:text-lg">
// //                       Meeting: <span className="text-blue-300 font-mono">{videoRoomId}</span>
// //                     </span>
// //                   </h2>
// //                   <div className="flex items-center space-x-2 text-sm lg:text-base text-gray-300 bg-gray-700/80 px-4 lg:px-5 py-2 rounded-2xl border-2 border-gray-600">
// //                     <HiUsers className="text-green-400 text-lg" />
// //                     <span>{activeVideoUsers.length + 1} participants online</span>
// //                   </div>
// //                 </div>
                
// //                 <div className="flex items-center space-x-3 lg:space-x-4">
// //                   <button 
// //                     onClick={() => setShowInviteModal(true)}
// //                     className="flex items-center space-x-2 bg-gray-700/80 hover:bg-gray-600/80 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 text-sm lg:text-base border-2 border-gray-600"
// //                   >
// //                     <FaShareSquare className="text-sm lg:text-base" />
// //                     <span className="font-bold">Invite</span>
// //                   </button>
// //                   <button 
// //                     onClick={stopVideoCall}
// //                     className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 text-sm lg:text-base"
// //                   >
// //                     <FaPhoneSlash className="text-sm lg:text-base" />
// //                     <span className="font-bold">Leave Call</span>
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Meeting Layout */}
// //           <div className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
// //             <div className="flex flex-col xl:flex-row gap-4 sm:gap-6 h-[calc(100vh-8rem)] sm:h-[calc(100vh-10rem)]">
// //               {/* Video Main Container */}
// //               <div className="flex-1 bg-black rounded-3xl overflow-hidden shadow-3xl border-2 border-gray-700 min-h-[400px] sm:min-h-[500px] xl:min-h-0 relative">
// //                 <div 
// //                   ref={videoContainerRef}
// //                   className="w-full h-full bg-gradient-to-br from-gray-900 to-black"
// //                 >
// //                   {/* Loading state */}
// //                   <div className="flex items-center justify-center h-full text-white">
// //                     <div className="text-center space-y-6">
// //                       <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-4 border-4 border-gray-700 shadow-2xl animate-pulse">
// //                         <FaVideo className="text-3xl sm:text-4xl text-gray-500" />
// //                       </div>
// //                       <div className="space-y-3">
// //                         <p className="text-xl sm:text-2xl font-bold text-gray-300">Starting HD Meeting...</p>
// //                         <p className="text-gray-400 text-sm sm:text-base">Please allow camera and microphone access</p>
// //                         <div className="flex justify-center space-x-2">
// //                           <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
// //                           <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
// //                           <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 {/* Video Controls - Desktop */}
// //                 <div className="hidden lg:flex absolute bottom-6 left-1/2 transform -translate-x-1/2 space-x-4">
// //                   <button 
// //                     onClick={toggleAudio}
// //                     className={`p-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-110 ${
// //                       audioMuted 
// //                         ? 'bg-red-600 hover:bg-red-700' 
// //                         : 'bg-gray-700/80 hover:bg-gray-600/80 backdrop-blur-sm'
// //                     }`}
// //                   >
// //                     {audioMuted ? (
// //                       <HiVolumeOff className="text-white text-xl" />
// //                     ) : (
// //                       <HiVolumeUp className="text-white text-xl" />
// //                     )}
// //                   </button>
// //                   <button 
// //                     onClick={toggleVideo}
// //                     className={`p-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-110 ${
// //                       videoMuted 
// //                         ? 'bg-red-600 hover:bg-red-700' 
// //                         : 'bg-gray-700/80 hover:bg-gray-600/80 backdrop-blur-sm'
// //                     }`}
// //                   >
// //                     {videoMuted ? (
// //                       <FaVideoSlash className="text-white text-xl" />
// //                     ) : (
// //                       <FaVideo className="text-white text-xl" />
// //                     )}
// //                   </button>
// //                 </div>
// //               </div>

// //               {/* Sidebar */}
// //               <div className="xl:w-96 2xl:w-[450px] bg-gray-800/95 backdrop-blur-lg rounded-3xl flex flex-col shadow-3xl border-2 border-gray-700">
// //                 {/* Sidebar Tabs */}
// //                 <div className="flex border-b border-gray-700">
// //                   <button
// //                     onClick={() => setSidebarTab('participants')}
// //                     className={`flex-1 flex items-center justify-center space-x-3 py-4 lg:py-5 text-sm lg:text-base font-bold transition-all duration-300 ${
// //                       sidebarTab === 'participants' 
// //                         ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-900/50' 
// //                         : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
// //                     }`}
// //                   >
// //                     <FaUserFriends className="text-lg" />
// //                     <span>Participants</span>
// //                     <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-2xl text-xs font-bold">
// //                       {activeVideoUsers.length + 1}
// //                     </span>
// //                   </button>
// //                   <button
// //                     onClick={() => setSidebarTab('chat')}
// //                     className={`flex-1 flex items-center justify-center space-x-3 py-4 lg:py-5 text-sm lg:text-base font-bold transition-all duration-300 ${
// //                       sidebarTab === 'chat' 
// //                         ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-900/50' 
// //                         : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
// //                     }`}
// //                   >
// //                     <FaComments className="text-lg" />
// //                     <span>Live Chat</span>
// //                     {messages.length > 0 && (
// //                       <span className="bg-blue-500 text-white px-2 py-1 rounded-2xl text-xs font-bold">
// //                         {messages.length}
// //                       </span>
// //                     )}
// //                   </button>
// //                 </div>

// //                 {/* Sidebar Content */}
// //                 <div className="flex-1 overflow-hidden">
// //                   {sidebarTab === 'participants' ? (
// //                     <div className="p-4 sm:p-6 h-full overflow-y-auto custom-scrollbar">
// //                       <div className="space-y-4">
// //                         {/* Host */}
// //                         <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-900/80 to-blue-800/80 rounded-2xl border-2 border-blue-500/50 shadow-2xl transform hover:scale-105 transition-transform duration-300 cursor-pointer group">
// //                           <div className="relative">
// //                             <img 
// //                               src={currentUser.avatar} 
// //                               alt={currentUser.name}
// //                               className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-blue-400 shadow-2xl group-hover:border-blue-300 transition-colors duration-300"
// //                             />
// //                             <FaCrown className="absolute -top-2 -right-2 text-yellow-400 text-sm sm:text-base bg-blue-900 rounded-full p-1" />
// //                           </div>
// //                           <div className="flex-1">
// //                             <div className="flex items-center space-x-3">
// //                               <span className="text-white font-bold text-sm sm:text-base">
// //                                 {currentUser.name}
// //                               </span>
// //                               <span className="text-blue-300 text-xs bg-blue-900/80 px-3 py-1 rounded-2xl font-bold border border-blue-400">Host</span>
// //                             </div>
// //                             <div className="flex items-center space-x-2 text-green-400 text-xs sm:text-sm mt-2">
// //                               <FaCircle className="text-xs animate-pulse" />
// //                               <span className="font-bold">You - Speaking</span>
// //                             </div>
// //                           </div>
// //                           <div className="flex space-x-2">
// //                             <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
// //                             <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
// //                             <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
// //                           </div>
// //                         </div>

// //                         {/* Other Participants */}
// //                         {activeVideoUsers.map((user, index) => (
// //                           <div key={user.userID} className="flex items-center space-x-4 p-4 bg-gray-700/80 rounded-2xl border-2 border-green-500/50 shadow-2xl transform hover:scale-105 transition-transform duration-300 cursor-pointer group">
// //                             <img 
// //                               src={`https://i.pravatar.cc/150?img=${(parseInt(user.userID) % 70) + 1 || index + 1}`}
// //                               alt={user.userName}
// //                               className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-green-400 shadow-2xl group-hover:border-green-300 transition-colors duration-300"
// //                             />
// //                             <div className="flex-1">
// //                               <span className="text-white font-bold text-sm sm:text-base">
// //                                 {user.userName}
// //                               </span>
// //                               <div className="flex items-center space-x-2 text-green-400 text-xs sm:text-sm mt-2">
// //                                 <FaCircle className="text-xs animate-pulse" />
// //                                 <span className="font-bold">Connected</span>
// //                               </div>
// //                             </div>
// //                             <FaVideoIcon className="text-green-400 text-lg sm:text-xl animate-pulse" />
// //                           </div>
// //                         ))}
// //                       </div>
// //                     </div>
// //                   ) : (
// //                     <div className="h-full flex flex-col">
// //                       {/* Chat Messages */}
// //                       <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
// //                         {messages.map((message, index) => (
// //                           <div 
// //                             key={message.id} 
// //                             className={`p-4 rounded-2xl border-2 shadow-2xl transform hover:scale-105 transition-transform duration-300 cursor-pointer ${
// //                               message.isSystemMessage 
// //                                 ? 'bg-gradient-to-r from-blue-900/80 to-purple-900/80 border-blue-500/50' 
// //                                 : message.userId === currentUser?.id
// //                                 ? 'bg-gradient-to-r from-blue-700/80 to-blue-600/80 border-blue-400/50'
// //                                 : 'bg-gradient-to-r from-gray-700/80 to-gray-600/80 border-gray-500/50'
// //                             }`}
// //                           >
// //                             <div className="flex items-start space-x-3">
// //                               <img 
// //                                 src={message.userAvatar || `https://i.pravatar.cc/150?img=${(parseInt(message.userId) % 70) + 1 || 1}`}
// //                                 alt={message.userName}
// //                                 className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl border-2 border-gray-400 shadow-lg"
// //                               />
// //                               <div className="flex-1 min-w-0">
// //                                 <div className="flex items-center justify-between mb-2">
// //                                   <span className={`text-sm sm:text-base font-bold ${
// //                                     message.isSystemMessage 
// //                                       ? 'text-blue-300' 
// //                                       : message.userId === currentUser?.id
// //                                       ? 'text-blue-200'
// //                                       : 'text-white'
// //                                   }`}>
// //                                     {message.userName}
// //                                     {message.userId === currentUser?.id && (
// //                                       <span className="text-blue-300 text-xs ml-2">(You)</span>
// //                                     )}
// //                                   </span>
// //                                   <span className="text-gray-400 text-xs font-bold bg-gray-800/50 px-2 py-1 rounded-xl">
// //                                     {formatTime(message.timestamp)}
// //                                   </span>
// //                                 </div>
// //                                 <p className={`text-sm sm:text-base ${
// //                                   message.isSystemMessage 
// //                                     ? 'text-blue-200 italic' 
// //                                     : 'text-gray-200'
// //                                 }`}>
// //                                   {message.text}
// //                                 </p>
// //                               </div>
// //                             </div>
// //                           </div>
// //                         ))}
// //                         <div ref={messagesEndRef} />
// //                       </div>

// //                       {/* Chat Input */}
// //                       <div className="p-4 sm:p-6 border-t-2 border-gray-700 bg-gray-900/50 backdrop-blur-lg">
// //                         <form onSubmit={sendMessage} className="flex space-x-3">
// //                           <input
// //                             type="text"
// //                             value={newMessage}
// //                             onChange={(e) => setNewMessage(e.target.value)}
// //                             placeholder="Type your message..."
// //                             disabled={isLoading}
// //                             className="flex-1 bg-gray-800 text-white placeholder-gray-400 border-2 border-gray-600 rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-2xl disabled:opacity-50"
// //                           />
// //                           <button 
// //                             type="submit"
// //                             disabled={isLoading || !newMessage.trim()}
// //                             className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3 sm:p-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
// //                           >
// //                             <FaPaperPlane className="text-lg sm:text-xl" />
// //                           </button>
// //                         </form>
// //                       </div>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Video Controls - Mobile Bottom */}
// //             <div className="lg:hidden fixed bottom-6 left-4 right-4 bg-gray-800/95 backdrop-blur-lg rounded-3xl p-4 border-2 border-gray-700 shadow-3xl">
// //               <div className="flex justify-center space-x-6">
// //                 <button 
// //                   onClick={toggleAudio}
// //                   className={`p-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-110 ${
// //                     audioMuted 
// //                       ? 'bg-red-600 hover:bg-red-700' 
// //                       : 'bg-gray-700 hover:bg-gray-600'
// //                   }`}
// //                 >
// //                   {audioMuted ? (
// //                     <HiVolumeOff className="text-white text-xl" />
// //                   ) : (
// //                     <HiVolumeUp className="text-white text-xl" />
// //                   )}
// //                 </button>
// //                 <button 
// //                   onClick={toggleVideo}
// //                   className={`p-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-110 ${
// //                     videoMuted 
// //                       ? 'bg-red-600 hover:bg-red-700' 
// //                       : 'bg-gray-700 hover:bg-gray-600'
// //                   }`}
// //                 >
// //                   {videoMuted ? (
// //                     <FaVideoSlash className="text-white text-xl" />
// //                   ) : (
// //                     <FaVideo className="text-white text-xl" />
// //                   )}
// //                 </button>
// //                 <button 
// //                   onClick={stopVideoCall}
// //                   className="p-4 bg-red-600 hover:bg-red-700 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-110"
// //                 >
// //                   <FaPhoneSlash className="text-white text-xl" />
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Dashboard - When no meeting is active */}
// //       {!isVideoCallActive && (
// //         <div className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 animate-fade-in">
// //           {/* Welcome Section */}
// //           <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-3xl border-2 border-blue-200/50 p-6 sm:p-8 lg:p-12 text-center mb-8 sm:mb-12">
// //             <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-3xl transform hover:scale-105 transition-transform duration-300">
// //               <FaVideo className="text-white text-2xl sm:text-3xl lg:text-4xl" />
// //             </div>
// //             <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-6">
// //               Welcome to VideoMeet Pro
// //             </h2>
// //             <p className="text-gray-600 text-lg sm:text-xl lg:text-2xl mb-8 sm:mb-10 max-w-4xl mx-auto leading-relaxed">
// //               Experience crystal clear HD video calls with real-time messaging and seamless collaboration
// //             </p>
// //             {currentUser && (
// //               <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center">
// //                 <button 
// //                   onClick={startVideoCall}
// //                   disabled={isLoading}
// //                   className="flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 rounded-2xl transition-all duration-300 shadow-3xl hover:shadow-4xl transform hover:scale-105 text-lg sm:text-xl lg:text-2xl font-bold disabled:opacity-50"
// //                 >
// //                   <FaVideo className="text-xl sm:text-2xl" />
// //                   <span>Start New Meeting</span>
// //                 </button>
// //                 <button 
// //                   onClick={() => setShowInviteModal(true)}
// //                   className="flex items-center justify-center space-x-3 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 rounded-2xl transition-all duration-300 shadow-3xl hover:shadow-4xl transform hover:scale-105 text-lg sm:text-xl lg:text-2xl font-bold"
// //                 >
// //                   <FaShareSquare className="text-xl sm:text-2xl" />
// //                   <span>Get Invite Link</span>
// //                 </button>
// //               </div>
// //             )}
// //           </div>

// //           {/* Main Dashboard */}
// //           <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
// //             {/* Users Section */}
// //             <div className="xl:col-span-2">
// //               <div className="bg-white rounded-3xl shadow-3xl border-2 border-blue-200/50 p-6 sm:p-8 lg:p-10">
// //                 <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 lg:mb-10 space-y-6 lg:space-y-0">
// //                   <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex items-center space-x-4">
// //                     <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-2xl">
// //                       <HiUsers className="text-blue-600 text-2xl sm:text-3xl" />
// //                     </div>
// //                     <span>Available Participants ({users.length})</span>
// //                   </h2>
// //                   <div className="flex items-center space-x-4 lg:space-x-6 text-sm sm:text-base text-gray-600">
// //                     <div className="flex items-center space-x-2 bg-green-100 px-4 lg:px-5 py-2 lg:py-3 rounded-2xl border-2 border-green-200 shadow-lg">
// //                       <FaCircle className="text-green-500 text-xs" />
// //                       <span className="font-bold">{users.filter(u => u.online).length} online</span>
// //                     </div>
// //                     <div className="flex items-center space-x-2 bg-blue-100 px-4 lg:px-5 py-2 lg:py-3 rounded-2xl border-2 border-blue-200 shadow-lg">
// //                       <FaVideoIcon className="text-blue-500 text-xs" />
// //                       <span className="font-bold">{users.filter(u => u.inVideoCall).length} in meeting</span>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 max-h-[600px] sm:max-h-[700px] overflow-y-auto custom-scrollbar p-2">
// //                   {users.map(user => (
// //                     <div 
// //                       key={user.id} 
// //                       className={`border-2 rounded-2xl p-4 sm:p-6 transition-all duration-500 hover:scale-105 hover:shadow-3xl cursor-pointer group backdrop-blur-sm ${
// //                         currentUser?.id === user.id 
// //                           ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-2xl' 
// //                           : 'border-gray-200 hover:border-blue-300 bg-white'
// //                       } ${user.inVideoCall ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50' : ''} ${
// //                         user.online ? 'ring-2 ring-green-500/20' : 'ring-2 ring-gray-300/20'
// //                       }`}
// //                       onClick={() => !currentUser ? loginUser(user) : null}
// //                     >
// //                       <div className="flex items-center space-x-3 sm:space-x-4">
// //                         <div className="relative">
// //                           <img 
// //                             src={user.avatar} 
// //                             alt={user.name}
// //                             className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl border-4 border-gray-300 shadow-2xl group-hover:border-blue-400 transition-all duration-300"
// //                           />
// //                           <div className={`absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white shadow-2xl ${
// //                             user.online ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
// //                           }`} />
// //                         </div>
// //                         <div className="flex-1 min-w-0">
// //                           <h3 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg truncate group-hover:text-blue-600 transition-colors duration-300">
// //                             {user.name}
// //                           </h3>
// //                           <p className="text-gray-500 text-xs sm:text-sm truncate mb-2 sm:mb-3">
// //                             {user.email}
// //                           </p>
// //                           <div className="flex items-center space-x-2">
// //                             <span className={`text-xs px-3 py-1 rounded-2xl font-bold border-2 ${
// //                               user.online 
// //                                 ? 'bg-green-100 text-green-800 border-green-200' 
// //                                 : 'bg-gray-100 text-gray-800 border-gray-200'
// //                             }`}>
// //                               {user.online ? '🟢 Online' : '⚫ Offline'}
// //                             </span>
// //                             {user.inVideoCall && (
// //                               <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-2xl font-bold border-2 border-green-200">
// //                                 📹 In Meeting
// //                               </span>
// //                             )}
// //                           </div>
// //                         </div>
// //                       </div>
                      
// //                       <div className="mt-4 sm:mt-6">
// //                         {!currentUser ? (
// //                           <button 
// //                             onClick={() => loginUser(user)}
// //                             className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 sm:py-4 px-4 sm:px-5 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 font-bold text-sm sm:text-base"
// //                           >
// //                             Join as {user.name.split(' ')[0]}
// //                           </button>
// //                         ) : currentUser.id === user.id ? (
// //                           <button 
// //                             onClick={startVideoCall}
// //                             disabled={isLoading}
// //                             className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 sm:py-4 px-4 sm:px-5 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 font-bold text-sm sm:text-base disabled:opacity-50"
// //                           >
// //                             🎥 Start Meeting
// //                           </button>
// //                         ) : (
// //                           <button 
// //                             onClick={() => joinMeeting(user)}
// //                             disabled={!isVideoCallActive}
// //                             className={`w-full py-3 sm:py-4 px-4 sm:px-5 rounded-2xl transition-all duration-300 shadow-2xl font-bold text-sm sm:text-base ${
// //                               isVideoCallActive
// //                                 ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-3xl transform hover:scale-105'
// //                                 : 'bg-gray-100 text-gray-400 cursor-not-allowed'
// //                             }`}
// //                           >
// //                             {isVideoCallActive ? '🎬 Join Meeting' : '⏳ Wait for Host'}
// //                           </button>
// //                         )}
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Global Chat */}
// //             {currentUser && (
// //               <div className="bg-white rounded-3xl shadow-3xl border-2 border-blue-200/50 p-6 sm:p-8 lg:p-10 flex flex-col">
// //                 <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex items-center space-x-4 mb-8 lg:mb-10">
// //                   <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-2xl">
// //                     <HiChatAlt2 className="text-blue-600 text-2xl sm:text-3xl" />
// //                   </div>
// //                   <span>Live Global Chat</span>
// //                 </h2>

// //                 <div className="flex-1 overflow-y-auto space-y-4 mb-6 sm:mb-8 max-h-[400px] sm:max-h-[500px] custom-scrollbar p-2">
// //                   {messages.length === 0 ? (
// //                     <div className="text-center py-12">
// //                       <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
// //                         <FaComments className="text-blue-500 text-2xl" />
// //                       </div>
// //                       <p className="text-gray-500 text-lg">No messages yet. Start the conversation!</p>
// //                     </div>
// //                   ) : (
// //                     messages.map(message => (
// //                       <div 
// //                         key={message.id} 
// //                         className={`p-4 rounded-2xl border-2 shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer ${
// //                           message.userId === currentUser?.id 
// //                             ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200' 
// //                             : message.isSystemMessage
// //                             ? 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200'
// //                             : 'bg-gradient-to-br from-gray-50 to-blue-50 border-gray-200'
// //                         }`}
// //                       >
// //                         <div className="flex items-start space-x-3">
// //                           <img 
// //                             src={message.userAvatar || `https://i.pravatar.cc/150?img=${(parseInt(message.userId) % 70) + 1 || 1}`}
// //                             alt={message.userName}
// //                             className="w-10 h-10 rounded-2xl border-2 border-gray-300 shadow-lg"
// //                           />
// //                           <div className="flex-1 min-w-0">
// //                             <div className="flex items-center justify-between mb-2">
// //                               <span className={`font-bold text-sm sm:text-base ${
// //                                 message.userId === currentUser?.id 
// //                                   ? 'text-blue-600' 
// //                                   : message.isSystemMessage
// //                                   ? 'text-purple-600'
// //                                   : 'text-gray-700'
// //                               }`}>
// //                                 {message.userName}
// //                                 {message.userId === currentUser?.id && (
// //                                   <span className="text-blue-400 text-xs ml-2">(You)</span>
// //                                 )}
// //                               </span>
// //                               <span className="text-gray-500 text-xs font-bold bg-white px-2 py-1 rounded-xl shadow-sm">
// //                                 {formatTime(message.timestamp)}
// //                               </span>
// //                             </div>
// //                             <p className={`text-sm sm:text-base ${
// //                               message.isSystemMessage ? 'text-purple-600 italic' : 'text-gray-600'
// //                             }`}>
// //                               {message.text}
// //                             </p>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     ))
// //                   )}
// //                   <div ref={messagesEndRef} />
// //                 </div>

// //                 <form onSubmit={sendMessage} className="flex space-x-3">
// //                   <input
// //                     type="text"
// //                     value={newMessage}
// //                     onChange={(e) => setNewMessage(e.target.value)}
// //                     placeholder="Type your message to everyone..."
// //                     disabled={isLoading}
// //                     className="flex-1 border-2 border-gray-300 rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-2xl disabled:opacity-50"
// //                   />
// //                   <button 
// //                     type="submit"
// //                     disabled={isLoading || !newMessage.trim()}
// //                     className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3 sm:p-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 disabled:opacity-50"
// //                   >
// //                     <FaPaperPlane className="text-lg sm:text-xl" />
// //                   </button>
// //                 </form>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default App;


// import React, { useState, useEffect, useRef } from 'react';
// import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, where, doc, updateDoc, arrayUnion } from 'firebase/firestore';
// import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
// import { db, auth } from './firebase/config';

// import { 
//   FaVideo, 
//   FaPhoneSlash, 
//   FaShareSquare,
//   FaCopy,
//   FaTimes,
//   FaCrown,
//   FaVideo as FaVideoIcon,
//   FaSignOutAlt,
//   FaCheckCircle,
//   FaCircle,
//   FaPaperPlane,
//   FaUsers,
//   FaMicrophone,
//   FaMicrophoneSlash,
//   FaVideoSlash,
//   FaComments,
//   FaUserFriends,
//   FaBell,
//   FaEnvelope,
//   FaUserPlus
// } from 'react-icons/fa';

// import { 
//   HiUsers, 
//   HiChatAlt2,
//   HiDotsVertical,
//   HiVolumeUp,
//   HiVolumeOff
// } from 'react-icons/hi';

// function App() {
//   const [users, setUsers] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [currentUser, setCurrentUser] = useState(null);
//   const [isVideoCallActive, setIsVideoCallActive] = useState(false);
//   const [videoRoomId, setVideoRoomId] = useState(`meet-${Math.random().toString(36).substr(2, 9)}`);
//   const [activeVideoUsers, setActiveVideoUsers] = useState([]);
//   const [isVideoInitialized, setIsVideoInitialized] = useState(false);
//   const [showInviteModal, setShowInviteModal] = useState(false);
//   const [sidebarTab, setSidebarTab] = useState('participants');
//   const [isCopied, setIsCopied] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [audioMuted, setAudioMuted] = useState(false);
//   const [videoMuted, setVideoMuted] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [notification, setNotification] = useState('');
//   const [invitedUsers, setInvitedUsers] = useState([]);
//   const [showUserInviteModal, setShowUserInviteModal] = useState(false);
//   const [selectedUserForInvite, setSelectedUserForInvite] = useState(null);
  
//   // Refs
//   const videoContainerRef = useRef(null);
//   const zpInstanceRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const audioRef = useRef(null);

//   // Auto scroll to bottom of messages
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Firebase se real-time messages
//   useEffect(() => {
//     setIsLoading(true);
//     const messagesQuery = query(
//       collection(db, 'messages'), 
//       orderBy('timestamp', 'asc')
//     );
    
//     const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
//       const messagesData = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//       setMessages(messagesData);
//       setIsLoading(false);
//     }, (error) => {
//       console.error('Error fetching messages:', error);
//       setIsLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   // Auto-create 25 users on app start
//   useEffect(() => {
//     const savedUsers = localStorage.getItem('videoAppUsers');
//     if (savedUsers) {
//       setUsers(JSON.parse(savedUsers));
//     } else {
//       createDummyUsers();
//     }

//     // Play notification sound for new messages
//     audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/286/286-preview.mp3');
//   }, []);

//   // 25 Dummy Users with realistic data
//   const createDummyUsers = () => {
//     const names = [
//       'Aarav Sharma', 'Vivaan Patel', 'Aditya Singh', 'Arjun Kumar', 'Reyansh Gupta',
//       'Saanvi Reddy', 'Ananya Mishra', 'Diya Choudhury', 'Aarna Joshi', 'Prisha Malhotra',
//       'Ishaan Verma', 'Shaurya Das', 'Vihaan Nair', 'Krishna Iyer', 'Rudra Menon',
//       'Myra Kapoor', 'Avni Sengupta', 'Anika Banerjee', 'Pari Bansal', 'Kiara Chatterjee',
//       'Rohan Desai', 'Aryan Tiwari', 'Atharva Mehta', 'Dev Khanna', 'Yash Oberoi'
//     ];

//     const dummyUsers = names.map((name, index) => ({
//       id: index + 1,
//       name: name,
//       email: `${name.toLowerCase().replace(' ', '.')}@gmail.com`,
//       avatar: `https://i.pravatar.cc/150?img=${(index % 70) + 1}`,
//       online: Math.random() > 0.3,
//       lastSeen: new Date().toLocaleTimeString(),
//       inVideoCall: false,
//       isTyping: false,
//       invitations: []
//     }));
    
//     setUsers(dummyUsers);
//     localStorage.setItem('videoAppUsers', JSON.stringify(dummyUsers));
//     showNotification('25 users loaded successfully!');
//   };

//   // Firebase mein message send karo
//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !currentUser) return;

//     setIsLoading(true);
//     try {
//       await addDoc(collection(db, 'messages'), {
//         text: newMessage,
//         userName: currentUser.name,
//         userId: currentUser.id,
//         userAvatar: currentUser.avatar,
//         timestamp: serverTimestamp(),
//         isSystemMessage: false
//       });
//       setNewMessage('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//       showNotification('Failed to send message');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Notification system
//   const showNotification = (message) => {
//     setNotification(message);
//     setTimeout(() => setNotification(''), 3000);
    
//     // Play notification sound
//     if (audioRef.current) {
//       audioRef.current.play().catch(() => console.log('Audio play failed'));
//     }
//   };

//   // User login karo
//   const loginUser = (user) => {
//     setCurrentUser(user);
//     setIsMobileMenuOpen(false);
//     showNotification(`Welcome ${user.name}!`);
    
//     // Send login notification
//     addDoc(collection(db, 'messages'), {
//       text: `${user.name} joined the chat`,
//       userName: 'System',
//       userId: 'system',
//       timestamp: serverTimestamp(),
//       isSystemMessage: true
//     });
//   };

//   // Logout karo
//   const logoutUser = () => {
//     if (currentUser) {
//       addDoc(collection(db, 'messages'), {
//         text: `${currentUser.name} left the chat`,
//         userName: 'System',
//         userId: 'system',
//         timestamp: serverTimestamp(),
//         isSystemMessage: true
//       });
//     }
    
//     setCurrentUser(null);
//     stopVideoCall();
//     setIsMobileMenuOpen(false);
//     showNotification('Logged out successfully');
//   };

//   // VIDEO CALLING FUNCTIONS
//   const startVideoCall = async () => {
//     if (!currentUser) {
//       showNotification('Please login first to join video call');
//       return;
//     }
    
//     if (isVideoInitialized) {
//       return;
//     }
    
//     setIsLoading(true);
//     setIsVideoCallActive(true);
//     setIsVideoInitialized(true);
    
//     // Update user status to in video call
//     const updatedUsers = users.map(user => 
//       user.id === currentUser.id ? { ...user, inVideoCall: true } : user
//     );
//     setUsers(updatedUsers);
    
//     // Start video call
//     setTimeout(() => {
//       initializeVideoCall();
//     }, 500);
//   };

//   const stopVideoCall = () => {
//     if (zpInstanceRef.current) {
//       zpInstanceRef.current.leaveRoom();
//       zpInstanceRef.current = null;
//     }
    
//     setIsVideoCallActive(false);
//     setIsVideoInitialized(false);
//     setAudioMuted(false);
//     setVideoMuted(false);
    
//     // Update user status to not in video call
//     const updatedUsers = users.map(user => 
//       user.id === currentUser.id ? { ...user, inVideoCall: false } : user
//     );
//     setUsers(updatedUsers);
    
//     // Clear video container
//     if (videoContainerRef.current) {
//       videoContainerRef.current.innerHTML = '';
//     }
    
//     setActiveVideoUsers([]);
//     showNotification('Meeting ended');
//   };

//   // ZEGOCLOUD Video Call Setup
//   const initializeVideoCall = async () => {
//     if (!videoContainerRef.current || !currentUser) {
//       console.error('Video container or user not found');
//       setIsLoading(false);
//       return;
//     }

//     const serverSecret = "7002f9833bbd967759a04a1b040d3d9d";
    
//     if (!serverSecret) {
//       showNotification("Server Secret not found!");
//       setIsVideoCallActive(false);
//       setIsVideoInitialized(false);
//       setIsLoading(false);
//       return;
//     }

//     try {
//       // Clear previous instance
//       if (zpInstanceRef.current) {
//         zpInstanceRef.current.leaveRoom();
//         zpInstanceRef.current = null;
//       }

//       const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
//         1476383802,
//         serverSecret,
//         videoRoomId,
//         currentUser.id.toString(),
//         currentUser.name
//       );

//       const zp = ZegoUIKitPrebuilt.create(kitToken);
//       zpInstanceRef.current = zp;
      
//       // Clear container before joining
//       videoContainerRef.current.innerHTML = '';
      
//       await zp.joinRoom({
//         container: videoContainerRef.current,
//         scenario: {
//           mode: ZegoUIKitPrebuilt.GroupCall,
//         },
//         turnOnMicrophoneWhenJoining: !audioMuted,
//         turnOnCameraWhenJoining: !videoMuted,
//         showPreJoinView: false,
//         showUserList: true,
//         sharedLinks: [
//           {
//             name: 'Copy invitation',
//             url: `${window.location.origin}${window.location.pathname}?room=${videoRoomId}`
//           }
//         ],
//         onUserJoin: (userList) => {
//           console.log('User joined:', userList);
//           setActiveVideoUsers(prev => [...prev, ...userList]);
//           sendCallNotification(`${userList[0]?.userName || 'Someone'} joined the meeting`);
//           showNotification(`${userList[0]?.userName || 'New user'} joined the meeting`);
          
//           // Auto-join user to video call
//           const joinedUserId = userList[0]?.userID;
//           if (joinedUserId) {
//             const updatedUsers = users.map(user => 
//               user.id == joinedUserId ? { ...user, inVideoCall: true } : user
//             );
//             setUsers(updatedUsers);
//           }
//         },
//         onUserLeave: (userList) => {
//           console.log('User left:', userList);
//           setActiveVideoUsers(prev => 
//             prev.filter(u => u.userID !== userList[0]?.userID)
//           );
//           sendCallNotification(`${userList[0]?.userName || 'Someone'} left the meeting`);
//           showNotification(`${userList[0]?.userName || 'User'} left the meeting`);
          
//           // Update user status
//           const leftUserId = userList[0]?.userID;
//           if (leftUserId) {
//             const updatedUsers = users.map(user => 
//               user.id == leftUserId ? { ...user, inVideoCall: false } : user
//             );
//             setUsers(updatedUsers);
//           }
//         },
//         onJoinRoom: () => {
//           console.log('✅ Meeting joined successfully');
//           sendCallNotification(`${currentUser.name} joined the meeting`);
//           showNotification('Meeting started successfully!');
//           setIsLoading(false);
//         },
//         onLeaveRoom: () => {
//           console.log('❌ Meeting left');
//           sendCallNotification(`${currentUser.name} left the meeting`);
//         },
//         onJoinRoomFailed: (error) => {
//           console.error('❌ Meeting join failed:', error);
//           showNotification('Meeting failed to start: ' + error.message);
//           setIsVideoCallActive(false);
//           setIsVideoInitialized(false);
//           setIsLoading(false);
//         }
//       });
//     } catch (error) {
//       console.error('Meeting error:', error);
//       showNotification('Meeting failed: ' + error.message);
//       setIsVideoCallActive(false);
//       setIsVideoInitialized(false);
//       setIsLoading(false);
//     }
//   };

//   // Video call join/leave notification bhejo
//   const sendCallNotification = async (message) => {
//     try {
//       await addDoc(collection(db, 'messages'), {
//         text: message,
//         userName: 'System',
//         userId: 'system',
//         timestamp: serverTimestamp(),
//         isSystemMessage: true
//       });
//     } catch (error) {
//       console.error('Error sending call notification:', error);
//     }
//   };

//   // Invite link copy karo
//   const copyInviteLink = () => {
//     const inviteLink = `${window.location.origin}${window.location.pathname}?room=${videoRoomId}&user=${currentUser?.id || 'guest'}`;
//     navigator.clipboard.writeText(inviteLink);
//     setIsCopied(true);
//     showNotification('Invite link copied to clipboard!');
//     setTimeout(() => setIsCopied(false), 2000);
//     setShowInviteModal(false);
//   };

//   // Join meeting via link
//   const joinMeeting = (user) => {
//     if (!isVideoCallActive) {
//       startVideoCall();
//     }
//     loginUser(user);
//   };

//   // Toggle audio
//   const toggleAudio = () => {
//     if (zpInstanceRef.current) {
//       if (audioMuted) {
//         zpInstanceRef.current.muteMicrophone(false);
//       } else {
//         zpInstanceRef.current.muteMicrophone(true);
//       }
//     }
//     setAudioMuted(!audioMuted);
//     showNotification(audioMuted ? 'Microphone unmuted' : 'Microphone muted');
//   };

//   // Toggle video
//   const toggleVideo = () => {
//     if (zpInstanceRef.current) {
//       if (videoMuted) {
//         zpInstanceRef.current.muteVideo(false);
//       } else {
//         zpInstanceRef.current.muteVideo(true);
//       }
//     }
//     setVideoMuted(!videoMuted);
//     showNotification(videoMuted ? 'Camera turned on' : 'Camera turned off');
//   };

//   // Format timestamp
//   const formatTime = (timestamp) => {
//     if (!timestamp) return '';
//     const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   // Send invitation to a specific user
//   const sendInvitationToUser = (user) => {
//     setSelectedUserForInvite(user);
//     setShowUserInviteModal(true);
//   };

//   // Confirm sending invitation
//   const confirmSendInvitation = async () => {
//     if (!selectedUserForInvite || !currentUser) return;
    
//     const inviteLink = `${window.location.origin}${window.location.pathname}?room=${videoRoomId}&user=${selectedUserForInvite.id}`;
    
//     try {
//       // Add invitation to Firebase
//       await addDoc(collection(db, 'invitations'), {
//         fromUserId: currentUser.id,
//         fromUserName: currentUser.name,
//         toUserId: selectedUserForInvite.id,
//         toUserName: selectedUserForInvite.name,
//         roomId: videoRoomId,
//         inviteLink: inviteLink,
//         timestamp: serverTimestamp(),
//         status: 'sent'
//       });
      
//       // Add system message
//       await addDoc(collection(db, 'messages'), {
//         text: `${currentUser.name} invited ${selectedUserForInvite.name} to the meeting`,
//         userName: 'System',
//         userId: 'system',
//         timestamp: serverTimestamp(),
//         isSystemMessage: true
//       });
      
//       // Update local state
//       setInvitedUsers(prev => [...prev, selectedUserForInvite.id]);
      
//       showNotification(`Invitation sent to ${selectedUserForInvite.name}!`);
//       setShowUserInviteModal(false);
//       setSelectedUserForInvite(null);
//     } catch (error) {
//       console.error('Error sending invitation:', error);
//       showNotification('Failed to send invitation');
//     }
//   };

//   // Check for URL parameters on component mount
//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const roomId = urlParams.get('room');
//     const userId = urlParams.get('user');
    
//     if (roomId) {
//       setVideoRoomId(roomId);
      
//       if (userId && users.length > 0) {
//         const userToLogin = users.find(u => u.id == userId);
//         if (userToLogin) {
//           loginUser(userToLogin);
//           // Auto start video call if room ID is provided
//           setTimeout(() => {
//             startVideoCall();
//           }, 1000);
//         }
//       }
//     }
//   }, [users]);

//   // Cleanup on component unmount
//   useEffect(() => {
//     return () => {
//       if (zpInstanceRef.current) {
//         zpInstanceRef.current.leaveRoom();
//       }
//     };
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
//       {/* Notification */}
//       {notification && (
//         <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
//           <div className="bg-green-500 text-white px-6 py-3 rounded-2xl shadow-2xl border-2 border-green-300 flex items-center space-x-3">
//             <FaBell className="text-white animate-pulse" />
//             <span className="font-semibold text-sm sm:text-base">{notification}</span>
//           </div>
//         </div>
//       )}

//       {/* Header */}
//       <header className="bg-white/80 backdrop-blur-lg shadow-2xl border-b border-blue-200/50 sticky top-0 z-50">
//         <div className="max-w-8xl mx-auto px-3 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16 lg:h-20">
//             {/* Logo */}
//             <div className="flex items-center space-x-3 lg:space-x-4">
//               <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
//                 <FaVideo className="text-white text-lg lg:text-xl" />
//               </div>
//               <div>
//                 <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                   VideoMeet Pro
//                 </h1>
//                 <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">HD Video Conferencing</p>
//               </div>
//             </div>

//             {/* Mobile Menu Button */}
//             <div className="lg:hidden">
//               <button 
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                 className="p-3 rounded-2xl bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
//               >
//                 <HiDotsVertical className="text-xl text-gray-700" />
//               </button>
//             </div>

//             {/* User Info & Controls - Desktop */}
//             {currentUser ? (
//               <div className="hidden lg:flex items-center space-x-4 lg:space-x-6">
//                 <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl px-4 lg:px-6 py-2 lg:py-3 border-2 border-blue-200/50 shadow-lg transform hover:scale-105 transition-transform duration-300">
//                   <img 
//                     src={currentUser.avatar} 
//                     alt={currentUser.name}
//                     className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-blue-500 shadow-lg"
//                   />
//                   <div>
//                     <span className="text-sm lg:text-base font-semibold text-gray-800">
//                       {currentUser.name}
//                     </span>
//                     <p className="text-xs text-gray-600">Online</p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center space-x-3">
//                   {!isVideoCallActive ? (
//                     <>
//                       <button 
//                         onClick={startVideoCall}
//                         disabled={isLoading}
//                         className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 lg:px-7 py-3 lg:py-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         <FaVideo className="text-sm lg:text-base" />
//                         <span className="font-bold text-sm lg:text-base">New Meeting</span>
//                       </button>
//                       <button 
//                         onClick={() => setShowInviteModal(true)}
//                         className="flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 px-5 lg:px-7 py-3 lg:py-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
//                       >
//                         <FaShareSquare className="text-sm lg:text-base" />
//                         <span className="font-bold text-sm lg:text-base">Invite</span>
//                       </button>
//                     </>
//                   ) : (
//                     <button 
//                       onClick={stopVideoCall}
//                       className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-5 lg:px-7 py-3 lg:py-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
//                     >
//                       <FaPhoneSlash className="text-sm lg:text-base" />
//                       <span className="font-bold text-sm lg:text-base">Leave Call</span>
//                     </button>
//                   )}
//                   <button 
//                     onClick={logoutUser}
//                     className="flex items-center space-x-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 px-4 lg:px-5 py-3 lg:py-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
//                   >
//                     <FaSignOutAlt className="text-sm lg:text-base" />
//                     <span className="font-bold text-sm lg:text-base">Logout</span>
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div className="hidden lg:block">
//                 <button 
//                   onClick={createDummyUsers}
//                   className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
//                 >
//                   <HiUsers className="text-lg lg:text-xl" />
//                   <span className="font-bold text-sm lg:text-base">Load Users</span>
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Mobile Menu */}
//           {isMobileMenuOpen && (
//             <div className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200 py-4 animate-fade-in rounded-b-2xl shadow-2xl">
//               {currentUser ? (
//                 <div className="space-y-4">
//                   <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200">
//                     <img 
//                       src={currentUser.avatar} 
//                       alt={currentUser.name}
//                       className="w-12 h-12 rounded-full border-2 border-blue-500 shadow-lg"
//                     />
//                     <div>
//                       <p className="font-bold text-gray-900">{currentUser.name}</p>
//                       <p className="text-sm text-gray-600">{currentUser.email}</p>
//                     </div>
//                   </div>
                  
//                   <div className="grid grid-cols-2 gap-3">
//                     {!isVideoCallActive ? (
//                       <>
//                         <button 
//                           onClick={startVideoCall}
//                           disabled={isLoading}
//                           className="flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 disabled:opacity-50"
//                         >
//                           <FaVideo className="text-lg" />
//                           <span className="font-bold text-xs">New Meeting</span>
//                         </button>
//                         <button 
//                           onClick={() => setShowInviteModal(true)}
//                           className="flex flex-col items-center justify-center space-y-2 bg-white text-gray-700 border-2 border-gray-300 p-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
//                         >
//                           <FaShareSquare className="text-lg" />
//                           <span className="font-bold text-xs">Invite</span>
//                         </button>
//                       </>
//                     ) : (
//                       <button 
//                         onClick={stopVideoCall}
//                         className="col-span-2 flex items-center justify-center space-x-3 bg-gradient-to-r from-red-600 to-pink-600 text-white p-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
//                       >
//                         <FaPhoneSlash className="text-lg" />
//                         <span className="font-bold">Leave Call</span>
//                       </button>
//                     )}
//                   </div>
                  
//                   <button 
//                     onClick={logoutUser}
//                     className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 p-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
//                   >
//                     <FaSignOutAlt className="text-lg" />
//                     <span className="font-bold">Logout</span>
//                   </button>
//                 </div>
//               ) : (
//                 <button 
//                   onClick={createDummyUsers}
//                   className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
//                 >
//                   <HiUsers className="text-xl" />
//                   <span className="font-bold">Load Users</span>
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       </header>

//       {/* Loading Spinner */}
//       {isLoading && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center space-y-4">
//             <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//             <p className="text-gray-700 font-semibold">Loading...</p>
//           </div>
//         </div>
//       )}

//       {/* Invite Modal */}
//       {showInviteModal && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
//           <div className="bg-white rounded-3xl shadow-3xl max-w-md w-full p-6 lg:p-8 transform transition-all duration-300 scale-95 hover:scale-100 border-2 border-blue-200">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-4">
//                 <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
//                   <FaShareSquare className="text-blue-600 text-xl" />
//                 </div>
//                 <span>Invite People</span>
//               </h3>
//               <button 
//                 onClick={() => setShowInviteModal(false)}
//                 className="text-gray-400 hover:text-gray-600 transition-colors duration-300 p-3 hover:bg-gray-100 rounded-2xl"
//               >
//                 <FaTimes className="text-xl" />
//               </button>
//             </div>
            
//             <p className="text-gray-600 mb-6 text-lg">
//               Share this link to invite others to join:
//             </p>
            
//             <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-4 mb-8">
//               <code className="text-sm text-gray-800 break-all font-mono bg-white/50 p-2 rounded-xl">
//                 {`${window.location.origin}?room=${videoRoomId}`}
//               </code>
//             </div>
            
//             <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
//               <button 
//                 onClick={copyInviteLink}
//                 className="flex-1 flex items-center justify-center space-x-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 lg:py-5 px-6 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
//               >
//                 {isCopied ? (
//                   <FaCheckCircle className="text-green-300 text-xl" />
//                 ) : (
//                   <FaCopy className="text-xl" />
//                 )}
//                 <span className="font-bold text-lg">{isCopied ? 'Copied!' : 'Copy Link'}</span>
//               </button>
//               <button 
//                 onClick={() => setShowInviteModal(false)}
//                 className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 py-4 lg:py-5 px-6 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 font-bold text-lg"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* User Invite Modal */}
//       {showUserInviteModal && selectedUserForInvite && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
//           <div className="bg-white rounded-3xl shadow-3xl max-w-md w-full p-6 lg:p-8 transform transition-all duration-300 scale-95 hover:scale-100 border-2 border-blue-200">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-4">
//                 <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
//                   <FaUserPlus className="text-blue-600 text-xl" />
//                 </div>
//                 <span>Send Invitation</span>
//               </h3>
//               <button 
//                 onClick={() => setShowUserInviteModal(false)}
//                 className="text-gray-400 hover:text-gray-600 transition-colors duration-300 p-3 hover:bg-gray-100 rounded-2xl"
//               >
//                 <FaTimes className="text-xl" />
//               </button>
//             </div>
            
//             <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200 mb-6">
//               <img 
//                 src={selectedUserForInvite.avatar} 
//                 alt={selectedUserForInvite.name}
//                 className="w-16 h-16 rounded-full border-2 border-blue-500 shadow-lg"
//               />
//               <div>
//                 <p className="font-bold text-gray-900 text-lg">{selectedUserForInvite.name}</p>
//                 <p className="text-sm text-gray-600">{selectedUserForInvite.email}</p>
//               </div>
//             </div>
            
//             <p className="text-gray-600 mb-6 text-lg">
//               Send an invitation to {selectedUserForInvite.name} to join your meeting.
//             </p>
            
//             <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
//               <button 
//                 onClick={confirmSendInvitation}
//                 className="flex-1 flex items-center justify-center space-x-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 lg:py-5 px-6 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
//               >
//                 <FaEnvelope className="text-xl" />
//                 <span className="font-bold text-lg">Send Invite</span>
//               </button>
//               <button 
//                 onClick={() => setShowUserInviteModal(false)}
//                 className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 py-4 lg:py-5 px-6 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 font-bold text-lg"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Video Call Section */}
//       {isVideoCallActive && currentUser && (
//         <div className="bg-gray-900 min-h-screen animate-fade-in">
//           {/* Meeting Header */}
//           <div className="bg-gray-800/95 backdrop-blur-lg border-b border-gray-700 shadow-2xl">
//             <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
//               <div className="flex flex-col sm:flex-row justify-between items-center h-16 lg:h-20 space-y-3 sm:space-y-0">
//                 <div className="flex items-center space-x-4 lg:space-x-6">
//                   <h2 className="text-white font-bold text-lg lg:text-xl flex items-center space-x-3 lg:space-x-4">
//                     <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
//                       <FaVideo className="text-white text-lg lg:text-xl" />
//                     </div>
//                     <span className="text-sm sm:text-base lg:text-lg">
//                       Meeting: <span className="text-blue-300 font-mono">{videoRoomId}</span>
//                     </span>
//                   </h2>
//                   <div className="flex items-center space-x-2 text-sm lg:text-base text-gray-300 bg-gray-700/80 px-4 lg:px-5 py-2 rounded-2xl border-2 border-gray-600">
//                     <HiUsers className="text-green-400 text-lg" />
//                     <span>{activeVideoUsers.length + 1} participants online</span>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center space-x-3 lg:space-x-4">
//                   <button 
//                     onClick={() => setShowInviteModal(true)}
//                     className="flex items-center space-x-2 bg-gray-700/80 hover:bg-gray-600/80 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 text-sm lg:text-base border-2 border-gray-600"
//                   >
//                     <FaShareSquare className="text-sm lg:text-base" />
//                     <span className="font-bold">Invite</span>
//                   </button>
//                   <button 
//                     onClick={stopVideoCall}
//                     className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 text-sm lg:text-base"
//                   >
//                     <FaPhoneSlash className="text-sm lg:text-base" />
//                     <span className="font-bold">Leave Call</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Meeting Layout */}
//           <div className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
//             <div className="flex flex-col xl:flex-row gap-4 sm:gap-6 h-[calc(100vh-8rem)] sm:h-[calc(100vh-10rem)]">
//               {/* Video Main Container */}
//               <div className="flex-1 bg-black rounded-3xl overflow-hidden shadow-3xl border-2 border-gray-700 min-h-[400px] sm:min-h-[500px] xl:min-h-0 relative">
//                 <div 
//                   ref={videoContainerRef}
//                   className="w-full h-full bg-gradient-to-br from-gray-900 to-black"
//                 >
//                   {/* Loading state */}
//                   <div className="flex items-center justify-center h-full text-white">
//                     <div className="text-center space-y-6">
//                       <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-4 border-4 border-gray-700 shadow-2xl animate-pulse">
//                         <FaVideo className="text-3xl sm:text-4xl text-gray-500" />
//                       </div>
//                       <div className="space-y-3">
//                         <p className="text-xl sm:text-2xl font-bold text-gray-300">Starting HD Meeting...</p>
//                         <p className="text-gray-400 text-sm sm:text-base">Please allow camera and microphone access</p>
//                         <div className="flex justify-center space-x-2">
//                           <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
//                           <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
//                           <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Video Controls - Desktop */}
//                 <div className="hidden lg:flex absolute bottom-6 left-1/2 transform -translate-x-1/2 space-x-4">
//                   <button 
//                     onClick={toggleAudio}
//                     className={`p-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-110 ${
//                       audioMuted 
//                         ? 'bg-red-600 hover:bg-red-700' 
//                         : 'bg-gray-700/80 hover:bg-gray-600/80 backdrop-blur-sm'
//                     }`}
//                   >
//                     {audioMuted ? (
//                       <HiVolumeOff className="text-white text-xl" />
//                     ) : (
//                       <HiVolumeUp className="text-white text-xl" />
//                     )}
//                   </button>
//                   <button 
//                     onClick={toggleVideo}
//                     className={`p-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-110 ${
//                       videoMuted 
//                         ? 'bg-red-600 hover:bg-red-700' 
//                         : 'bg-gray-700/80 hover:bg-gray-600/80 backdrop-blur-sm'
//                     }`}
//                   >
//                     {videoMuted ? (
//                       <FaVideoSlash className="text-white text-xl" />
//                     ) : (
//                       <FaVideo className="text-white text-xl" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Sidebar */}
//               <div className="xl:w-96 2xl:w-[450px] bg-gray-800/95 backdrop-blur-lg rounded-3xl flex flex-col shadow-3xl border-2 border-gray-700">
//                 {/* Sidebar Tabs */}
//                 <div className="flex border-b border-gray-700">
//                   <button
//                     onClick={() => setSidebarTab('participants')}
//                     className={`flex-1 flex items-center justify-center space-x-3 py-4 lg:py-5 text-sm lg:text-base font-bold transition-all duration-300 ${
//                       sidebarTab === 'participants' 
//                         ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-900/50' 
//                         : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
//                     }`}
//                   >
//                     <FaUserFriends className="text-lg" />
//                     <span>Participants</span>
//                     <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-2xl text-xs font-bold">
//                       {activeVideoUsers.length + 1}
//                     </span>
//                   </button>
//                   <button
//                     onClick={() => setSidebarTab('chat')}
//                     className={`flex-1 flex items-center justify-center space-x-3 py-4 lg:py-5 text-sm lg:text-base font-bold transition-all duration-300 ${
//                       sidebarTab === 'chat' 
//                         ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-900/50' 
//                         : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
//                     }`}
//                   >
//                     <FaComments className="text-lg" />
//                     <span>Live Chat</span>
//                     {messages.length > 0 && (
//                       <span className="bg-blue-500 text-white px-2 py-1 rounded-2xl text-xs font-bold">
//                         {messages.length}
//                       </span>
//                     )}
//                   </button>
//                 </div>

//                 {/* Sidebar Content */}
//                 <div className="flex-1 overflow-hidden">
//                   {sidebarTab === 'participants' ? (
//                     <div className="p-4 sm:p-6 h-full overflow-y-auto custom-scrollbar">
//                       <div className="space-y-4">
//                         {/* Host */}
//                         <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-900/80 to-blue-800/80 rounded-2xl border-2 border-blue-500/50 shadow-2xl transform hover:scale-105 transition-transform duration-300 cursor-pointer group">
//                           <div className="relative">
//                             <img 
//                               src={currentUser.avatar} 
//                               alt={currentUser.name}
//                               className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-blue-400 shadow-2xl group-hover:border-blue-300 transition-colors duration-300"
//                             />
//                             <FaCrown className="absolute -top-2 -right-2 text-yellow-400 text-sm sm:text-base bg-blue-900 rounded-full p-1" />
//                           </div>
//                           <div className="flex-1">
//                             <div className="flex items-center space-x-3">
//                               <span className="text-white font-bold text-sm sm:text-base">
//                                 {currentUser.name}
//                               </span>
//                               <span className="text-blue-300 text-xs bg-blue-900/80 px-3 py-1 rounded-2xl font-bold border border-blue-400">Host</span>
//                             </div>
//                             <div className="flex items-center space-x-2 text-green-400 text-xs sm:text-sm mt-2">
//                               <FaCircle className="text-xs animate-pulse" />
//                               <span className="font-bold">You - Speaking</span>
//                             </div>
//                           </div>
//                           <div className="flex space-x-2">
//                             <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//                             <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
//                             <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
//                           </div>
//                         </div>

//                         {/* Other Participants */}
//                         {activeVideoUsers.map((user, index) => (
//                           <div key={user.userID} className="flex items-center space-x-4 p-4 bg-gray-700/80 rounded-2xl border-2 border-green-500/50 shadow-2xl transform hover:scale-105 transition-transform duration-300 cursor-pointer group">
//                             <img 
//                               src={`https://i.pravatar.cc/150?img=${(parseInt(user.userID) % 70) + 1 || index + 1}`}
//                               alt={user.userName}
//                               className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-green-400 shadow-2xl group-hover:border-green-300 transition-colors duration-300"
//                             />
//                             <div className="flex-1">
//                               <span className="text-white font-bold text-sm sm:text-base">
//                                 {user.userName}
//                               </span>
//                               <div className="flex items-center space-x-2 text-green-400 text-xs sm:text-sm mt-2">
//                                 <FaCircle className="text-xs animate-pulse" />
//                                 <span className="font-bold">Connected</span>
//                               </div>
//                             </div>
//                             <FaVideoIcon className="text-green-400 text-lg sm:text-xl animate-pulse" />
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="h-full flex flex-col">
//                       {/* Chat Messages */}
//                       <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
//                         {messages.map((message, index) => (
//                           <div 
//                             key={message.id} 
//                             className={`p-4 rounded-2xl border-2 shadow-2xl transform hover:scale-105 transition-transform duration-300 cursor-pointer ${
//                               message.isSystemMessage 
//                                 ? 'bg-gradient-to-r from-blue-900/80 to-purple-900/80 border-blue-500/50' 
//                                 : message.userId === currentUser?.id
//                                 ? 'bg-gradient-to-r from-blue-700/80 to-blue-600/80 border-blue-400/50'
//                                 : 'bg-gradient-to-r from-gray-700/80 to-gray-600/80 border-gray-500/50'
//                             }`}
//                           >
//                             <div className="flex items-start space-x-3">
//                               <img 
//                                 src={message.userAvatar || `https://i.pravatar.cc/150?img=${(parseInt(message.userId) % 70) + 1 || 1}`}
//                                 alt={message.userName}
//                                 className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl border-2 border-gray-400 shadow-lg"
//                               />
//                               <div className="flex-1 min-w-0">
//                                 <div className="flex items-center justify-between mb-2">
//                                   <span className={`text-sm sm:text-base font-bold ${
//                                     message.isSystemMessage 
//                                       ? 'text-blue-300' 
//                                       : message.userId === currentUser?.id
//                                       ? 'text-blue-200'
//                                       : 'text-white'
//                                   }`}>
//                                     {message.userName}
//                                     {message.userId === currentUser?.id && (
//                                       <span className="text-blue-300 text-xs ml-2">(You)</span>
//                                     )}
//                                   </span>
//                                   <span className="text-gray-400 text-xs font-bold bg-gray-800/50 px-2 py-1 rounded-xl">
//                                     {formatTime(message.timestamp)}
//                                   </span>
//                                 </div>
//                                 <p className={`text-sm sm:text-base ${
//                                   message.isSystemMessage 
//                                     ? 'text-blue-200 italic' 
//                                     : 'text-gray-200'
//                                 }`}>
//                                   {message.text}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                         <div ref={messagesEndRef} />
//                       </div>

//                       {/* Chat Input */}
//                       <div className="p-4 sm:p-6 border-t-2 border-gray-700 bg-gray-900/50 backdrop-blur-lg">
//                         <form onSubmit={sendMessage} className="flex space-x-3">
//                           <input
//                             type="text"
//                             value={newMessage}
//                             onChange={(e) => setNewMessage(e.target.value)}
//                             placeholder="Type your message..."
//                             disabled={isLoading}
//                             className="flex-1 bg-gray-800 text-white placeholder-gray-400 border-2 border-gray-600 rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-2xl disabled:opacity-50"
//                           />
//                           <button 
//                             type="submit"
//                             disabled={isLoading || !newMessage.trim()}
//                             className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3 sm:p-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
//                           >
//                             <FaPaperPlane className="text-lg sm:text-xl" />
//                           </button>
//                         </form>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Video Controls - Mobile Bottom */}
//             <div className="lg:hidden fixed bottom-6 left-4 right-4 bg-gray-800/95 backdrop-blur-lg rounded-3xl p-4 border-2 border-gray-700 shadow-3xl">
//               <div className="flex justify-center space-x-6">
//                 <button 
//                   onClick={toggleAudio}
//                   className={`p-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-110 ${
//                     audioMuted 
//                       ? 'bg-red-600 hover:bg-red-700' 
//                       : 'bg-gray-700 hover:bg-gray-600'
//                   }`}
//                 >
//                   {audioMuted ? (
//                     <HiVolumeOff className="text-white text-xl" />
//                   ) : (
//                     <HiVolumeUp className="text-white text-xl" />
//                   )}
//                 </button>
//                 <button 
//                   onClick={toggleVideo}
//                   className={`p-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-110 ${
//                     videoMuted 
//                       ? 'bg-red-600 hover:bg-red-700' 
//                       : 'bg-gray-700 hover:bg-gray-600'
//                   }`}
//                 >
//                   {videoMuted ? (
//                     <FaVideoSlash className="text-white text-xl" />
//                   ) : (
//                     <FaVideo className="text-white text-xl" />
//                   )}
//                 </button>
//                 <button 
//                   onClick={stopVideoCall}
//                   className="p-4 bg-red-600 hover:bg-red-700 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-110"
//                 >
//                   <FaPhoneSlash className="text-white text-xl" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Dashboard - When no meeting is active */}
//       {!isVideoCallActive && (
//         <div className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 animate-fade-in">
//           {/* Welcome Section */}
//           <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-3xl border-2 border-blue-200/50 p-6 sm:p-8 lg:p-12 text-center mb-8 sm:mb-12">
//             <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-3xl transform hover:scale-105 transition-transform duration-300">
//               <FaVideo className="text-white text-2xl sm:text-3xl lg:text-4xl" />
//             </div>
//             <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-6">
//               Welcome to VideoMeet Pro
//             </h2>
//             <p className="text-gray-600 text-lg sm:text-xl lg:text-2xl mb-8 sm:mb-10 max-w-4xl mx-auto leading-relaxed">
//               Experience crystal clear HD video calls with real-time messaging and seamless collaboration
//             </p>
//             {currentUser && (
//               <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center">
//                 <button 
//                   onClick={startVideoCall}
//                   disabled={isLoading}
//                   className="flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 rounded-2xl transition-all duration-300 shadow-3xl hover:shadow-4xl transform hover:scale-105 text-lg sm:text-xl lg:text-2xl font-bold disabled:opacity-50"
//                 >
//                   <FaVideo className="text-xl sm:text-2xl" />
//                   <span>Start New Meeting</span>
//                 </button>
//                 <button 
//                   onClick={() => setShowInviteModal(true)}
//                   className="flex items-center justify-center space-x-3 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 rounded-2xl transition-all duration-300 shadow-3xl hover:shadow-4xl transform hover:scale-105 text-lg sm:text-xl lg:text-2xl font-bold"
//                 >
//                   <FaShareSquare className="text-xl sm:text-2xl" />
//                   <span>Get Invite Link</span>
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Main Dashboard */}
//           <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
//             {/* Users Section */}
//             <div className="xl:col-span-2">
//               <div className="bg-white rounded-3xl shadow-3xl border-2 border-blue-200/50 p-6 sm:p-8 lg:p-10">
//                 <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 lg:mb-10 space-y-6 lg:space-y-0">
//                   <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex items-center space-x-4">
//                     <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-2xl">
//                       <HiUsers className="text-blue-600 text-2xl sm:text-3xl" />
//                     </div>
//                     <span>Available Participants ({users.length})</span>
//                   </h2>
//                   <div className="flex items-center space-x-4 lg:space-x-6 text-sm sm:text-base text-gray-600">
//                     <div className="flex items-center space-x-2 bg-green-100 px-4 lg:px-5 py-2 lg:py-3 rounded-2xl border-2 border-green-200 shadow-lg">
//                       <FaCircle className="text-green-500 text-xs" />
//                       <span className="font-bold">{users.filter(u => u.online).length} online</span>
//                     </div>
//                     <div className="flex items-center space-x-2 bg-blue-100 px-4 lg:px-5 py-2 lg:py-3 rounded-2xl border-2 border-blue-200 shadow-lg">
//                       <FaVideoIcon className="text-blue-500 text-xs" />
//                       <span className="font-bold">{users.filter(u => u.inVideoCall).length} in meeting</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 max-h-[600px] sm:max-h-[700px] overflow-y-auto custom-scrollbar p-2">
//                   {users.map(user => (
//                     <div 
//                       key={user.id} 
//                       className={`border-2 rounded-2xl p-4 sm:p-6 transition-all duration-500 hover:scale-105 hover:shadow-3xl cursor-pointer group backdrop-blur-sm ${
//                         currentUser?.id === user.id 
//                           ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-2xl' 
//                           : 'border-gray-200 hover:border-blue-300 bg-white'
//                       } ${user.inVideoCall ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50' : ''} ${
//                         user.online ? 'ring-2 ring-green-500/20' : 'ring-2 ring-gray-300/20'
//                       }`}
//                       onClick={() => !currentUser ? loginUser(user) : null}
//                     >
//                       <div className="flex items-center space-x-3 sm:space-x-4">
//                         <div className="relative">
//                           <img 
//                             src={user.avatar} 
//                             alt={user.name}
//                             className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl border-4 border-gray-300 shadow-2xl group-hover:border-blue-400 transition-all duration-300"
//                           />
//                           <div className={`absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white shadow-2xl ${
//                             user.online ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
//                           }`} />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <h3 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg truncate group-hover:text-blue-600 transition-colors duration-300">
//                             {user.name}
//                           </h3>
//                           <p className="text-gray-500 text-xs sm:text-sm truncate mb-2 sm:mb-3">
//                             {user.email}
//                           </p>
//                           <div className="flex items-center space-x-2">
//                             <span className={`text-xs px-3 py-1 rounded-2xl font-bold border-2 ${
//                               user.online 
//                                 ? 'bg-green-100 text-green-800 border-green-200' 
//                                 : 'bg-gray-100 text-gray-800 border-gray-200'
//                             }`}>
//                               {user.online ? '🟢 Online' : '⚫ Offline'}
//                             </span>
//                             {user.inVideoCall && (
//                               <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-2xl font-bold border-2 border-green-200">
//                                 📹 In Meeting
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
                      
//                       <div className="mt-4 sm:mt-6 space-y-2">
//                         {!currentUser ? (
//                           <button 
//                             onClick={() => loginUser(user)}
//                             className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 sm:py-4 px-4 sm:px-5 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 font-bold text-sm sm:text-base"
//                           >
//                             Join as {user.name.split(' ')[0]}
//                           </button>
//                         ) : currentUser.id === user.id ? (
//                           <button 
//                             onClick={startVideoCall}
//                             disabled={isLoading}
//                             className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 sm:py-4 px-4 sm:px-5 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 font-bold text-sm sm:text-base disabled:opacity-50"
//                           >
//                             🎥 Start Meeting
//                           </button>
//                         ) : (
//                           <>
//                             <button 
//                               onClick={() => joinMeeting(user)}
//                               disabled={!isVideoCallActive}
//                               className={`w-full py-3 sm:py-4 px-4 sm:px-5 rounded-2xl transition-all duration-300 shadow-2xl font-bold text-sm sm:text-base ${
//                                 isVideoCallActive
//                                   ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-3xl transform hover:scale-105'
//                                   : 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                               }`}
//                             >
//                               {isVideoCallActive ? '🎬 Join Meeting' : '⏳ Wait for Host'}
//                             </button>
//                             <button 
//                               onClick={() => sendInvitationToUser(user)}
//                               className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-3 sm:py-4 px-4 sm:px-5 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 font-bold text-sm sm:text-base flex items-center justify-center space-x-2"
//                             >
//                               <FaEnvelope className="text-sm" />
//                               <span>Send Invite</span>
//                             </button>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Global Chat */}
//             {currentUser && (
//               <div className="bg-white rounded-3xl shadow-3xl border-2 border-blue-200/50 p-6 sm:p-8 lg:p-10 flex flex-col">
//                 <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex items-center space-x-4 mb-8 lg:mb-10">
//                   <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-2xl">
//                     <HiChatAlt2 className="text-blue-600 text-2xl sm:text-3xl" />
//                   </div>
//                   <span>Live Global Chat</span>
//                 </h2>

//                 <div className="flex-1 overflow-y-auto space-y-4 mb-6 sm:mb-8 max-h-[400px] sm:max-h-[500px] custom-scrollbar p-2">
//                   {messages.length === 0 ? (
//                     <div className="text-center py-12">
//                       <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                         <FaComments className="text-blue-500 text-2xl" />
//                       </div>
//                       <p className="text-gray-500 text-lg">No messages yet. Start the conversation!</p>
//                     </div>
//                   ) : (
//                     messages.map(message => (
//                       <div 
//                         key={message.id} 
//                         className={`p-4 rounded-2xl border-2 shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer ${
//                           message.userId === currentUser?.id 
//                             ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200' 
//                             : message.isSystemMessage
//                             ? 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200'
//                             : 'bg-gradient-to-br from-gray-50 to-blue-50 border-gray-200'
//                         }`}
//                       >
//                         <div className="flex items-start space-x-3">
//                           <img 
//                             src={message.userAvatar || `https://i.pravatar.cc/150?img=${(parseInt(message.userId) % 70) + 1 || 1}`}
//                             alt={message.userName}
//                             className="w-10 h-10 rounded-2xl border-2 border-gray-300 shadow-lg"
//                           />
//                           <div className="flex-1 min-w-0">
//                             <div className="flex items-center justify-between mb-2">
//                               <span className={`font-bold text-sm sm:text-base ${
//                                 message.userId === currentUser?.id 
//                                   ? 'text-blue-600' 
//                                   : message.isSystemMessage
//                                   ? 'text-purple-600'
//                                   : 'text-gray-700'
//                               }`}>
//                                 {message.userName}
//                                 {message.userId === currentUser?.id && (
//                                   <span className="text-blue-400 text-xs ml-2">(You)</span>
//                                 )}
//                               </span>
//                               <span className="text-gray-500 text-xs font-bold bg-white px-2 py-1 rounded-xl shadow-sm">
//                                 {formatTime(message.timestamp)}
//                               </span>
//                             </div>
//                             <p className={`text-sm sm:text-base ${
//                               message.isSystemMessage ? 'text-purple-600 italic' : 'text-gray-600'
//                             }`}>
//                               {message.text}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                   )}
//                   <div ref={messagesEndRef} />
//                 </div>

//                 <form onSubmit={sendMessage} className="flex space-x-3">
//                   <input
//                     type="text"
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     placeholder="Type your message to everyone..."
//                     disabled={isLoading}
//                     className="flex-1 border-2 border-gray-300 rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-2xl disabled:opacity-50"
//                   />
//                   <button 
//                     type="submit"
//                     disabled={isLoading || !newMessage.trim()}
//                     className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3 sm:p-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 disabled:opacity-50"
//                   >
//                     <FaPaperPlane className="text-lg sm:text-xl" />
//                   </button>
//                 </form>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


// import React, { useState, useEffect, useRef } from 'react';
// import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
// import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
// import { db, auth } from './firebase/config';

// import { 
//   FaVideo, 
//   FaPhoneSlash, 
//   FaShareSquare,
//   FaCopy,
//   FaTimes,
//   FaCrown,
//   FaVideo as FaVideoIcon,
//   FaSignOutAlt,
//   FaCheckCircle,
//   FaCircle,
//   FaPaperPlane,
//   FaUsers,
//   FaMicrophone,
//   FaMicrophoneSlash,
//   FaVideoSlash,
//   FaComments,
//   FaUserFriends,
//   FaBell
// } from 'react-icons/fa';

// import { 
//   HiUsers, 
//   HiChatAlt2,
//   HiDotsVertical,
//   HiVolumeUp,
//   HiVolumeOff
// } from 'react-icons/hi';

// function App() {
//   const [users, setUsers] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [currentUser, setCurrentUser] = useState(null);
//   const [isVideoCallActive, setIsVideoCallActive] = useState(false);
//   const [videoRoomId, setVideoRoomId] = useState(`meet-${Math.random().toString(36).substr(2, 9)}`);
//   const [activeVideoUsers, setActiveVideoUsers] = useState([]);
//   const [isVideoInitialized, setIsVideoInitialized] = useState(false);
//   const [showInviteModal, setShowInviteModal] = useState(false);
//   const [sidebarTab, setSidebarTab] = useState('participants');
//   const [isCopied, setIsCopied] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [audioMuted, setAudioMuted] = useState(false);
//   const [videoMuted, setVideoMuted] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [notification, setNotification] = useState('');
  
//   // Refs
//   const videoContainerRef = useRef(null);
//   const zpInstanceRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const audioRef = useRef(null);

//   // Auto scroll to bottom of messages
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Firebase se real-time messages
//   useEffect(() => {
//     setIsLoading(true);
//     const messagesQuery = query(
//       collection(db, 'messages'), 
//       orderBy('timestamp', 'asc')
//     );
    
//     const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
//       const messagesData = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//       setMessages(messagesData);
//       setIsLoading(false);
//     }, (error) => {
//       console.error('Error fetching messages:', error);
//       setIsLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   // Auto-create 25 users on app start
//   useEffect(() => {
//     const savedUsers = localStorage.getItem('videoAppUsers');
//     if (savedUsers) {
//       setUsers(JSON.parse(savedUsers));
//     } else {
//       createDummyUsers();
//     }

//     // Play notification sound for new messages
//     audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/286/286-preview.mp3');
//   }, []);

//   // URL parameters se room ID aur user ID get karo
//   useEffect(() => {
//     const initializeFromURL = () => {
//       const urlParams = new URLSearchParams(window.location.search);
//       const roomId = urlParams.get('room');
//       const userId = urlParams.get('user');
      
//       console.log('URL Params:', { roomId, userId });
      
//       if (roomId && roomId !== videoRoomId) {
//         setVideoRoomId(roomId);
//         showNotification(`Joined room: ${roomId}`);
//       }
      
//       if (userId && !currentUser) {
//         if (userId !== 'guest') {
//           const userToJoin = users.find(user => user.id == userId);
//           if (userToJoin) {
//             console.log('Logging in user:', userToJoin.name);
//             loginUser(userToJoin);
//             // Auto-join video call if room exists
//             if (roomId && !isVideoCallActive) {
//               console.log('Auto-joining video call');
//               setTimeout(() => {
//                 startVideoCall();
//               }, 2000);
//             }
//           }
//         } else {
//           // Guest user ke liye random user select karo
//           const randomUser = users[Math.floor(Math.random() * users.length)];
//           if (randomUser) {
//             console.log('Logging in guest user:', randomUser.name);
//             loginUser(randomUser);
//             if (roomId && !isVideoCallActive) {
//               setTimeout(() => {
//                 startVideoCall();
//               }, 2000);
//             }
//           }
//         }
//       }
//     };

//     if (users.length > 0) {
//       initializeFromURL();
//     }
//   }, [users, currentUser]);

//   // 25 Dummy Users with realistic data
//   const createDummyUsers = () => {
//     const names = [
//       'Aarav Sharma', 'Vivaan Patel', 'Aditya Singh', 'Arjun Kumar', 'Reyansh Gupta',
//       'Saanvi Reddy', 'Ananya Mishra', 'Diya Choudhury', 'Aarna Joshi', 'Prisha Malhotra',
//       'Ishaan Verma', 'Shaurya Das', 'Vihaan Nair', 'Krishna Iyer', 'Rudra Menon',
//       'Myra Kapoor', 'Avni Sengupta', 'Anika Banerjee', 'Pari Bansal', 'Kiara Chatterjee',
//       'Rohan Desai', 'Aryan Tiwari', 'Atharva Mehta', 'Dev Khanna', 'Yash Oberoi'
//     ];

//     const dummyUsers = names.map((name, index) => ({
//       id: index + 1,
//       name: name,
//       email: `${name.toLowerCase().replace(' ', '.')}@gmail.com`,
//       avatar: `https://i.pravatar.cc/150?img=${(index % 70) + 1}`,
//       online: Math.random() > 0.3,
//       lastSeen: new Date().toLocaleTimeString(),
//       inVideoCall: false,
//       isTyping: false
//     }));
    
//     setUsers(dummyUsers);
//     localStorage.setItem('videoAppUsers', JSON.stringify(dummyUsers));
//     showNotification('25 users loaded successfully!');
//   };

//   // Firebase mein message send karo
//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !currentUser) return;

//     setIsLoading(true);
//     try {
//       await addDoc(collection(db, 'messages'), {
//         text: newMessage,
//         userName: currentUser.name,
//         userId: currentUser.id,
//         userAvatar: currentUser.avatar,
//         timestamp: serverTimestamp(),
//         isSystemMessage: false
//       });
//       setNewMessage('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//       showNotification('Failed to send message');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Notification system
//   const showNotification = (message) => {
//     setNotification(message);
//     setTimeout(() => setNotification(''), 3000);
    
//     // Play notification sound
//     if (audioRef.current) {
//       audioRef.current.play().catch(() => console.log('Audio play failed'));
//     }
//   };

//   // User login karo
//   const loginUser = (user) => {
//     setCurrentUser(user);
//     setIsMobileMenuOpen(false);
//     showNotification(`Welcome ${user.name}!`);
    
//     // Send login notification
//     addDoc(collection(db, 'messages'), {
//       text: `${user.name} joined the chat`,
//       userName: 'System',
//       userId: 'system',
//       timestamp: serverTimestamp(),
//       isSystemMessage: true
//     });
//   };

//   // Logout karo
//   const logoutUser = () => {
//     if (currentUser) {
//       addDoc(collection(db, 'messages'), {
//         text: `${currentUser.name} left the chat`,
//         userName: 'System',
//         userId: 'system',
//         timestamp: serverTimestamp(),
//         isSystemMessage: true
//       });
//     }
    
//     setCurrentUser(null);
//     stopVideoCall();
//     setIsMobileMenuOpen(false);
//     showNotification('Logged out successfully');
//   };

//   // VIDEO CALLING FUNCTIONS
//   const startVideoCall = async () => {
//     if (!currentUser) {
//       showNotification('Please login first to join video call');
//       return;
//     }
    
//     if (isVideoInitialized) {
//       return;
//     }
    
//     setIsLoading(true);
//     setIsVideoCallActive(true);
//     setIsVideoInitialized(true);
    
//     // Update user status to in video call
//     const updatedUsers = users.map(user => 
//       user.id === currentUser.id ? { ...user, inVideoCall: true } : user
//     );
//     setUsers(updatedUsers);
    
//     // Start video call
//     setTimeout(() => {
//       initializeVideoCall();
//     }, 500);
//   };

//   const stopVideoCall = () => {
//     if (zpInstanceRef.current) {
//       zpInstanceRef.current.leaveRoom();
//       zpInstanceRef.current = null;
//     }
    
//     setIsVideoCallActive(false);
//     setIsVideoInitialized(false);
//     setAudioMuted(false);
//     setVideoMuted(false);
    
//     // Update user status to not in video call
//     const updatedUsers = users.map(user => 
//       user.id === currentUser.id ? { ...user, inVideoCall: false } : user
//     );
//     setUsers(updatedUsers);
    
//     // Clear video container
//     if (videoContainerRef.current) {
//       videoContainerRef.current.innerHTML = '';
//     }
    
//     setActiveVideoUsers([]);
//     showNotification('Meeting ended');
//   };

//   // ZEGOCLOUD Video Call Setup
//   const initializeVideoCall = async () => {
//     if (!videoContainerRef.current || !currentUser) {
//       console.error('Video container or user not found');
//       setIsLoading(false);
//       return;
//     }

//     const serverSecret = "7002f9833bbd967759a04a1b040d3d9d";
    
//     if (!serverSecret) {
//       showNotification("Server Secret not found!");
//       setIsVideoCallActive(false);
//       setIsVideoInitialized(false);
//       setIsLoading(false);
//       return;
//     }

//     try {
//       // Clear previous instance
//       if (zpInstanceRef.current) {
//         zpInstanceRef.current.leaveRoom();
//         zpInstanceRef.current = null;
//       }

//       const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
//         1476383802,
//         serverSecret,
//         videoRoomId,
//         currentUser.id.toString(),
//         currentUser.name
//       );

//       const zp = ZegoUIKitPrebuilt.create(kitToken);
//       zpInstanceRef.current = zp;
      
//       // Clear container before joining
//       videoContainerRef.current.innerHTML = '';
      
//       await zp.joinRoom({
//         container: videoContainerRef.current,
//         scenario: {
//           mode: ZegoUIKitPrebuilt.GroupCall,
//         },
//         turnOnMicrophoneWhenJoining: !audioMuted,
//         turnOnCameraWhenJoining: !videoMuted,
//         showPreJoinView: false,
//         showUserList: true,
//         sharedLinks: [
//           {
//             name: 'Copy invitation',
//             url: `${window.location.origin}?room=${videoRoomId}&user=guest`
//           }
//         ],
//         onUserJoin: (userList) => {
//           console.log('User joined:', userList);
//           setActiveVideoUsers(prev => [...prev, ...userList]);
//           sendCallNotification(`${userList[0]?.userName || 'Someone'} joined the meeting`);
//           showNotification(`${userList[0]?.userName || 'New user'} joined the meeting`);
          
//           // Auto-join user to video call
//           const joinedUserId = userList[0]?.userID;
//           if (joinedUserId) {
//             const updatedUsers = users.map(user => 
//               user.id == joinedUserId ? { ...user, inVideoCall: true } : user
//             );
//             setUsers(updatedUsers);
//           }
//         },
//         onUserLeave: (userList) => {
//           console.log('User left:', userList);
//           setActiveVideoUsers(prev => 
//             prev.filter(u => u.userID !== userList[0]?.userID)
//           );
//           sendCallNotification(`${userList[0]?.userName || 'Someone'} left the meeting`);
//           showNotification(`${userList[0]?.userName || 'User'} left the meeting`);
          
//           // Update user status
//           const leftUserId = userList[0]?.userID;
//           if (leftUserId) {
//             const updatedUsers = users.map(user => 
//               user.id == leftUserId ? { ...user, inVideoCall: false } : user
//             );
//             setUsers(updatedUsers);
//           }
//         },
//         onJoinRoom: () => {
//           console.log('✅ Meeting joined successfully');
//           sendCallNotification(`${currentUser.name} joined the meeting`);
//           showNotification('Meeting started successfully!');
//           setIsLoading(false);
//         },
//         onLeaveRoom: () => {
//           console.log('❌ Meeting left');
//           sendCallNotification(`${currentUser.name} left the meeting`);
//         },
//         onJoinRoomFailed: (error) => {
//           console.error('❌ Meeting join failed:', error);
//           showNotification('Meeting failed to start: ' + error.message);
//           setIsVideoCallActive(false);
//           setIsVideoInitialized(false);
//           setIsLoading(false);
//         }
//       });
//     } catch (error) {
//       console.error('Meeting error:', error);
//       showNotification('Meeting failed: ' + error.message);
//       setIsVideoCallActive(false);
//       setIsVideoInitialized(false);
//       setIsLoading(false);
//     }
//   };

//   // Video call join/leave notification bhejo
//   const sendCallNotification = async (message) => {
//     try {
//       await addDoc(collection(db, 'messages'), {
//         text: message,
//         userName: 'System',
//         userId: 'system',
//         timestamp: serverTimestamp(),
//         isSystemMessage: true
//       });
//     } catch (error) {
//       console.error('Error sending call notification:', error);
//     }
//   };

//   // Improved invite link function
//   const copyInviteLink = () => {
//     const inviteLink = `${window.location.origin}?room=${videoRoomId}&user=guest`;
//     navigator.clipboard.writeText(inviteLink);
//     setIsCopied(true);
//     showNotification('Invite link copied! Share this link with others');
//     setTimeout(() => setIsCopied(false), 2000);
//     setShowInviteModal(false);
//   };

//   // Join meeting via link
//   const joinMeeting = (user) => {
//     if (!isVideoCallActive) {
//       startVideoCall();
//     }
//     loginUser(user);
//   };

//   // Toggle audio
//   const toggleAudio = () => {
//     setAudioMuted(!audioMuted);
//     showNotification(audioMuted ? 'Microphone unmuted' : 'Microphone muted');
//     // Implement actual audio toggle logic with Zego SDK
//   };

//   // Toggle video
//   const toggleVideo = () => {
//     setVideoMuted(!videoMuted);
//     showNotification(videoMuted ? 'Camera turned on' : 'Camera turned off');
//     // Implement actual video toggle logic with Zego SDK
//   };

//   // Format timestamp
//   const formatTime = (timestamp) => {
//     if (!timestamp) return '';
//     const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   // Cleanup on component unmount
//   useEffect(() => {
//     return () => {
//       if (zpInstanceRef.current) {
//         zpInstanceRef.current.leaveRoom();
//       }
//     };
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
//       {/* Notification */}
//       {notification && (
//         <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
//           <div className="bg-green-500 text-white px-6 py-3 rounded-2xl shadow-2xl border-2 border-green-300 flex items-center space-x-3">
//             <FaBell className="text-white animate-pulse" />
//             <span className="font-semibold text-sm sm:text-base">{notification}</span>
//           </div>
//         </div>
//       )}

//       {/* Header */}
//       <header className="bg-white/80 backdrop-blur-lg shadow-2xl border-b border-blue-200/50 sticky top-0 z-50">
//         <div className="max-w-8xl mx-auto px-3 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16 lg:h-20">
//             {/* Logo */}
//             <div className="flex items-center space-x-3 lg:space-x-4">
//               <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
//                 <FaVideo className="text-white text-lg lg:text-xl" />
//               </div>
//               <div>
//                 <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                   VideoMeet Pro
//                 </h1>
//                 <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">HD Video Conferencing</p>
//               </div>
//             </div>

//             {/* Mobile Menu Button */}
//             <div className="lg:hidden">
//               <button 
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                 className="p-3 rounded-2xl bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
//               >
//                 <HiDotsVertical className="text-xl text-gray-700" />
//               </button>
//             </div>

//             {/* User Info & Controls - Desktop */}
//             {currentUser ? (
//               <div className="hidden lg:flex items-center space-x-4 lg:space-x-6">
//                 <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl px-4 lg:px-6 py-2 lg:py-3 border-2 border-blue-200/50 shadow-lg transform hover:scale-105 transition-transform duration-300">
//                   <img 
//                     src={currentUser.avatar} 
//                     alt={currentUser.name}
//                     className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-blue-500 shadow-lg"
//                   />
//                   <div>
//                     <span className="text-sm lg:text-base font-semibold text-gray-800">
//                       {currentUser.name}
//                     </span>
//                     <p className="text-xs text-gray-600">Online</p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center space-x-3">
//                   {!isVideoCallActive ? (
//                     <>
//                       <button 
//                         onClick={startVideoCall}
//                         disabled={isLoading}
//                         className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 lg:px-7 py-3 lg:py-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         <FaVideo className="text-sm lg:text-base" />
//                         <span className="font-bold text-sm lg:text-base">New Meeting</span>
//                       </button>
//                       <button 
//                         onClick={() => setShowInviteModal(true)}
//                         className="flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 px-5 lg:px-7 py-3 lg:py-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
//                       >
//                         <FaShareSquare className="text-sm lg:text-base" />
//                         <span className="font-bold text-sm lg:text-base">Invite</span>
//                       </button>
//                     </>
//                   ) : (
//                     <button 
//                       onClick={stopVideoCall}
//                       className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-5 lg:px-7 py-3 lg:py-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
//                     >
//                       <FaPhoneSlash className="text-sm lg:text-base" />
//                       <span className="font-bold text-sm lg:text-base">Leave Call</span>
//                     </button>
//                   )}
//                   <button 
//                     onClick={logoutUser}
//                     className="flex items-center space-x-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 px-4 lg:px-5 py-3 lg:py-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
//                   >
//                     <FaSignOutAlt className="text-sm lg:text-base" />
//                     <span className="font-bold text-sm lg:text-base">Logout</span>
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div className="hidden lg:block">
//                 <button 
//                   onClick={createDummyUsers}
//                   className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
//                 >
//                   <HiUsers className="text-lg lg:text-xl" />
//                   <span className="font-bold text-sm lg:text-base">Load Users</span>
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Mobile Menu */}
//           {isMobileMenuOpen && (
//             <div className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200 py-4 animate-fade-in rounded-b-2xl shadow-2xl">
//               {currentUser ? (
//                 <div className="space-y-4">
//                   <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200">
//                     <img 
//                       src={currentUser.avatar} 
//                       alt={currentUser.name}
//                       className="w-12 h-12 rounded-full border-2 border-blue-500 shadow-lg"
//                     />
//                     <div>
//                       <p className="font-bold text-gray-900">{currentUser.name}</p>
//                       <p className="text-sm text-gray-600">{currentUser.email}</p>
//                     </div>
//                   </div>
                  
//                   <div className="grid grid-cols-2 gap-3">
//                     {!isVideoCallActive ? (
//                       <>
//                         <button 
//                           onClick={startVideoCall}
//                           disabled={isLoading}
//                           className="flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 disabled:opacity-50"
//                         >
//                           <FaVideo className="text-lg" />
//                           <span className="font-bold text-xs">New Meeting</span>
//                         </button>
//                         <button 
//                           onClick={() => setShowInviteModal(true)}
//                           className="flex flex-col items-center justify-center space-y-2 bg-white text-gray-700 border-2 border-gray-300 p-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
//                         >
//                           <FaShareSquare className="text-lg" />
//                           <span className="font-bold text-xs">Invite</span>
//                         </button>
//                       </>
//                     ) : (
//                       <button 
//                         onClick={stopVideoCall}
//                         className="col-span-2 flex items-center justify-center space-x-3 bg-gradient-to-r from-red-600 to-pink-600 text-white p-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
//                       >
//                         <FaPhoneSlash className="text-lg" />
//                         <span className="font-bold">Leave Call</span>
//                       </button>
//                     )}
//                   </div>
                  
//                   <button 
//                     onClick={logoutUser}
//                     className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 p-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
//                   >
//                     <FaSignOutAlt className="text-lg" />
//                     <span className="font-bold">Logout</span>
//                   </button>
//                 </div>
//               ) : (
//                 <button 
//                   onClick={createDummyUsers}
//                   className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
//                 >
//                   <HiUsers className="text-xl" />
//                   <span className="font-bold">Load Users</span>
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       </header>

//       {/* Loading Spinner */}
//       {isLoading && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center space-y-4">
//             <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//             <p className="text-gray-700 font-semibold">Loading...</p>
//           </div>
//         </div>
//       )}

//       {/* Invite Modal */}
//       {showInviteModal && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
//           <div className="bg-white rounded-3xl shadow-3xl max-w-md w-full p-6 lg:p-8 transform transition-all duration-300 scale-95 hover:scale-100 border-2 border-blue-200">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-4">
//                 <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
//                   <FaShareSquare className="text-blue-600 text-xl" />
//                 </div>
//                 <span>Invite People</span>
//               </h3>
//               <button 
//                 onClick={() => setShowInviteModal(false)}
//                 className="text-gray-400 hover:text-gray-600 transition-colors duration-300 p-3 hover:bg-gray-100 rounded-2xl"
//               >
//                 <FaTimes className="text-xl" />
//               </button>
//             </div>
            
//             <p className="text-gray-600 mb-6 text-lg">
//               Share this link to invite others to join:
//             </p>
            
//             <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-4 mb-8">
//               <code className="text-sm text-gray-800 break-all font-mono bg-white/50 p-2 rounded-xl">
//                 {`${window.location.origin}?room=${videoRoomId}&user=guest`}
//               </code>
//             </div>
            
//             <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
//               <button 
//                 onClick={copyInviteLink}
//                 className="flex-1 flex items-center justify-center space-x-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 lg:py-5 px-6 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
//               >
//                 {isCopied ? (
//                   <FaCheckCircle className="text-green-300 text-xl" />
//                 ) : (
//                   <FaCopy className="text-xl" />
//                 )}
//                 <span className="font-bold text-lg">{isCopied ? 'Copied!' : 'Copy Link'}</span>
//               </button>
//               <button 
//                 onClick={() => setShowInviteModal(false)}
//                 className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 py-4 lg:py-5 px-6 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 font-bold text-lg"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Video Call Section */}
//       {isVideoCallActive && currentUser && (
//         <div className="bg-gray-900 min-h-screen animate-fade-in">
//           {/* Meeting Header */}
//           <div className="bg-gray-800/95 backdrop-blur-lg border-b border-gray-700 shadow-2xl">
//             <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
//               <div className="flex flex-col sm:flex-row justify-between items-center h-16 lg:h-20 space-y-3 sm:space-y-0">
//                 <div className="flex items-center space-x-4 lg:space-x-6">
//                   <h2 className="text-white font-bold text-lg lg:text-xl flex items-center space-x-3 lg:space-x-4">
//                     <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
//                       <FaVideo className="text-white text-lg lg:text-xl" />
//                     </div>
//                     <span className="text-sm sm:text-base lg:text-lg">
//                       Meeting: <span className="text-blue-300 font-mono">{videoRoomId}</span>
//                     </span>
//                   </h2>
//                   <div className="flex items-center space-x-2 text-sm lg:text-base text-gray-300 bg-gray-700/80 px-4 lg:px-5 py-2 rounded-2xl border-2 border-gray-600">
//                     <HiUsers className="text-green-400 text-lg" />
//                     <span>{activeVideoUsers.length + 1} participants online</span>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center space-x-3 lg:space-x-4">
//                   <button 
//                     onClick={() => setShowInviteModal(true)}
//                     className="flex items-center space-x-2 bg-gray-700/80 hover:bg-gray-600/80 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 text-sm lg:text-base border-2 border-gray-600"
//                   >
//                     <FaShareSquare className="text-sm lg:text-base" />
//                     <span className="font-bold">Invite</span>
//                   </button>
//                   <button 
//                     onClick={stopVideoCall}
//                     className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 text-sm lg:text-base"
//                   >
//                     <FaPhoneSlash className="text-sm lg:text-base" />
//                     <span className="font-bold">Leave Call</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Meeting Layout */}
//           <div className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
//             <div className="flex flex-col xl:flex-row gap-4 sm:gap-6 h-[calc(100vh-8rem)] sm:h-[calc(100vh-10rem)]">
//               {/* Video Main Container */}
//               <div className="flex-1 bg-black rounded-3xl overflow-hidden shadow-3xl border-2 border-gray-700 min-h-[400px] sm:min-h-[500px] xl:min-h-0 relative">
//                 <div 
//                   ref={videoContainerRef}
//                   className="w-full h-full bg-gradient-to-br from-gray-900 to-black"
//                 >
//                   {/* Loading state */}
//                   <div className="flex items-center justify-center h-full text-white">
//                     <div className="text-center space-y-6">
//                       <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-4 border-4 border-gray-700 shadow-2xl animate-pulse">
//                         <FaVideo className="text-3xl sm:text-4xl text-gray-500" />
//                       </div>
//                       <div className="space-y-3">
//                         <p className="text-xl sm:text-2xl font-bold text-gray-300">Starting HD Meeting...</p>
//                         <p className="text-gray-400 text-sm sm:text-base">Please allow camera and microphone access</p>
//                         <div className="flex justify-center space-x-2">
//                           <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
//                           <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
//                           <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Video Controls - Desktop */}
//                 <div className="hidden lg:flex absolute bottom-6 left-1/2 transform -translate-x-1/2 space-x-4">
//                   <button 
//                     onClick={toggleAudio}
//                     className={`p-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-110 ${
//                       audioMuted 
//                         ? 'bg-red-600 hover:bg-red-700' 
//                         : 'bg-gray-700/80 hover:bg-gray-600/80 backdrop-blur-sm'
//                     }`}
//                   >
//                     {audioMuted ? (
//                       <HiVolumeOff className="text-white text-xl" />
//                     ) : (
//                       <HiVolumeUp className="text-white text-xl" />
//                     )}
//                   </button>
//                   <button 
//                     onClick={toggleVideo}
//                     className={`p-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-110 ${
//                       videoMuted 
//                         ? 'bg-red-600 hover:bg-red-700' 
//                         : 'bg-gray-700/80 hover:bg-gray-600/80 backdrop-blur-sm'
//                     }`}
//                   >
//                     {videoMuted ? (
//                       <FaVideoSlash className="text-white text-xl" />
//                     ) : (
//                       <FaVideo className="text-white text-xl" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Sidebar */}
//               <div className="xl:w-96 2xl:w-[450px] bg-gray-800/95 backdrop-blur-lg rounded-3xl flex flex-col shadow-3xl border-2 border-gray-700">
//                 {/* Sidebar Tabs */}
//                 <div className="flex border-b border-gray-700">
//                   <button
//                     onClick={() => setSidebarTab('participants')}
//                     className={`flex-1 flex items-center justify-center space-x-3 py-4 lg:py-5 text-sm lg:text-base font-bold transition-all duration-300 ${
//                       sidebarTab === 'participants' 
//                         ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-900/50' 
//                         : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
//                     }`}
//                   >
//                     <FaUserFriends className="text-lg" />
//                     <span>Participants</span>
//                     <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-2xl text-xs font-bold">
//                       {activeVideoUsers.length + 1}
//                     </span>
//                   </button>
//                   <button
//                     onClick={() => setSidebarTab('chat')}
//                     className={`flex-1 flex items-center justify-center space-x-3 py-4 lg:py-5 text-sm lg:text-base font-bold transition-all duration-300 ${
//                       sidebarTab === 'chat' 
//                         ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-900/50' 
//                         : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
//                     }`}
//                   >
//                     <FaComments className="text-lg" />
//                     <span>Live Chat</span>
//                     {messages.length > 0 && (
//                       <span className="bg-blue-500 text-white px-2 py-1 rounded-2xl text-xs font-bold">
//                         {messages.length}
//                       </span>
//                     )}
//                   </button>
//                 </div>

//                 {/* Sidebar Content */}
//                 <div className="flex-1 overflow-hidden">
//                   {sidebarTab === 'participants' ? (
//                     <div className="p-4 sm:p-6 h-full overflow-y-auto custom-scrollbar">
//                       <div className="space-y-4">
//                         {/* Host */}
//                         <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-900/80 to-blue-800/80 rounded-2xl border-2 border-blue-500/50 shadow-2xl transform hover:scale-105 transition-transform duration-300 cursor-pointer group">
//                           <div className="relative">
//                             <img 
//                               src={currentUser.avatar} 
//                               alt={currentUser.name}
//                               className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-blue-400 shadow-2xl group-hover:border-blue-300 transition-colors duration-300"
//                             />
//                             <FaCrown className="absolute -top-2 -right-2 text-yellow-400 text-sm sm:text-base bg-blue-900 rounded-full p-1" />
//                           </div>
//                           <div className="flex-1">
//                             <div className="flex items-center space-x-3">
//                               <span className="text-white font-bold text-sm sm:text-base">
//                                 {currentUser.name}
//                               </span>
//                               <span className="text-blue-300 text-xs bg-blue-900/80 px-3 py-1 rounded-2xl font-bold border border-blue-400">Host</span>
//                             </div>
//                             <div className="flex items-center space-x-2 text-green-400 text-xs sm:text-sm mt-2">
//                               <FaCircle className="text-xs animate-pulse" />
//                               <span className="font-bold">You - Speaking</span>
//                             </div>
//                           </div>
//                           <div className="flex space-x-2">
//                             <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//                             <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
//                             <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
//                           </div>
//                         </div>

//                         {/* Other Participants */}
//                         {activeVideoUsers.map((user, index) => (
//                           <div key={user.userID} className="flex items-center space-x-4 p-4 bg-gray-700/80 rounded-2xl border-2 border-green-500/50 shadow-2xl transform hover:scale-105 transition-transform duration-300 cursor-pointer group">
//                             <img 
//                               src={`https://i.pravatar.cc/150?img=${(parseInt(user.userID) % 70) + 1 || index + 1}`}
//                               alt={user.userName}
//                               className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-green-400 shadow-2xl group-hover:border-green-300 transition-colors duration-300"
//                             />
//                             <div className="flex-1">
//                               <span className="text-white font-bold text-sm sm:text-base">
//                                 {user.userName}
//                               </span>
//                               <div className="flex items-center space-x-2 text-green-400 text-xs sm:text-sm mt-2">
//                                 <FaCircle className="text-xs animate-pulse" />
//                                 <span className="font-bold">Connected</span>
//                               </div>
//                             </div>
//                             <FaVideoIcon className="text-green-400 text-lg sm:text-xl animate-pulse" />
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="h-full flex flex-col">
//                       {/* Chat Messages */}
//                       <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
//                         {messages.map((message, index) => (
//                           <div 
//                             key={message.id} 
//                             className={`p-4 rounded-2xl border-2 shadow-2xl transform hover:scale-105 transition-transform duration-300 cursor-pointer ${
//                               message.isSystemMessage 
//                                 ? 'bg-gradient-to-r from-blue-900/80 to-purple-900/80 border-blue-500/50' 
//                                 : message.userId === currentUser?.id
//                                 ? 'bg-gradient-to-r from-blue-700/80 to-blue-600/80 border-blue-400/50'
//                                 : 'bg-gradient-to-r from-gray-700/80 to-gray-600/80 border-gray-500/50'
//                             }`}
//                           >
//                             <div className="flex items-start space-x-3">
//                               <img 
//                                 src={message.userAvatar || `https://i.pravatar.cc/150?img=${(parseInt(message.userId) % 70) + 1 || 1}`}
//                                 alt={message.userName}
//                                 className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl border-2 border-gray-400 shadow-lg"
//                               />
//                               <div className="flex-1 min-w-0">
//                                 <div className="flex items-center justify-between mb-2">
//                                   <span className={`text-sm sm:text-base font-bold ${
//                                     message.isSystemMessage 
//                                       ? 'text-blue-300' 
//                                       : message.userId === currentUser?.id
//                                       ? 'text-blue-200'
//                                       : 'text-white'
//                                   }`}>
//                                     {message.userName}
//                                     {message.userId === currentUser?.id && (
//                                       <span className="text-blue-300 text-xs ml-2">(You)</span>
//                                     )}
//                                   </span>
//                                   <span className="text-gray-400 text-xs font-bold bg-gray-800/50 px-2 py-1 rounded-xl">
//                                     {formatTime(message.timestamp)}
//                                   </span>
//                                 </div>
//                                 <p className={`text-sm sm:text-base ${
//                                   message.isSystemMessage 
//                                     ? 'text-blue-200 italic' 
//                                     : 'text-gray-200'
//                                 }`}>
//                                   {message.text}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                         <div ref={messagesEndRef} />
//                       </div>

//                       {/* Chat Input */}
//                       <div className="p-4 sm:p-6 border-t-2 border-gray-700 bg-gray-900/50 backdrop-blur-lg">
//                         <form onSubmit={sendMessage} className="flex space-x-3">
//                           <input
//                             type="text"
//                             value={newMessage}
//                             onChange={(e) => setNewMessage(e.target.value)}
//                             placeholder="Type your message..."
//                             disabled={isLoading}
//                             className="flex-1 bg-gray-800 text-white placeholder-gray-400 border-2 border-gray-600 rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-2xl disabled:opacity-50"
//                           />
//                           <button 
//                             type="submit"
//                             disabled={isLoading || !newMessage.trim()}
//                             className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3 sm:p-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
//                           >
//                             <FaPaperPlane className="text-lg sm:text-xl" />
//                           </button>
//                         </form>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Video Controls - Mobile Bottom */}
//             <div className="lg:hidden fixed bottom-6 left-4 right-4 bg-gray-800/95 backdrop-blur-lg rounded-3xl p-4 border-2 border-gray-700 shadow-3xl">
//               <div className="flex justify-center space-x-6">
//                 <button 
//                   onClick={toggleAudio}
//                   className={`p-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-110 ${
//                     audioMuted 
//                       ? 'bg-red-600 hover:bg-red-700' 
//                       : 'bg-gray-700 hover:bg-gray-600'
//                   }`}
//                 >
//                   {audioMuted ? (
//                     <HiVolumeOff className="text-white text-xl" />
//                   ) : (
//                     <HiVolumeUp className="text-white text-xl" />
//                   )}
//                 </button>
//                 <button 
//                   onClick={toggleVideo}
//                   className={`p-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-110 ${
//                     videoMuted 
//                       ? 'bg-red-600 hover:bg-red-700' 
//                       : 'bg-gray-700 hover:bg-gray-600'
//                   }`}
//                 >
//                   {videoMuted ? (
//                     <FaVideoSlash className="text-white text-xl" />
//                   ) : (
//                     <FaVideo className="text-white text-xl" />
//                   )}
//                 </button>
//                 <button 
//                   onClick={stopVideoCall}
//                   className="p-4 bg-red-600 hover:bg-red-700 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-110"
//                 >
//                   <FaPhoneSlash className="text-white text-xl" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Dashboard - When no meeting is active */}
//       {!isVideoCallActive && (
//         <div className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 animate-fade-in">
//           {/* Welcome Section */}
//           <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-3xl border-2 border-blue-200/50 p-6 sm:p-8 lg:p-12 text-center mb-8 sm:mb-12">
//             <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-3xl transform hover:scale-105 transition-transform duration-300">
//               <FaVideo className="text-white text-2xl sm:text-3xl lg:text-4xl" />
//             </div>
//             <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-6">
//               Welcome to VideoMeet Pro
//             </h2>
//             <p className="text-gray-600 text-lg sm:text-xl lg:text-2xl mb-8 sm:mb-10 max-w-4xl mx-auto leading-relaxed">
//               Experience crystal clear HD video calls with real-time messaging and seamless collaboration
//             </p>
//             {currentUser && (
//               <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center">
//                 <button 
//                   onClick={startVideoCall}
//                   disabled={isLoading}
//                   className="flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 rounded-2xl transition-all duration-300 shadow-3xl hover:shadow-4xl transform hover:scale-105 text-lg sm:text-xl lg:text-2xl font-bold disabled:opacity-50"
//                 >
//                   <FaVideo className="text-xl sm:text-2xl" />
//                   <span>Start New Meeting</span>
//                 </button>
//                 <button 
//                   onClick={() => setShowInviteModal(true)}
//                   className="flex items-center justify-center space-x-3 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 rounded-2xl transition-all duration-300 shadow-3xl hover:shadow-4xl transform hover:scale-105 text-lg sm:text-xl lg:text-2xl font-bold"
//                 >
//                   <FaShareSquare className="text-xl sm:text-2xl" />
//                   <span>Get Invite Link</span>
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Main Dashboard */}
//           <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
//             {/* Users Section */}
//             <div className="xl:col-span-2">
//               <div className="bg-white rounded-3xl shadow-3xl border-2 border-blue-200/50 p-6 sm:p-8 lg:p-10">
//                 <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 lg:mb-10 space-y-6 lg:space-y-0">
//                   <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex items-center space-x-4">
//                     <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-2xl">
//                       <HiUsers className="text-blue-600 text-2xl sm:text-3xl" />
//                     </div>
//                     <span>Available Participants ({users.length})</span>
//                   </h2>
//                   <div className="flex items-center space-x-4 lg:space-x-6 text-sm sm:text-base text-gray-600">
//                     <div className="flex items-center space-x-2 bg-green-100 px-4 lg:px-5 py-2 lg:py-3 rounded-2xl border-2 border-green-200 shadow-lg">
//                       <FaCircle className="text-green-500 text-xs" />
//                       <span className="font-bold">{users.filter(u => u.online).length} online</span>
//                     </div>
//                     <div className="flex items-center space-x-2 bg-blue-100 px-4 lg:px-5 py-2 lg:py-3 rounded-2xl border-2 border-blue-200 shadow-lg">
//                       <FaVideoIcon className="text-blue-500 text-xs" />
//                       <span className="font-bold">{users.filter(u => u.inVideoCall).length} in meeting</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 max-h-[600px] sm:max-h-[700px] overflow-y-auto custom-scrollbar p-2">
//                   {users.map(user => (
//                     <div 
//                       key={user.id} 
//                       className={`border-2 rounded-2xl p-4 sm:p-6 transition-all duration-500 hover:scale-105 hover:shadow-3xl cursor-pointer group backdrop-blur-sm ${
//                         currentUser?.id === user.id 
//                           ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-2xl' 
//                           : 'border-gray-200 hover:border-blue-300 bg-white'
//                       } ${user.inVideoCall ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50' : ''} ${
//                         user.online ? 'ring-2 ring-green-500/20' : 'ring-2 ring-gray-300/20'
//                       }`}
//                       onClick={() => !currentUser ? loginUser(user) : null}
//                     >
//                       <div className="flex items-center space-x-3 sm:space-x-4">
//                         <div className="relative">
//                           <img 
//                             src={user.avatar} 
//                             alt={user.name}
//                             className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl border-4 border-gray-300 shadow-2xl group-hover:border-blue-400 transition-all duration-300"
//                           />
//                           <div className={`absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white shadow-2xl ${
//                             user.online ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
//                           }`} />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <h3 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg truncate group-hover:text-blue-600 transition-colors duration-300">
//                             {user.name}
//                           </h3>
//                           <p className="text-gray-500 text-xs sm:text-sm truncate mb-2 sm:mb-3">
//                             {user.email}
//                           </p>
//                           <div className="flex items-center space-x-2">
//                             <span className={`text-xs px-3 py-1 rounded-2xl font-bold border-2 ${
//                               user.online 
//                                 ? 'bg-green-100 text-green-800 border-green-200' 
//                                 : 'bg-gray-100 text-gray-800 border-gray-200'
//                             }`}>
//                               {user.online ? '🟢 Online' : '⚫ Offline'}
//                             </span>
//                             {user.inVideoCall && (
//                               <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-2xl font-bold border-2 border-green-200">
//                                 📹 In Meeting
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
                      
//                       <div className="mt-4 sm:mt-6">
//                         {!currentUser ? (
//                           <button 
//                             onClick={() => loginUser(user)}
//                             className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 sm:py-4 px-4 sm:px-5 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 font-bold text-sm sm:text-base"
//                           >
//                             Join as {user.name.split(' ')[0]}
//                           </button>
//                         ) : currentUser.id === user.id ? (
//                           <button 
//                             onClick={startVideoCall}
//                             disabled={isLoading}
//                             className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 sm:py-4 px-4 sm:px-5 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 font-bold text-sm sm:text-base disabled:opacity-50"
//                           >
//                             🎥 Start Meeting
//                           </button>
//                         ) : (
//                           <button 
//                             onClick={() => joinMeeting(user)}
//                             disabled={!isVideoCallActive}
//                             className={`w-full py-3 sm:py-4 px-4 sm:px-5 rounded-2xl transition-all duration-300 shadow-2xl font-bold text-sm sm:text-base ${
//                               isVideoCallActive
//                                 ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-3xl transform hover:scale-105'
//                                 : 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                             }`}
//                           >
//                             {isVideoCallActive ? '🎬 Join Meeting' : '⏳ Wait for Host'}
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Global Chat */}
//             {currentUser && (
//               <div className="bg-white rounded-3xl shadow-3xl border-2 border-blue-200/50 p-6 sm:p-8 lg:p-10 flex flex-col">
//                 <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex items-center space-x-4 mb-8 lg:mb-10">
//                   <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-2xl">
//                     <HiChatAlt2 className="text-blue-600 text-2xl sm:text-3xl" />
//                   </div>
//                   <span>Live Global Chat</span>
//                 </h2>

//                 <div className="flex-1 overflow-y-auto space-y-4 mb-6 sm:mb-8 max-h-[400px] sm:max-h-[500px] custom-scrollbar p-2">
//                   {messages.length === 0 ? (
//                     <div className="text-center py-12">
//                       <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                         <FaComments className="text-blue-500 text-2xl" />
//                       </div>
//                       <p className="text-gray-500 text-lg">No messages yet. Start the conversation!</p>
//                     </div>
//                   ) : (
//                     messages.map(message => (
//                       <div 
//                         key={message.id} 
//                         className={`p-4 rounded-2xl border-2 shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer ${
//                           message.userId === currentUser?.id 
//                             ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200' 
//                             : message.isSystemMessage
//                             ? 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200'
//                             : 'bg-gradient-to-br from-gray-50 to-blue-50 border-gray-200'
//                         }`}
//                       >
//                         <div className="flex items-start space-x-3">
//                           <img 
//                             src={message.userAvatar || `https://i.pravatar.cc/150?img=${(parseInt(message.userId) % 70) + 1 || 1}`}
//                             alt={message.userName}
//                             className="w-10 h-10 rounded-2xl border-2 border-gray-300 shadow-lg"
//                           />
//                           <div className="flex-1 min-w-0">
//                             <div className="flex items-center justify-between mb-2">
//                               <span className={`font-bold text-sm sm:text-base ${
//                                 message.userId === currentUser?.id 
//                                   ? 'text-blue-600' 
//                                   : message.isSystemMessage
//                                   ? 'text-purple-600'
//                                   : 'text-gray-700'
//                               }`}>
//                                 {message.userName}
//                                 {message.userId === currentUser?.id && (
//                                   <span className="text-blue-400 text-xs ml-2">(You)</span>
//                                 )}
//                               </span>
//                               <span className="text-gray-500 text-xs font-bold bg-white px-2 py-1 rounded-xl shadow-sm">
//                                 {formatTime(message.timestamp)}
//                               </span>
//                             </div>
//                             <p className={`text-sm sm:text-base ${
//                               message.isSystemMessage ? 'text-purple-600 italic' : 'text-gray-600'
//                             }`}>
//                               {message.text}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                   )}
//                   <div ref={messagesEndRef} />
//                 </div>

//                 <form onSubmit={sendMessage} className="flex space-x-3">
//                   <input
//                     type="text"
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     placeholder="Type your message to everyone..."
//                     disabled={isLoading}
//                     className="flex-1 border-2 border-gray-300 rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-2xl disabled:opacity-50"
//                   />
//                   <button 
//                     type="submit"
//                     disabled={isLoading || !newMessage.trim()}
//                     className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3 sm:p-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 disabled:opacity-50"
//                   >
//                     <FaPaperPlane className="text-lg sm:text-xl" />
//                   </button>
//                 </form>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;





// import React from 'react';
// import Login from './components/Login/Login'; // Capital L

// function App() {
//   return (
//     <div>
//       <Login />
//     </div>
//   );
// }

// export default App;






// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './components/Login/Login';
// import SignUp from './components/SignUp/SignUp';
// import Chats from './components/Chats/Chats';
// import NewUsers from './components/NewUsers/NewUsers';
// import Chat from './components/Chat/Chat';
// import CallScreen from './components/CallScreen/CallScreen';
// import JoinScreen from './components/JoinScreen/JoinScreen';
// // import IncomingCallScreen from './IncomingCallScreen';
// import IncomingCallScreen from './components/IncomingCall/IncomingCallScreen';

// function App() {
//     const [showIncomingCall, setShowIncomingCall] = useState(false);
//   const ringtoneRef = useRef(null);


//  const handleAcceptCall = () => {
//     console.log('Call accepted');
//     setShowIncomingCall(false);
//     // Navigate to call screen or start call
//   };

//   const handleRejectCall = () => {
//     console.log('Call rejected');
//     setShowIncomingCall(false);
//     // Handle call rejection
//   };

//   const simulateIncomingCall = () => {
//     // Create ringtone audio
//     const ringtone = new Audio('/sounds/ringtone.mp3');
//     ringtone.loop = true;
//     ringtoneRef.current = ringtone;

//     setShowIncomingCall(true);
//   };

//   return (
//     <Router>
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//         <Routes>
//           {/* Authentication Routes */}
//           <Route path="/" element={<Login />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<SignUp />} />
          
//           {/* App Routes */}
//           <Route path="/chats" element={<Chats />} />
//           <Route path="/users" element={<NewUsers />} />
//           <Route path="/discover" element={<NewUsers />} />
//            <Route path="/Chat" element={<Chat />} />
//              <Route path="/callscreen" element={<CallScreen />} />
//               <Route path="/JoinScreen" element={<JoinScreen />} />

          
//           {/* Redirects for better UX */}
//           <Route path="/home" element={<Navigate to="/discover" replace />} />
//           <Route path="/messages" element={<Navigate to="/chats" replace />} />
//            <Route path="/Chat" element={<Navigate to="/Chat" replace />} />


          
//           {/* 404 Page - Catch all undefined routes */}
//           <Route path="*" element={
//             <div className="min-h-screen flex items-center justify-center p-4">
//               <div className="text-center max-w-md">
//                 <div className="text-6xl mb-4">😕</div>
//                 <h1 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h1>
//                 <p className="text-gray-600 mb-6">
//                   The page you're looking for doesn't exist or has been moved.
//                 </p>
//                 <div className="flex flex-col sm:flex-row gap-3 justify-center">
//                   <button
//                     onClick={() => window.history.back()}
//                     className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
//                   >
//                     Go Back
//                   </button>
//                   <button
//                     onClick={() => window.location.href = '/'}
//                     className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
//                   >
//                     Go to Login
//                   </button>
//                 </div>
//               </div>
//             </div>
//           } />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;






import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import Chats from './components/Chats/Chats';
import NewUsers from './components/NewUsers/NewUsers';
import Chat from './components/Chat/Chat';
import CallScreen from './components/CallScreen/CallScreen';
import JoinScreen from './components/JoinScreen/JoinScreen';
import IncomingCallScreen from './components/IncomingCall/IncomingCallScreen';

// Incoming Call Provider Component
const IncomingCallProvider = ({ children }) => {
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const [callData, setCallData] = useState(null);
  const ringtoneRef = useRef(null);
  const navigate = useNavigate();
  // Listen for incoming calls (you can trigger this from Firebase/Supabase notifications)
  useEffect(() => {
    // Simulate incoming call for testing - remove this in production
    const simulateIncomingCall = setTimeout(() => {
      // showIncomingCallScreen({
      //   callerName: "John Doe",
      //   callerImage: "https://i.pravatar.cc/300",
      //   isVideoCall: true,
      //   roomId: "test-room",
      //   peerEmail: "john@example.com"
      // });

    const ringtone = new Audio('/sounds/ringtone.mp3');
    ringtone.loop = true;
    ringtoneRef.current = ringtone;
    }, 5000);

    return () => {
      clearTimeout(simulateIncomingCall);
      stopRingtone();
    };
  }, []);




  //   const simulateIncomingCall = () => {
  //    // Create ringtone audio
  //   const ringtone = new Audio('/sounds/ringtone.mp3');
  //   ringtone.loop = true;
  //   ringtoneRef.current = ringtone;

  //   setShowIncomingCall(true);
  // };

  const showIncomingCallScreen = (data) => {
    setCallData(data);
    setShowIncomingCall(true);
    playRingtone();
  };

  const playRingtone = () => {
    stopRingtone();
    
    // Create ringtone audio
    const ringtone = new Audio('/sounds/ringtone.mp3');
    ringtone.loop = true;
    
    ringtone.play().then(() => {
      console.log('Ringtone started playing');
      ringtoneRef.current = ringtone;
    }).catch((error) => {
      console.log('Ringtone playback failed:', error);
    });
  };

  const stopRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
      ringtoneRef.current = null;
    }
  };

  const handleAcceptCall = () => {
    console.log('Call accepted');
    stopRingtone();
    setShowIncomingCall(false);
    
    if (callData) {
      // Navigate to JoinScreen for incoming call
      navigate('/joinscreen', {
        state: {
          roomId: callData.roomId,
          peerEmail: callData.peerEmail,
          isVideoCall: callData.isVideoCall,
          avatar: callData.callerImage,
          // Add other necessary data for the call
        }
      });
    }
  };

  const handleRejectCall = () => {
    console.log('Call rejected');
    stopRingtone();
    setShowIncomingCall(false);
    setCallData(null);
    
    // You can send rejection notification to caller here
    if (callData) {
      console.log('Rejecting call from:', callData.peerEmail);
      // Add your rejection logic here (update database, send notification, etc.)
    }
  };

  // Expose function to child components (optional)
  useEffect(() => {
    window.showIncomingCall = showIncomingCallScreen;
  }, []);

  return (
    <>
      {children}
      
      {showIncomingCall && callData && (
        <IncomingCallScreen
          callerName={callData.callerName}
          callerImage={callData.callerImage}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
          isVideoCall={callData.isVideoCall}
          ringtone={ringtoneRef.current}
          stopRingtone={stopRingtone}
        />
      )}
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Routes>
          {/* Authentication Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* App Routes with Incoming Call Provider */}
          <Route path="/*" element={
            <IncomingCallProvider>
              <AppRoutes />
            </IncomingCallProvider>
          } />
        </Routes>
      </div>
    </Router>
  );
}

// Separate component for app routes that need incoming call functionality
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/chats" element={<Chats />} />
      <Route path="/users" element={<NewUsers />} />
      <Route path="/discover" element={<NewUsers />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/callscreen" element={<CallScreen />} />
      <Route path="/joinscreen" element={<JoinScreen />} />
      
      {/* Redirects for better UX */}
      <Route path="/home" element={<Navigate to="/discover" replace />} />
      <Route path="/messages" element={<Navigate to="/chats" replace />} />
      
      {/* 404 Page - Catch all undefined routes */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

// 404 Page Component
const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;