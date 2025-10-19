// import React, { useState, useCallback, useEffect, useRef } from 'react';
// import './JoinScreen.css';
// import { useNavigate, useLocation } from 'react-router-dom';
// import {
//   doc,
//   setDoc,
//   getDoc,
//   updateDoc,
//   collection,
//   onSnapshot,
//   addDoc,
//   deleteDoc,
//   getDocs,
// } from "firebase/firestore";
// import { db, auth } from '../config/firebase';
// import { FaPhone, FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash, FaCamera, FaUser } from 'react-icons/fa';
// import { IoMdCameraReverse } from 'react-icons/io';
// import { supabase } from "../config/supabaseClient";

// const JoinScreen = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { 
//     setScreen, 
//     screens, 
//     roomId, 
//     peerEmail,  
//     remoteAccessToken, 
//     remoteFCMToken, 
//     avatar 
//   } = location.state || {};

//   const [localStream, setLocalStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);
//   const [cachedLocalPC, setCachedLocalPC] = useState(null);
//   const [isFrontCamera, setFrontCamera] = useState(true);
//   const [isMuted, setIsMuted] = useState(false);
//   const [callInProgress, setCallInProgress] = useState(false);
//   const [hasPermissions, setPermissions] = useState(false);
//   const [callStatus, setCallStatus] = useState('Joining...');
//   const [callDuration, setCallDuration] = useState(0);
//   const [isLocalVideoEnabled, setIsLocalVideoEnabled] = useState(true);
//   const [isVideoOn, setIsVideoOn] = useState(null);
//   const [isVideoCall, setIsVideoCall] = useState(null);
//   const [videoQuality, setVideoQuality] = useState('FULL_HD');

//   const callTimerRef = useRef(null);
//   const unsubRef = useRef([]);
//   const ringtoneRef = useRef(null);
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
  
//   const [isRingtonePlaying, setIsRingtonePlaying] = useState(false);
//   const [isCallhangup, setIsCallhangup] = useState(null);

//   const VIDEO_QUALITY = {
//     HD: {
//       width: 1280,
//       height: 720,
//       frameRate: 30,
//       bitrate: 2500000
//     },
//     FULL_HD: {
//       width: 1920,
//       height: 1080,
//       frameRate: 30,
//       bitrate: 4000000
//     },
//     UHD_4K: {
//       width: 3840,
//       height: 2160,
//       frameRate: 30,
//       bitrate: 8000000
//     }
//   };

//   const configuration = {
//     iceServers: [
//       { urls: "stun:stun.relay.metered.ca:80" },
//       {
//         urls: "turn:159.223.175.154:3478",
//         username: "user",
//         credential: "password",
//       },
//       {
//         urls: "turn:95.217.13.89:3478",
//         username: "user",
//         credential: "password",
//       },
//     ],
//     iceCandidatePoolSize: 10,
//   };

//   const playRingtone = async () => {
//     try {
//       stopRingtone();
      
//       // Web audio implementation for ringtone
//       const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//       // Add your ringtone logic here
//       console.log('Playing ringtone');
//       setIsRingtonePlaying(true);
//     } catch (error) {
//       console.log('Error playing ringtone:', error);
//     }
//   };

//   const stopRingtone = () => {
//     // Stop any playing sounds
//     console.log('Stopping ringtone');
//     setIsRingtonePlaying(false);
//   };

//   useEffect(() => {
//     const handleBeforeUnload = (e) => {
//       if (callInProgress) {
//         e.preventDefault();
//         e.returnValue = 'Are you sure you want to leave the call?';
//       }
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);
    
//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
//   }, [callInProgress]);

//   useEffect(() => {
//     const checkNavigationSource = () => {
//       if (location.state?.fromNotification) {
//         console.log("📱 Joined from notification");
//       }
//     };

//     checkNavigationSource();
//   }, [location.state]);

//   const cleanupConnections = async () => {
//     try {
//       console.log("Cleaning up connections...");

//       stopRingtone();

//       if (ringtoneRef.current) {
//         ringtoneRef.current = null;
//       }
      
//       if (callTimerRef.current) {
//         clearInterval(callTimerRef.current);
//       }
      
//       if (unsubRef.current && unsubRef.current.length > 0) {
//         unsubRef.current.forEach(unsubscribe => {
//           if (typeof unsubscribe === 'function') {
//             unsubscribe();
//           }
//         });
//         unsubRef.current = [];
//       }
      
//       if (localStream) {
//         localStream.getTracks().forEach(track => {
//           track.stop();
//           track.enabled = false;
//         });
//       }
      
//       if (cachedLocalPC) {
//         cachedLocalPC.close();
//         setCachedLocalPC(null);
//       }
      
//       setRemoteStream(null);
//       setCallInProgress(false);
//       setCallDuration(0);
//       setCallStatus('Call Ended');
      
//       console.log('Connections cleaned up successfully');
//     } catch (error) {
//       console.error('Error during cleanup:', error);
//     }
//   };

//   useEffect(() => {
//     console.log("▶️ Subscribing to Supabase Realtime...");

//     const videoOnSub = supabase
//       .channel("peer-video-status")
//       .on(
//         "postgres_changes",
//         { event: "UPDATE", schema: "public", table: "users", filter: `email=eq.${peerEmail}` },
//         (payload) => {
//           const status = payload.new?.isvideoon;
//           console.log("📹 isVideoOn updated:", status);
//           setIsVideoOn(!!status);
//         }
//       )
//       .subscribe();

//     const videoCallSub = supabase
//       .channel("current-user-videoCall")
//       .on(
//         "postgres_changes",
//         { event: "UPDATE", schema: "public", table: "users", filter: `email=eq.${auth.currentUser.email}` },
//         (payload) => {
//           const status = payload.new?.isvideocall;
//           console.log("📞 isVideoCall updated:", status);
//           setIsVideoCall(!!status);
//         }
//       )
//       .subscribe();

//     const hangupSub = supabase
//       .channel("peer-hangup")
//       .on(
//         "postgres_changes",
//         { event: "UPDATE", schema: "public", table: "users", filter: `email=eq.${peerEmail}` },
//         (payload) => {
//           const status = payload.new?.iscallerhangup;
//           console.log("📴 isCallerHangup updated:", status);
//           if (status === true) {
//             onBackPress();
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       console.log("🛑 Unsubscribing Supabase Realtime...");
//       supabase.removeChannel(videoOnSub);
//       supabase.removeChannel(videoCallSub);
//       supabase.removeChannel(hangupSub);
//     };
//   }, [peerEmail]);

//   useEffect(() => {
//     if (remoteStream) {
//       // For web, audio routing is handled by the browser
//       console.log('Remote stream connected');
//     }
//   }, [remoteStream]);

//   useEffect(() => {
//     if (callInProgress && remoteStream) {
//       callTimerRef.current = setInterval(() => {
//         setCallDuration(prev => prev + 1);
//       }, 1000);
//     } else {
//       clearInterval(callTimerRef.current);
//     }
    
//     return () => clearInterval(callTimerRef.current);
//   }, [callInProgress, remoteStream]);

//   const formatCallTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   useEffect(() => {
//     handlePermissions();
    
//     return () => {
//       cleanupConnections();
//     };
//   }, []);

//   useEffect(() => {
//     if (localStream && !callInProgress) {
//       joinCall();
//     }
//   }, [localStream]);

//   const handlePermissions = async () => {
//     try {
//       const hasPermission = await requestCamAudioPermissions();
//       setPermissions(hasPermission);
//       if (hasPermission) {
//         startLocalStream();
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const requestCamAudioPermissions = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ 
//         video: true, 
//         audio: true 
//       });
      
//       stream.getTracks().forEach(track => track.stop());
      
//       return true;
//     } catch (error) {
//       console.log('Permission error:', error);
//       return false;
//     }
//   };

//   const startLocalStream = async () => {
//     try {
//       const isFront = true;
      
//       const quality = VIDEO_QUALITY[videoQuality];
      
//       const constraints = {
//         audio: {
//           channelCount: 1,
//           echoCancellation: true,
//           noiseSuppression: true,
//           sampleRate: 48000,
//           sampleSize: 16,
//           autoGainControl: true,
//         },
//         video: {
//           width: { ideal: quality.width },
//           height: { ideal: quality.height },
//           frameRate: { ideal: quality.frameRate },
//           facingMode: isFront ? 'user' : 'environment',
//         },
//       };

//       const newStream = await navigator.mediaDevices.getUserMedia(constraints);
//       setLocalStream(newStream);
      
//       if (localVideoRef.current) {
//         localVideoRef.current.srcObject = newStream;
//       }
//     } catch (error) {
//       console.log("Error starting local stream:", error);
//       if (videoQuality === 'UHD_4K' || videoQuality === 'FULL_HD') {
//         console.log("Trying HD quality as fallback...");
//         setVideoQuality('HD');
//         setTimeout(() => startLocalStream(), 500);
//       }
//     }
//   };

//   const changeVideoQuality = async (newQuality) => {
//     if (videoQuality === newQuality) return;
    
//     setVideoQuality(newQuality);
    
//     if (localStream) {
//       localStream.getTracks().forEach(track => track.stop());
//       setLocalStream(null);
//     }
    
//     await startLocalStream();
//   };

//   const joinCall = async () => {
//     if (!localStream) {
//       console.log("Local stream not ready yet!");
//       return;
//     }
//     setCallInProgress(true);
//     setCallStatus('Connecting...');
    
//     try {
//       const localPC = new RTCPeerConnection(configuration);
//       localStream.getTracks().forEach((track) =>
//         localPC.addTrack(track, localStream)
//       );

//       const roomRef = doc(db, "room", roomId);
//       const roomSnapshot = await getDoc(roomRef);
//       if (!roomSnapshot.exists()) {
//         console.log("No room found with id:", roomId);
//         setCallStatus('Room Not Found');
//         stopRingtone();
//         return;
//       }
//       const offer = roomSnapshot.data().offer;

//       const calleeCandidatesCollection = collection(roomRef, "calleeCandidates");

//       localPC.onicecandidate = (event) => {
//         if (event.candidate) {
//           addDoc(calleeCandidatesCollection, {
//             candidate: event.candidate.candidate,
//             sdpMid: event.candidate.sdpMid,
//             sdpMLineIndex: event.candidate.sdpMLineIndex,
//           });
//         }
//       };

//       localPC.ontrack = (event) => {
//         if (event.streams && event.streams[0]) {
//           event.streams[0].getAudioTracks().forEach(track => {
//             track.enabled = true;
//           });

//           setRemoteStream(event.streams[0]);
//           setCallStatus('Connected');

//           if (remoteVideoRef.current) {
//             remoteVideoRef.current.srcObject = event.streams[0];
//           }

//           stopRingtone();
//         }
//       };

//       localPC.onconnectionstatechange = () => {
//         console.log('PC state:', localPC.connectionState);
//         if (['failed', 'disconnected', 'closed'].includes(localPC.connectionState)) {
//           setCallStatus('Disconnected');
//           setIsCallhangup(true);
//           onBackPress();
//           stopRingtone();
//         }
//       };

//       await localPC.setRemoteDescription(
//         new RTCSessionDescription({
//           type: offer.type,
//           sdp: offer.sdp,
//         })
//       );

//       const answer = await localPC.createAnswer();
      
//       if (answer.sdp) {
//         const bandwidth = VIDEO_QUALITY[videoQuality].bitrate;
//         answer.sdp = answer.sdp.replace(
//           /a=mid:video\r\n/g,
//           `a=mid:video\r\nb=AS:${bandwidth}\r\n`
//         );
//       }
      
//       await localPC.setLocalDescription(answer);

//       await updateDoc(roomRef, {
//         answer: { type: answer.type, sdp: answer.sdp },
//       });

//       const callerCandidatesCollection = collection(roomRef, "callerCandidates");
//       const unsubCaller = onSnapshot(callerCandidatesCollection, (snapshot) => {
//         snapshot.docChanges().forEach(async (change) => {
//           if (change.type === "added") {
//             const data = change.doc.data();
//             await localPC.addIceCandidate(
//               new RTCIceCandidate({
//                 candidate: data.candidate,
//                 sdpMid: data.sdpMid,
//                 sdpMLineIndex: data.sdpMLineIndex,
//               })
//             );
//           }
//         });
//       });

//       unsubRef.current.push(unsubCaller);
//       setCachedLocalPC(localPC);

//       try {
//         const { error: peerErr } = await supabase
//           .from("users")
//           .update({ isoncallstatus: true })
//           .eq("email", peerEmail);

//         if (peerErr) throw peerErr;

//         const { error: currentErr } = await supabase
//           .from("users")
//           .update({
//             isvideoon: true,
//             isoncallstatus: true,
//           })
//           .eq("email", auth?.currentUser?.email);

//         if (currentErr) throw currentErr;

//         console.log("✅ Call status updated successfully");
//       } catch (e) {
//         console.log("❌ user flag update err:", e);
//       }

//     } catch (err) {
//       console.log("joinCall error:", err);
//       setCallStatus('Connection Failed');
//       stopRingtone();
//       cleanupConnections();
//     }
//   };

//   const sendFcmNotification = async (targetToken, title, body, authToken, extraData = {}) => {
//     const url = "https://fcm.googleapis.com/v1/projects/hiddo-3887f/messages:send";

//     const payload = {
//       message: {
//         token: targetToken,
//         data: {
//           title,
//           body,
//           ...extraData,
//         },
//       },
//     };

//     try {
//       const response = await fetch(url, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": authToken,
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();
//       console.log("Result:", data);
//     } catch (error) {
//       console.error("FCM Error:", error);
//     }
//   };

//   const onBackPress = async () => {
//     console.log("Ending call for:", peerEmail);

//     try {
//       const { error: selfErr } = await supabase
//         .from("users")
//         .update({
//           iscallingfrom: "",
//           isoncallstatus: false,
//         })
//         .eq("email", auth.currentUser?.email);

//       if (selfErr) throw selfErr;

//       const { error: peerErr } = await supabase
//         .from("users")
//         .update({
//           isoncallstatus: false,
//         })
//         .eq("email", peerEmail);

//       if (peerErr) throw peerErr;

//       await deleteRoomByEmail(peerEmail);

//       await cleanupConnections();

//       console.log("print the boths the token data----->>", remoteFCMToken, remoteAccessToken);

//       sendFcmNotification(
//         remoteFCMToken,
//         "Start Call",
//         auth?.currentUser?.email,
//         remoteAccessToken,
//         { Peeremail: auth?.currentUser?.email, type: "Reject_Call" }
//       );

//       if (navigate.length > 1) {
//         navigate(-1);

//         const { error: hangupErr } = await supabase
//           .from("users")
//           .update({
//             iscallerhangup: false,
//           })
//           .eq("email", peerEmail);

//         if (hangupErr) throw hangupErr;
//       } else {
//         // Handle screen navigation if needed
//         console.log('Would navigate to room screen');
//       }

//       console.log("✅ Call ended successfully");
//     } catch (e) {
//       console.log("❌ Error ending call:", e);
//     }
//   };

//   const deleteRoomByEmail = async (email) => {
//     try {
//       if (!email) return;
      
//       const roomRef = doc(db, "room", email);
//       const roomSnapshot = await getDoc(roomRef);
      
//       if (roomSnapshot.exists()) {
//         const subcollections = ["calleeCandidates", "callerCandidates"];
        
//         for (const sub of subcollections) {
//           const subColRef = collection(db, "room", email, sub);
//           const subDocs = await getDocs(subColRef);
          
//           const deletePromises = subDocs.docs.map(subDoc => deleteDoc(doc(subColRef, subDoc.id)));
//           await Promise.all(deletePromises);
//         }
        
//         await deleteDoc(roomRef);
//         console.log(`${email} room and its subcollections deleted successfully`);
//       }
//     } catch (error) {
//       console.error("Error deleting room:", error);
//     }
//   };

//   const switchCamera = async () => {
//     if (localStream) {
//       try {
//         const newFacingMode = isFrontCamera ? 'environment' : 'user';
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: { facingMode: newFacingMode },
//           audio: true
//         });
        
//         if (localVideoRef.current) {
//           localVideoRef.current.srcObject = stream;
//         }
        
//         localStream.getTracks().forEach(track => track.stop());
//         setLocalStream(stream);
//         setFrontCamera(!isFrontCamera);
//       } catch (error) {
//         console.log('Error switching camera:', error);
//       }
//     }
//   };

//   const toggleMute = () => {
//     if (localStream) {
//       localStream.getAudioTracks().forEach((track) => {
//         track.enabled = !track.enabled;
//         setIsMuted(!track.enabled);
//       });
//     }
//   };

//   const toggleVideo = async () => {
//     try {
//       if (localStream) {
//         localStream.getVideoTracks().forEach(async (track) => {
//           track.enabled = !track.enabled;
//           setIsLocalVideoEnabled(track.enabled);

//           const { error } = await supabase
//             .from("users")
//             .update({
//               isvideoon: track.enabled,
//             })
//             .eq("email", auth?.currentUser?.email);

//           if (error) {
//             console.error("Error updating video status:", error);
//           } else {
//             console.log("Video status updated:", track.enabled);
//           }
//         });
//       }
//     } catch (err) {
//       console.error("toggleVideo error:", err);
//     }
//   };

//   const renderVideoStreams = () => {
//     if (isVideoCall) {
//       return (
//         <div className="video-container">
//           {remoteStream && isVideoOn ? (
//             <video 
//               ref={remoteVideoRef}
//               className="remote-video" 
//               autoPlay
//               playsInline
//             />
//           ) : (
//             <div className="remote-video-placeholder">
//               <FaVideoSlash size={80} color="#64748B" />
//               <div className="placeholder-text">Camera Off</div>
//             </div>
//           )}
          
//           {localStream && isLocalVideoEnabled && (
//             <div className="local-video-container">
//               <video 
//                 ref={localVideoRef}
//                 className="local-video" 
//                 autoPlay
//                 playsInline
//                 muted
//               />
//             </div>
//           )}
//         </div>
//       );
//     } else {
//       return (
//         <div className="audio-call-container">
//           <div className="avatar-container">
//             <div className="avatar">
//               <img
//                 src={avatar}
//                 className="avatar-image"
//                 alt="User avatar"
//               />
//             </div>
//             <div className="peer-name-audio">{peerEmail || 'Unknown User'}</div>
//             <div className="call-status-audio">{callStatus}</div>
//             {callInProgress && remoteStream && (
//               <div className="call-timer-audio">{formatCallTime(callDuration)}</div>
//             )}
//           </div>
//         </div>
//       );
//     }
//   };

//   return (
//     <div className="container">
//       {/* Header */}
//       <div className="header">
//         <div className="peer-name">{peerEmail || 'Unknown User'}</div>
//         <div className="call-status">{callStatus}</div>
//         {callInProgress && remoteStream && (
//           <div className="call-timer">{formatCallTime(callDuration)}</div>
//         )}
//       </div>

//       {/* Conditional Video/Audio UI */}
//       {renderVideoStreams()}

//       {/* Call Controls */}
//       <div className="controls-container">
//         {callInProgress && (
//           <div className="call-controls">
//             <button 
//               className={`control-button ${isMuted ? 'control-button-active' : ''}`}
//               onClick={toggleMute}
//             >
//               {isMuted ? <FaMicrophoneSlash size={24} color="#FFF" /> : <FaMicrophone size={24} color="#FFF" />}
//               <div className="control-button-text">{isMuted ? 'Unmute' : 'Mute'}</div>
//             </button>

//             {isVideoCall && (
//               <button 
//                 className={`control-button ${!isLocalVideoEnabled ? 'control-button-active' : ''}`}
//                 onClick={toggleVideo}
//               >
//                 {isLocalVideoEnabled ? <FaVideo size={24} color="#FFF" /> : <FaVideoSlash size={24} color="#FFF" />}
//                 <div className="control-button-text">{isLocalVideoEnabled ? 'Video' : 'Enable'}</div>
//               </button>
//             )}

//             <button 
//               className="end-call-button"
//               onClick={onBackPress}
//             >
//               <FaPhoneSlash size={28} color="#FFF" />
//             </button>

//             {isVideoCall && (
//               <button 
//                 className="control-button"
//                 onClick={switchCamera}
//               >
//                 <IoMdCameraReverse size={24} color="#FFF" />
//                 <div className="control-button-text">Flip</div>
//               </button>
//             )}
//           </div>
//         )}

//         {!localStream && (
//           <button className="permission-button" onClick={handlePermissions}>
//             <FaCamera size={24} color="#FFF" />
//             <div className="button-text">Grant Permissions</div>
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default JoinScreen;







import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './JoinScreen.css';

// WebRTC imports for React.js
const {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  mediaDevices
} = window;

// Icons
import { 
  IoCall,
  IoVideocam,
  IoVideocamOff,
  IoMic,
  IoMicOff,
  IoCameraReverse,
  IoPerson,
  IoClose
} from 'react-icons/io5';
import { MdCallEnd, MdHighQuality } from 'react-icons/md';

// Firebase/Supabase imports
import { auth, db } from '../../firebase/config';
import { supabase } from '../../firebase/supabaseClient';


// Video quality presets
const VIDEO_QUALITY = {
  HD: {
    width: 1280,
    height: 720,
    frameRate: 30,
    bitrate: 2500000
  },
  FULL_HD: {
    width: 1920,
    height: 1080,
    frameRate: 30,
    bitrate: 4000000
  },
  UHD_4K: {
    width: 3840,
    height: 2160,
    frameRate: 30,
    bitrate: 8000000
  }
};

// WebRTC configuration
const configuration = {
  iceServers: [
    { urls: "stun:stun.relay.metered.ca:80" },
    {
      urls: "turn:159.223.175.154:3478",
      username: "user",
      credential: "password",
    },
    {
      urls: "turn:95.217.13.89:3478",
      username: "user",
      credential: "password",
    },
  ],
  iceCandidatePoolSize: 10,
};

export default function JoinScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = location.state || {};
  
  const { 
    roomId, 
    peerEmail, 
    remoteAccessToken, 
    remoteFCMToken, 
    avatar,
    isVideoCall = true // Default to video call
  } = params;

  // State declarations
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [cachedLocalPC, setCachedLocalPC] = useState(null);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [callInProgress, setCallInProgress] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [callStatus, setCallStatus] = useState('Joining...');
  const [callDuration, setCallDuration] = useState(0);
  const [isLocalVideoEnabled, setIsLocalVideoEnabled] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(null);
  const [videoCallType, setVideoCallType] = useState(isVideoCall);
  const [videoQuality, setVideoQuality] = useState('FULL_HD');

  // Refs
  const callTimerRef = useRef(null);
  const unsubRef = useRef([]);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const ringtoneRef = useRef(null);

  // FCM Notification function
  const sendFcmNotification = async (targetToken, title, body, authToken, extraData = {}) => {
    const url = "https://fcm.googleapis.com/v1/projects/hiddo-3887f/messages:send";

    const payload = {
      message: {
        token: targetToken,
        data: {
          title,
          body,
          ...extraData,
        },
      },
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authToken,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("FCM Response:", data);
    } catch (error) {
      console.error("FCM Error:", error);
    }
  };

  // Cleanup function
  const cleanupConnections = async () => {
    try {
      console.log("Cleaning up connections...");

      stopRingtone();

      if (ringtoneRef.current) {
        ringtoneRef.current.pause();
        ringtoneRef.current = null;
      }
      
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
      
      if (unsubRef.current && unsubRef.current.length > 0) {
        unsubRef.current.forEach(unsubscribe => {
          if (typeof unsubscribe === 'function') {
            unsubscribe();
          }
        });
        unsubRef.current = [];
      }
      
      if (localStream) {
        localStream.getTracks().forEach(track => {
          track.stop();
          track.enabled = false;
        });
      }
      
      if (cachedLocalPC) {
        cachedLocalPC.close();
        setCachedLocalPC(null);
      }
      
      setRemoteStream(null);
      setCallInProgress(false);
      setCallDuration(0);
      setCallStatus('Call Ended');

      console.log('Connections cleaned up successfully');
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  };

  // Ringtone functions
  const playRingtone = async () => {
    try {
      stopRingtone();
      
      // For web, use HTML5 Audio
      const audio = new Audio('/sounds/ringtone.mp3'); // Make sure this file exists in public/sounds
      ringtoneRef.current = audio;
      
      audio.loop = true;
      audio.play().then(() => {
        console.log('Ringtone started playing');
      }).catch(error => {
        console.log('Ringtone playback failed:', error);
      });
    } catch (error) {
      console.log('Error playing ringtone:', error);
    }
  };

  const stopRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
      console.log('Ringtone stopped');
    }
  };

  // Real-time subscriptions
  useEffect(() => {
    if (!peerEmail) return;

    console.log("▶️ Subscribing to Supabase Realtime...");

    // 1️⃣ Peer user video status listener
    const videoOnSub = supabase
      .channel("peer-video-status")
      .on(
        "postgres_changes",
        { 
          event: "UPDATE", 
          schema: "public", 
          table: "users", 
          filter: `email=eq.${peerEmail}` 
        },
        (payload) => {
          const status = payload.new?.isvideoon;
          console.log("📹 Peer video status updated:", status);
          setIsVideoOn(!!status);
        }
      )
      .subscribe();

    // 2️⃣ Current user videoCall type listener
    const videoCallSub = supabase
      .channel("current-user-videoCall")
      .on(
        "postgres_changes",
        { 
          event: "UPDATE", 
          schema: "public", 
          table: "users", 
          filter: `email=eq.${auth?.currentUser?.email}` 
        },
        (payload) => {
          const status = payload.new?.isvideocall;
          console.log("📞 Video call type updated:", status);
          setVideoCallType(!!status);
        }
      )
      .subscribe();

    // 3️⃣ Peer hangup listener
    const hangupSub = supabase
      .channel("peer-hangup")
      .on(
        "postgres_changes",
        { 
          event: "UPDATE", 
          schema: "public", 
          table: "users", 
          filter: `email=eq.${peerEmail}` 
        },
        (payload) => {
          const status = payload.new?.iscallerhangup;
          console.log("📴 Peer hangup status:", status);
          if (status === true) {
            handlePeerHangup();
          }
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      console.log("🛑 Unsubscribing Supabase Realtime...");
      supabase.removeChannel(videoOnSub);
      supabase.removeChannel(videoCallSub);
      supabase.removeChannel(hangupSub);
    };
  }, [peerEmail]);

  const handlePeerHangup = () => {
    Alert.alert(
      "Call Ended",
      "Call hangup by User",
      [
        {
          text: "OK",
          onPress: async () => {
            try {
              await cleanupConnections();
              navigate(-1); // Go back

              // Reset hangup status
              const { error: hangupErr } = await supabase
                .from("users")
                .update({ iscallerhangup: false })
                .eq("email", peerEmail);

              if (hangupErr) {
                console.error("❌ Error updating hangup status:", hangupErr);
              }
            } catch (err) {
              console.error("❌ Exception in hangup update:", err);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  // Call timer
  useEffect(() => {
    if (callInProgress && remoteStream) {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    }
    
    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [callInProgress, remoteStream]);

  // Auto-join when localStream is ready
  useEffect(() => {
    if (localStream && !callInProgress) {
      joinCall();
    }
  }, [localStream]);

  // Initial setup
  useEffect(() => {
    handlePermissions();
    
    return () => {
      cleanupConnections();
    };
  }, []);

  // Format call duration
  const formatCallTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: videoCallType 
      });
      setHasPermissions(true);
      return true;
    } catch (error) {
      console.log('Permission error:', error);
      setHasPermissions(false);
      return false;
    }
  };

  const startLocalStream = async () => {
    try {
      const quality = VIDEO_QUALITY[videoQuality];
      
      const constraints = {
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 48000,
          sampleSize: 16,
          autoGainControl: true,
        },
        video: videoCallType ? {
          width: { ideal: quality.width },
          height: { ideal: quality.height },
          frameRate: { ideal: quality.frameRate },
          facingMode: isFrontCamera ? 'user' : 'environment'
        } : false
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(newStream);
      
      // Attach to video element
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = newStream;
      }

    } catch (error) {
      console.log("Error starting local stream:", error);
      // Fallback to lower quality
      if (videoQuality === 'UHD_4K' || videoQuality === 'FULL_HD') {
        console.log("Trying HD quality as fallback...");
        setVideoQuality('HD');
        setTimeout(() => startLocalStream(), 500);
      }
    }
  };

  const changeVideoQuality = async (newQuality) => {
    if (videoQuality === newQuality) return;
    
    setVideoQuality(newQuality);
    
    // Restart stream with new quality
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    await startLocalStream();
  };

  const joinCall = async () => {
    if (!localStream) {
      console.log("Local stream not ready yet!");
      return;
    }

    setCallInProgress(true);
    setCallStatus('Connecting...');
    
    try {
      const localPC = new RTCPeerConnection(configuration);
      
      // Add local tracks
      localStream.getTracks().forEach((track) => {
        localPC.addTrack(track, localStream);
      });

      // Handle remote stream
      localPC.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          const remoteStream = event.streams[0];
          setRemoteStream(remoteStream);
          
          // Attach remote stream to video element
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
          
          setCallStatus('Connected');
          stopRingtone();
        }
      };

      // ICE candidates
      localPC.onicecandidate = (event) => {
        if (!event.candidate) return;
        console.log('ICE candidate generated');
        // Handle ICE candidate sending to signaling server
      };

      localPC.onconnectionstatechange = () => {
        console.log('PC state:', localPC.connectionState);
        if (['failed', 'disconnected', 'closed'].includes(localPC.connectionState)) {
          setCallStatus('Disconnected');
          handleCallDisconnected();
        }
      };

      // For web, you'll need to implement your own signaling server
      // This is a simplified version - you'll need to adapt it to your signaling mechanism
      
      setCachedLocalPC(localPC);

      // Update user status in Supabase
      try {
        // Peer user update
        const { error: peerErr } = await supabase
          .from("users")
          .update({ isoncallstatus: true })
          .eq("email", peerEmail);

        if (peerErr) throw peerErr;

        // Current user update
        const { error: currentErr } = await supabase
          .from("users")
          .update({
            isvideoon: true,
            isoncallstatus: true,
          })
          .eq("email", auth?.currentUser?.email);

        if (currentErr) throw currentErr;

        console.log("✅ Call status updated successfully");
      } catch (error) {
        console.log("❌ User flag update error:", error);
      }

    } catch (error) {
      console.log("joinCall error:", error);
      setCallStatus('Connection Failed');
      stopRingtone();
      cleanupConnections();
    }
  };

  const handleCallDisconnected = () => {
    Alert.alert(
      "Call Disconnected",
      "The call has ended",
      [
        {
          text: "OK",
          onPress: () => onBackPress()
        }
      ]
    );
  };

  const onBackPress = async () => {
    console.log("Ending call for:", peerEmail);

    try {
      // Current user reset
      const { error: selfErr } = await supabase
        .from("users")
        .update({
          iscallingfrom: "",
          isoncallstatus: false,
        })
        .eq("email", auth.currentUser?.email);

      if (selfErr) throw selfErr;

      // Peer user reset
      const { error: peerErr } = await supabase
        .from("users")
        .update({
          isoncallstatus: false,
        })
        .eq("email", peerEmail);

      if (peerErr) throw peerErr;

      // Send rejection notification
      sendFcmNotification(
        remoteFCMToken,
        "Call Ended",
        auth?.currentUser?.email,
        remoteAccessToken,
        { 
          Peeremail: auth?.currentUser?.email, 
          type: "Reject_Call" 
        }
      );

      // Cleanup connections
      await cleanupConnections();

      // Navigate back
      navigate(-1);

      console.log("✅ Call ended successfully");
    } catch (error) {
      console.log("❌ Error ending call:", error);
    }
  };

  // UI Actions
  const switchCamera = async () => {
    if (!videoCallType || !localStream) return;

    try {
      const currentVideoTrack = localStream.getVideoTracks()[0];
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: isFrontCamera ? 'environment' : 'user'
        }
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      const newVideoTrack = newStream.getVideoTracks()[0];

      // Replace the video track
      const sender = cachedLocalPC?.getSenders().find(s => 
        s.track && s.track.kind === 'video'
      );
      
      if (sender) {
        await sender.replaceTrack(newVideoTrack);
      }

      // Update local stream
      currentVideoTrack.stop();
      localStream.removeTrack(currentVideoTrack);
      localStream.addTrack(newVideoTrack);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }

      setIsFrontCamera(!isFrontCamera);
      newStream.getTracks().forEach(track => {
        if (track.kind === 'audio') track.stop();
      });
    } catch (error) {
      console.log('Error switching camera:', error);
    }
  };

  const toggleMute = () => {
    if (!localStream) return;
    
    localStream.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    setIsMuted(!isMuted);
  };

  const toggleVideo = async () => {
    if (!videoCallType || !localStream) return;

    try {
      localStream.getVideoTracks().forEach(async (track) => {
        track.enabled = !track.enabled;
        setIsLocalVideoEnabled(track.enabled);

        // Update Supabase
        const { error } = await supabase
          .from("users")
          .update({
            isvideoon: track.enabled,
          })
          .eq("email", auth?.currentUser?.email);

        if (error) {
          console.error("Error updating video status:", error);
        }
      });
    } catch (error) {
      console.error("toggleVideo error:", error);
    }
  };

  // Render video streams for video call
  const renderVideoStreams = () => {
    if (videoCallType) {
      return (
        <div className="video-container">
          {/* Remote Video */}
          <div className="remote-video-container">
            {remoteStream && isVideoOn ? (
              <video
                ref={remoteVideoRef}
                className="remote-video"
                autoPlay
                playsInline
              />
            ) : (
              <div className="remote-video-placeholder">
                <IoVideocamOff className="placeholder-icon" />
                <p>Camera Off</p>
              </div>
            )}
          </div>
          
          {/* Local Video */}
          {localStream && isLocalVideoEnabled && (
            <div className="local-video-container">
              <video
                ref={localVideoRef}
                className="local-video"
                autoPlay
                playsInline
                muted
                style={{ 
                  transform: isFrontCamera ? 'scaleX(1)' : 'scaleX(-1)'
                }}
              />
            </div>
          )}
        </div>
      );
    } else {
      // Audio call UI
      return (
        <div className="audio-call-container">
          <div className="avatar-container">
            <div className="avatar">
              <img 
                src={avatar} 
                alt="Caller Avatar" 
                className="avatar-image"
              />
            </div>
            <p className="peer-name-audio">{peerEmail || 'Unknown User'}</p>
            <p className="call-status-audio">{callStatus}</p>
            {callInProgress && remoteStream && (
              <p className="call-timer-audio">{formatCallTime(callDuration)}</p>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="join-screen">
      {/* Header */}
      <div className="call-header">
        <div className="caller-info">
          <h2 className="peer-name">{peerEmail || 'Unknown User'}</h2>
          <p className="call-status">{callStatus}</p>
          {callInProgress && remoteStream && (
            <p className="call-timer">{formatCallTime(callDuration)}</p>
          )}
        </div>
      </div>

      {/* Video/Audio Streams */}
      <div className="media-container">
        {renderVideoStreams()}
      </div>

      {/* Controls */}
      <div className="controls-container">
        {callInProgress && (
          <div className="call-controls">
            {/* Mute/Unmute */}
            <button 
              className={`control-btn ${isMuted ? 'active' : ''}`}
              onClick={toggleMute}
            >
              {isMuted ? <IoMicOff /> : <IoMic />}
              <span>{isMuted ? 'Unmute' : 'Mute'}</span>
            </button>

            {/* Video Toggle */}
            {videoCallType && (
              <button 
                className={`control-btn ${!isLocalVideoEnabled ? 'active' : ''}`}
                onClick={toggleVideo}
              >
                {isLocalVideoEnabled ? <IoVideocam /> : <IoVideocamOff />}
                <span>{isLocalVideoEnabled ? 'Video' : 'Enable'}</span>
              </button>
            )}

            {/* End Call */}
            <button 
              className="end-call-btn"
              onClick={onBackPress}
            >
              <MdCallEnd />
            </button>

            {/* Camera Flip */}
            {videoCallType && (
              <button 
                className="control-btn"
                onClick={switchCamera}
              >
                <IoCameraReverse />
                <span>Flip</span>
              </button>
            )}

            {/* Quality Selector */}
            {videoCallType && (
              <button 
                className="control-btn"
                onClick={() => {
                  const qualities = ['HD', 'FULL_HD', 'UHD_4K'];
                  const currentIndex = qualities.indexOf(videoQuality);
                  const nextIndex = (currentIndex + 1) % qualities.length;
                  changeVideoQuality(qualities[nextIndex]);
                }}
              >
                <MdHighQuality />
                <span>{videoQuality}</span>
              </button>
            )}
          </div>
        )}

        {!localStream && (
          <button 
            className="permission-btn"
            onClick={handlePermissions}
          >
            <IoVideocam />
            Grant Permissions
          </button>
        )}
      </div>
    </div>
  );
}