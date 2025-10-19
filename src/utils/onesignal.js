

// import OneSignal from 'react-native-onesignal';

// // Initialize OneSignal
// export const initOneSignal = () => {
//   // Set App ID
//   OneSignal.setAppId('2b6ff29a-ca84-40d2-9f90-80963a9f265f');
  
//   // Prompt for push notifications
//   OneSignal.promptForPushNotificationsWithUserResponse(response => {
//     console.log('Push notification permission response:', response);
//   });
  
//   // Set notification will show in foreground handler
//   OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
//     console.log('Notification received in foreground:', notificationReceivedEvent);
//     let notification = notificationReceivedEvent.getNotification();
    
//     // For incoming call notifications, we want to show them even when app is in foreground
//     if (notification.additionalData && notification.additionalData.type === 'incoming_call') {
//       notificationReceivedEvent.complete(notification);
//     } else {
//       // Complete with null to not show the notification
//       notificationReceivedEvent.complete(null);
//     }
//   });
  
//   // Set notification opened handler
//   OneSignal.setNotificationOpenedHandler(notification => {
//     console.log('Notification opened:', notification);
    
//     // Handle incoming call notification
//     if (notification.notification.additionalData && 
//         notification.notification.additionalData.type === 'incoming_call') {
//       // Navigate to incoming call screen
//       // You'll need to use a navigation ref here
//     }
//   });
  
//   // Set notification click handler (for when app is in background/closed)
//   OneSignal.setNotificationOpenedHandler(openResult => {
//     console.log('Notification clicked:', openResult);
    
//     if (openResult.notification.additionalData && 
//         openResult.notification.additionalData.type === 'incoming_call') {
//       // Handle call notification click
//       const { roomId, callerEmail, isVideoCall } = openResult.notification.additionalData;
      
//       // Navigate to incoming call screen
//       // You'll need to use a navigation ref here
//     }
//   });
  
//   return OneSignal;
// };


//  export const sendCallNotification = async (receiverPlayerId, callerName, roomId) => {
//   try {
//     await axios.post('https://onesignal.com/api/v1/notifications', {
//       app_id: '2b6ff29a-ca84-40d2-9f90-80963a9f265f',
//       include_player_ids: [receiverPlayerId],
//       headings: { en: "Incoming Call" },
//       contents: { en: `${callerName} is calling you` },
//       data: { type: 'call', roomId, callerName }
//     }, {
//       headers: {
//         "Content-Type": "application/json; charset=utf-8",
//         "Authorization": "Basic os_v2_app_fnx7fgwkqranfh4qqcldvhzgl6qgoeu4c7men4v2bqopjdfepmtsckpuraz5dv57beyf6jrqwplxxobjqonezcslds5qlw6fmitzrni"
//       }
//     });
//   } catch (err) {
//     console.log("Send call notification error:", err);
//   }
// };




// import OneSignal from 'react-native-onesignal';

// let navigationRef = null;

// // Initialize OneSignal with navigation reference
// export const initOneSignal = (navRef) => {
//   navigationRef = navRef;
  
//   // Set App ID
//   OneSignal.setAppId('2b6ff29a-ca84-40d2-9f90-80963a9f265f');
  
//   // Prompt for push notifications
//   OneSignal.promptForPushNotificationsWithUserResponse(response => {
//     console.log('Push notification permission response:', response);
//   });
  
//   // Set notification will show in foreground handler
//   OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
//     console.log('Notification received in foreground:', notificationReceivedEvent);
//     let notification = notificationReceivedEvent.getNotification();
    
//     // For incoming call notifications
//     if (notification.additionalData && notification.additionalData.type === 'incoming_call') {
//       notificationReceivedEvent.complete(notification);
//     } else {
//       notificationReceivedEvent.complete(null);
//     }
//   });
  
//   // Set notification opened handler (single handler)
//   OneSignal.setNotificationOpenedHandler(openResult => {
//     console.log('Notification clicked:', openResult);
    
//     if (openResult.notification.additionalData && 
//         openResult.notification.additionalData.type === 'incoming_call') {
      
//       const { roomId, callerEmail, isVideoCall } = openResult.notification.additionalData;
      
//       // Navigate to incoming call screen
//       if (navigationRef && navigationRef.current) {
//         navigationRef.current.navigate('IncomingCall', {
//           roomId,
//           callerEmail,
//           isVideoCall,
//         });
//       }
//     }
//   });
  
//   return OneSignal;
// };

// // Get player ID from user email (आपको database में store करना होगा)
// // export const getPlayerIdFromEmail = async (email) => {
// //   // ये function आपको implement करना होगा
// //   // User के email से उनका OneSignal player ID fetch करें
// //   return null;
// // };

// export const getPlayerIdFromEmail = async (email) => {
//   try {
//     // Supabase से user data fetch करें
//     const { data, error } = await supabase
//       .from('users')
//       .select('onesignal_player_id')
//       .eq('email', email)
//       .single();
    
//     if (error) throw error;
//     return data?.onesignal_player_id;
    
//   } catch (error) {
//     console.error('Error getting player ID:', error);
//     return null;
//   }
// };

// export const sendCallNotification = async (receiverPlayerId, callerName, roomId) => {
//   try {
//     const response = await fetch('https://onesignal.com/api/v1/notifications', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': 'Basic os_v2_app_fnx7fgwkqranfh4qqcldvhzgl6qgoeu4c7men4v2bqopjdfepmtsckpuraz5dv57beyf6jrqwplxxobjqonezcslds5qlw6fmitzrni'
//       },
//       body: JSON.stringify({
//         app_id: '2b6ff29a-ca84-40d2-9f90-80963a9f265f',
//         include_player_ids: [receiverPlayerId],
//         headings: { en: "Incoming Call" },
//         contents: { en: `${callerName} is calling you` },
//         data: { 
//           type: 'incoming_call', 
//           roomId: roomId, 
//           callerEmail: callerName,
//           isVideoCall: true 
//         },
//         priority: 10,
//         android_channel_id: 'incoming_calls'
//       })
//     });
    
//     const result = await response.json();
//     console.log('Notification sent successfully:', result);
//     return result;
    
//   } catch (err) {
//     console.log("Send call notification error:", err);
//     throw err;
//   }
// };







// import { Platform } from 'react-native';

// let OneSignal = null;
// let navigationRef = null;
// let isOneSignalInitialized = false;

// // Initialize OneSignal with safe approach
// export const initOneSignal = async (navRef) => {
//   try {
//     navigationRef = navRef;
    
//     // Check if platform is web
//     if (Platform.OS === 'web') {
//       console.log('OneSignal not supported on web');
//       return null;
//     }

//     // Try to import OneSignal
//     try {
//       const OneSignalModule = await import('react-native-onesignal');
//       OneSignal = OneSignalModule.default;
      
//       if (!OneSignal || typeof OneSignal.setAppId !== 'function') {
//         console.error('OneSignal is not available or not properly installed');
//         return null;
//       }
//     } catch (importError) {
//       console.error('Failed to import OneSignal:', importError);
//       return null;
//     }

//     // Set App ID
//     OneSignal.setAppId('2b6ff29a-ca84-40d2-9f90-80963a9f265f');
    
//     // Prompt for push notifications
//     OneSignal.promptForPushNotificationsWithUserResponse(response => {
//       console.log('Push notification permission response:', response);
//     });
    
//     // Set notification handlers
//     setupNotificationHandlers();
    
//     isOneSignalInitialized = true;
//     console.log('OneSignal initialized successfully');
//     return OneSignal;
    
//   } catch (error) {
//     console.error('Error initializing OneSignal:', error);
//     return null;
//   }
// };

// // Setup notification handlers
// const setupNotificationHandlers = () => {
//   if (!OneSignal) return;
  
//   // Foreground handler
//   OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
//     console.log('Notification received in foreground:', notificationReceivedEvent);
//     let notification = notificationReceivedEvent.getNotification();
    
//     if (notification.additionalData && notification.additionalData.type === 'incoming_call') {
//       notificationReceivedEvent.complete(notification);
//     } else {
//       notificationReceivedEvent.complete(null);
//     }
//   });
  
//   // Notification opened handler
//   OneSignal.setNotificationOpenedHandler(openResult => {
//     console.log('Notification clicked:', openResult);
    
//     if (openResult.notification.additionalData && 
//         openResult.notification.additionalData.type === 'incoming_call') {
      
//       const { roomId, callerEmail, isVideoCall } = openResult.notification.additionalData;
      
//       // Navigate to incoming call screen
//       if (navigationRef && navigationRef.current) {
//         navigationRef.current.navigate('IncomingCall', {
//           roomId,
//           callerEmail,
//           isVideoCall,
//         });
//       }
//     }
//   });
// };




// export const getPlayerIdFromEmail = async (email) => {
//   try {
//     console.log('🔍 Getting player ID for email:', email);
    
//     const { data, error } = await supabase
//       .from('users')
//       .select('onesignal_player_id')
//       .eq('email', email)
//       .single();
    
//     if (error) {
//       console.error('❌ Supabase error:', error);
//       throw error;
//     }
    
//     console.log('✅ Player ID found:', data?.onesignal_player_id);
//     return data?.onesignal_player_id;
    
//   } catch (error) {
//     console.error('❌ Error getting player ID:', error);
//     return null;
//   }
// };





// // Send call notification
// export const sendCallNotification = async (receiverPlayerId, callerName, roomId, isVideoCall = true) => {
//   try {
//     if (!receiverPlayerId) {
//       console.warn('No receiver player ID provided');
//       return { success: false, error: 'No player ID' };
//     }

//     const response = await fetch('https://onesignal.com/api/v1/notifications', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': 'Basic os_v2_app_fnx7fgwkqranfh4qqcldvhzgl6qgoeu4c7men4v2bqopjdfepmtsckpuraz5dv57beyf6jrqwplxxobjqonezcslds5qlw6fmitzrni'
//       },
//       body: JSON.stringify({
//         app_id: '2b6ff29a-ca84-40d2-9f90-80963a9f265f',
//         include_player_ids: [receiverPlayerId],
//         headings: { en: "Incoming Call" },
//         contents: { en: `${callerName} is calling you` },
//         data: { 
//           type: 'incoming_call', 
//           roomId: roomId, 
//           callerEmail: callerName,
//           isVideoCall: isVideoCall 
//         },
//         priority: 10,
//         android_channel_id: 'incoming_calls'
//       })
//     });
    
//     const result = await response.json();
//     console.log('Notification sent successfully:', result);
//     return result;
    
//   } catch (err) {
//     console.error("Send call notification error:", err);
//     return { success: false, error: err.message };
//   }
// };

// // Check if OneSignal is available
// export const isOneSignalAvailable = () => {
//   return isOneSignalInitialized;
// };



// export const getCurrentPlayerId = async () => {
//   try {
//     if (!isOneSignalInitialized || !OneSignal) {
//       console.warn('⚠️ OneSignal not initialized');
//       return null;
//     }
    
//     const deviceState = await OneSignal.getDeviceState();
//     console.log('📱 Current Player ID:', deviceState.userId);
//     return deviceState.userId;
//   } catch (error) {
//     console.error('❌ Error getting current player ID:', error);
//     return null;
//   }
// };





// import { Platform } from 'react-native';
// import { supabase } from '../config/supabaseClient';

// // OneSignal variable will be imported dynamically
// let OneSignalInstance = null;
// let navigationRef = null;
// let isOneSignalInitialized = false;

// // Initialize OneSignal with safe approach
// export const initOneSignal = async (navRef) => {
//   try {
//     navigationRef = navRef;
    
//     // Check if platform is web
//     if (Platform.OS === 'web') {
//       console.log('OneSignal not supported on web');
//       return null;
//     }

//     // Try to import OneSignal
//     try {
//       const OneSignalModule = await import('react-native-onesignal');
//       OneSignalInstance = OneSignalModule.default;
      
//         if (!OneSignalInstance || typeof OneSignalInstance.setAppId !== 'function') {
//         console.error('OneSignal is not available or not properly installed');
//         return null;
//       }
//     } catch (importError) {
//       console.error('Failed to import OneSignal:', importError);
//       return null;
//     }

//     // Set App ID
//     OneSignalInstance.setAppId('2b6ff29a-ca84-40d2-9f90-80963a9f265f');
    
//     // Prompt for push notifications
//     OneSignalInstance.promptForPushNotificationsWithUserResponse(response => {
//       console.log('Push notification permission response:', response);
//     });
    
//     // Setup device state change listener to store player ID
//     setupDeviceStateListener();
    
//     // Set notification handlers
//     setupNotificationHandlers();
    
//     isOneSignalInitialized = true;
//     console.log('OneSignal initialized successfully');
//     return OneSignalInstance;
    
//   } catch (error) {
//     console.error('Error initializing OneSignal:', error);
//     return null;
//   }
// };

// // Setup device state listener to automatically store player ID
// const setupDeviceStateListener = async () => {
//   if (!OneSignalInstance) return;
  
//   try {
//     // Get current device state
//     const deviceState = await OneSignalInstance.getDeviceState();
    
//     if (deviceState && deviceState.userId) {
//       // Automatically store player ID for current user
//       await storePlayerIdForCurrentUser(deviceState.userId);
//     }
    
//     // Add subscription observer for changes
//     OneSignalInstance.addSubscriptionObserver(async (event) => {
//       console.log('OneSignal subscription changed:', event);
      
//       if (event.to.userId) {
//         // Store the new player ID
//         await storePlayerIdForCurrentUser(event.to.userId);
//       }
//     });
    
//   } catch (error) {
//     console.error('Error setting up device state listener:', error);
//   }
// };

// // Store player ID for current user in Supabase
// const storePlayerIdForCurrentUser = async (playerId) => {
//   try {
//     // Get current user from your auth system
//     const { data: { user } } = await supabase.auth.getUser();
    
//     if (user && user.email) {
//       // Update user record with player ID
//       const { error } = await supabase
//         .from('users')
//         .update({ 
//           onesignal_player_id: playerId,
//           updated_at: new Date().toISOString()
//         })
//         .eq('email', user.email);
      
//       if (error) {
//         console.error('Error storing player ID:', error);
//       } else {
//         console.log('✅ Player ID stored successfully for user:', user.email);
//       }
//     }
//   } catch (error) {
//     console.error('Error in storePlayerIdForCurrentUser:', error);
//   }
// };

// // Setup notification handlers
// const setupNotificationHandlers = () => {
//   if (!OneSignalInstance) return;
  
//   // Foreground handler
//   OneSignalInstance.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
//     console.log('Notification received in foreground:', notificationReceivedEvent);
//     let notification = notificationReceivedEvent.getNotification();
    
//     if (notification.additionalData && notification.additionalData.type === 'incoming_call') {
//       notificationReceivedEvent.complete(notification);
//     } else {
//       notificationReceivedEvent.complete(null);
//     }
//   });
  
//   // Notification opened handler
//   OneSignalInstance.setNotificationOpenedHandler(openResult => {
//     console.log('Notification clicked:', openResult);
    
//     if (openResult.notification.additionalData && 
//         openResult.notification.additionalData.type === 'incoming_call') {
      
//       const { roomId, callerEmail, isVideoCall } = openResult.notification.additionalData;
      
//       // Navigate to incoming call screen
//       if (navigationRef && navigationRef.current) {
//         navigationRef.current.navigate('IncomingCall', {
//           roomId,
//           callerEmail,
//           isVideoCall,
//         });
//       }
//     }
//   });
// };

// // Get player ID from user email
// export const getPlayerIdFromEmail = async (email) => {
//   try {
//     console.log('🔍 Getting player ID for email:', email);
    
//     const { data, error } = await supabase
//       .from('users')
//       .select('onesignal_player_id')
//       .eq('email', email)
//       .single();
    
//     if (error) {
//       console.error('❌ Supabase error:', error);
//       throw error;
//     }
    
//     console.log('✅ Player ID found:', data?.onesignal_player_id);
//     return data?.onesignal_player_id;
    
//   } catch (error) {
//     console.error('❌ Error getting player ID:', error);
//     return null;
//   }
// };

// // Send call notification

// export const sendCallNotification = async (receiverPlayerId, callerName, roomId, isVideoCall = true) => {
//   try {
//     if (!receiverPlayerId) {
//       console.warn('No receiver player ID provided');
//       return { success: false, error: 'No player ID' };
//     }

//     const response = await fetch('https://onesignal.com/api/v1/notifications', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': 'Basic os_v2_app_fnx7fgwkqranfh4qqcldvhzgl6qgoeu4c7men4v2bqopjdfepmtsckpuraz5dv57beyf6jrqwplxxobjqonezcslds5qlw6fmitzrni'
//       },
//       body: JSON.stringify({
//         app_id: '2b6ff29a-ca84-40d2-9f90-80963a9f265f',
//         include_player_ids: [receiverPlayerId],
//         headings: { en: "Incoming Call" },
//         contents: { en: `${callerName} is calling you` },
//         data: { 
//           type: 'incoming_call', 
//           roomId: roomId, 
//           callerEmail: callerName,
//           isVideoCall: isVideoCall 
//         },
//         priority: 10,
//         android_channel_id: 'incoming_calls'
//       })
//     });
    
//     const result = await response.json();
//     console.log('Notification sent successfully:', result);
//     return result;
    
//   } catch (err) {
//     console.error("Send call notification error:", err);
//     return { success: false, error: err.message };
//   }
// };

// // Check if OneSignal is available


// // Check if OneSignal is available
// export const isOneSignalAvailable = () => {
//   return isOneSignalInitialized && OneSignalInstance !== null;
// };

// // Get current device's OneSignal ID
// export const getCurrentPlayerId = async () => {
//   try {
//     if (!isOneSignalInitialized || !OneSignalInstance) {
//       console.warn('OneSignal not initialized');
//       return null;
//     }
    
//     const deviceState = await OneSignalInstance.getDeviceState();
//     return deviceState.userId;
//   } catch (error) {
//     console.error('Error getting current player ID:', error);
//     return null;
//   }
// };

// // Debug function to check OneSignal status
// export const debugOneSignal = async () => {
//   try {
//     console.log('=== OneSignal Debug Info ===');
    
//     if (!OneSignalInstance) {
//       console.log('OneSignal not initialized');
//       return;
//     }
    
//     const deviceState = await OneSignalInstance.getDeviceState();
//     console.log('Device State:', deviceState);
    
//     const permissions = await OneSignalInstance.getPermissions();
//     console.log('Permissions:', permissions);
    
//     console.log('=== Debug Complete ===');
    
//   } catch (error) {
//     console.error('Debug error:', error);
//   }
// };

// // Function to manually store player ID
// export const storeCurrentPlayerId = async () => {
//   try {
//     const playerId = await getCurrentPlayerId();
//     if (playerId) {
//       await storePlayerIdForCurrentUser(playerId);
//     }
//   } catch (error) {
//     console.error('Error storing current player ID:', error);
//   }
// };















// import { Platform } from 'react-native';
// import { supabase } from '../config/supabaseClient';

// // OneSignal variable will be imported dynamically
// let OneSignalInstance = null;
// let navigationRef = null;
// let isOneSignalInitialized = false;
// let initializationPromise = null; // Track initialization process

// // Initialize OneSignal with safe approach
// export const initOneSignal = async (navRef) => {
//   // If already initializing, return the same promise
//   if (initializationPromise) {
//     return initializationPromise;
//   }
  
//   initializationPromise = (async () => {
//     try {
//       navigationRef = navRef;
      
//       // Check if platform is web
//       if (Platform.OS === 'web') {
//         console.log('OneSignal not supported on web');
//         isOneSignalInitialized = true;
//         return null;
//       }

//       // Try to import OneSignal
//       try {
//         const OneSignalModule = await import('react-native-onesignal');
//         OneSignalInstance = OneSignalModule.default;
        
//         if (!OneSignalInstance || typeof OneSignalInstance.setAppId !== 'function') {
//           console.error('OneSignal is not available or not properly installed');
//           isOneSignalInitialized = true; // Mark as initialized even if failed
//           return null;
//         }
//       } catch (importError) {
//         console.error('Failed to import OneSignal:', importError);
//         isOneSignalInitialized = true; // Mark as initialized even if failed
//         return null;
//       }

//       // Set App ID
//       OneSignalInstance.setAppId('2b6ff29a-ca84-40d2-9f90-80963a9f265f');
      
//       // Prompt for push notifications
//       OneSignalInstance.promptForPushNotificationsWithUserResponse(response => {
//         console.log('Push notification permission response:', response);
//       });
      
//       // Setup device state change listener to store player ID
//       setupDeviceStateListener();
      
//       // Set notification handlers
//       setupNotificationHandlers();
      
//       isOneSignalInitialized = true;
//       console.log('OneSignal initialized successfully');
//       return OneSignalInstance;
      
//     } catch (error) {
//       console.error('Error initializing OneSignal:', error);
//       isOneSignalInitialized = true; // Mark as initialized even if failed
//       return null;
//     }
//   })();
  
//   return initializationPromise;
// };

// // Wait for OneSignal initialization
// export const ensureOneSignalInitialized = async () => {
//   if (isOneSignalInitialized) {
//     return OneSignalInstance;
//   }
  
//   if (initializationPromise) {
//     return await initializationPromise;
//   }
  
//   console.warn('OneSignal not initialized yet. Call initOneSignal first.');
//   return null;
// };

// // Get current device's OneSignal ID - UPDATED
// export const getCurrentPlayerId = async () => {
//   try {
//     const instance = await ensureOneSignalInitialized();
//     if (!instance) {
//       console.warn('OneSignal not available');
//       return null;
//     }
    
//     const deviceState = await instance.getDeviceState();
//     return deviceState?.userId || null;
//   } catch (error) {
//     console.error('Error getting current player ID:', error);
//     return null;
//   }
// };

// // Send call notification - UPDATED
// export const sendCallNotification = async (receiverPlayerId, callerName, roomId, isVideoCall = true) => {
//   try {
//     await ensureOneSignalInitialized();
    
//     if (!receiverPlayerId) {
//       console.warn('No receiver player ID provided');
//       return { success: false, error: 'No player ID' };
//     }

//     const response = await fetch('https://onesignal.com/api/v1/notifications', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': 'Basic os_v2_app_fnx7fgwkqranfh4qqcldvhzgl6qgoeu4c7men4v2bqopjdfepmtsckpuraz5dv57beyf6jrqwplxxobjqonezcslds5qlw6fmitzrni'
//       },
//       body: JSON.stringify({
//         app_id: '2b6ff29a-ca84-40d2-9f90-80963a9f265f',
//         include_player_ids: [receiverPlayerId],
//         headings: { en: "Incoming Call" },
//         contents: { en: `${callerName} is calling you` },
//         data: { 
//           type: 'incoming_call', 
//           roomId: roomId, 
//           callerEmail: callerName,
//           isVideoCall: isVideoCall 
//         },
//         priority: 10,
//         android_channel_id: 'incoming_calls'
//       })
//     });
    
//     const result = await response.json();
//     console.log('Notification sent successfully:', result);
//     return result;
    
//   } catch (err) {
//     console.error("Send call notification error:", err);
//     return { success: false, error: err.message };
//   }
// };

// // Check if OneSignal is available - UPDATED
// export const isOneSignalAvailable = () => {
//   return isOneSignalInitialized && OneSignalInstance !== null;
// };




// // Debug function to check OneSignal status
// export const debugOneSignal = async () => {
//   try {
//     console.log('=== OneSignal Debug Info ===');
    
//     if (!OneSignalInstance) {
//       console.log('OneSignal not initialized');
//       return;
//     }
    
//     const deviceState = await OneSignalInstance.getDeviceState();
//     console.log('Device State:', deviceState);
    
//     const permissions = await OneSignalInstance.getPermissions();
//     console.log('Permissions:', permissions);
    
//     console.log('=== Debug Complete ===');
    
//   } catch (error) {
//     console.error('Debug error:', error);
//   }
// };

// // Function to manually store player ID
// export const storeCurrentPlayerId = async () => {
//   try {
//     const playerId = await getCurrentPlayerId();
//     if (playerId) {
//       await storePlayerIdForCurrentUser(playerId);
//     }
//   } catch (error) {
//     console.error('Error storing current player ID:', error);
//   }
// };








// import OneSignal from 'react-native-onesignal';

// // Initialize OneSignal
// export const initOneSignal = () => {
//   // Set App ID
//   OneSignal.setAppId("2b6ff29a-ca84-40d2-9f90-80963a9f265f");
  
//   // Prompt for push notifications
//   OneSignal.promptForPushNotificationsWithUserResponse(response => {
//     console.log("Prompt response:", response);
//   });

//   // Set notification event handlers
//   OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
//     console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
//     let notification = notificationReceivedEvent.getNotification();
//     console.log("notification: ", notification);
    
//     // Complete with null means don't show a notification
//     notificationReceivedEvent.complete(notification);
//   });

//   OneSignal.setNotificationOpenedHandler(notification => {
//     console.log("OneSignal: notification opened:", notification);
    
//     // Handle notification click - navigate to appropriate screen
//     const data = notification.notification.additionalData;
//     if (data && data.type === 'incoming_call') {
//       // Navigate to incoming call screen
//       // You'll need to use a navigation ref here
//     }
//   });








//   OneSignal.setNotificationClickListener(notification => {
//     console.log("OneSignal: notification clicked:", notification);
//   });

//   OneSignal.setPermissionsObserver(event => {
//     console.log("OneSignal: permissions changed:", event);
//   });

//   OneSignal.setSubscriptionObserver(event => {
//     console.log("OneSignal: subscription changed:", event);
//   });

//   OneSignal.setEmailSubscriptionObserver(event => {
//     console.log("OneSignal: email subscription changed:", event);
//   });
// };

// // Send notification to specific user - UPDATED FOR NEW OneSignal API
// export const sendCallNotification = async (targetUserId, callerName, roomId, isVideoCall) => {
//   try {
//     // OneSignal के नए version में REST API का उपयोग करना होगा
//     const response = await fetch('https://onesignal.com/api/v1/notifications', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': 'Basic os_v2_app_fnx7fgwkqranfh4qqcldvhzgl6qgoeu4c7men4v2bqopjdfepmtsckpuraz5dv57beyf6jrqwplxxobjqonezcslds5qlw6fmitzrni' // OneSignal dashboard से Rest API Key लें
//       },
//       body: JSON.stringify({
//         app_id: "2b6ff29a-ca84-40d2-9f90-80963a9f265f",
//         include_player_ids: [targetUserId],
//         contents: { 
//           en: `Incoming call from ${callerName}`,
//         },
//         data: {
//           type: 'incoming_call',
//           roomId: roomId,
//           callerName: callerName,
//           isVideoCall: isVideoCall,
//           timestamp: new Date().toISOString()
//         },
//         buttons: [
//           {
//             id: "accept",
//             text: "Accept",
//             icon: "ic_accept"
//           },
//           {
//             id: "reject",
//             text: "Reject",
//             icon: "ic_reject"
//           }
//         ]
//       })
//     });
    
//     const data = await response.json();
//     console.log("Notification sent successfully:", data);
//     return data;
//   } catch (error) {
//     console.error("Error sending notification:", error);
//     throw error;
//   }
// };

// // Alternative: OneSignal Dashboard के माध्यम से notification भेजने के लिए
// export const sendCallNotificationAlternative = async (targetUserId, callerName, roomId, isVideoCall) => {
//   try {
//     // OneSignal के REST API का उपयोग करें
//     // आपको अपना REST API Key OneSignal dashboard से लेना होगा
//     const REST_API_KEY = "os_v2_org_ocvrvykvkjcq3iapyhgugcrd2skyumzraooetz5akzxwsrhoupycnk6fialyxbbacceqktpzckk4pkonayonm4eh6sqkvpa5yiwlqiq";
    
//     const notificationBody = {
//       app_id: "2b6ff29a-ca84-40d2-9f90-80963a9f265f",
//       include_player_ids: [targetUserId],
//       contents: { 
//         en: `Incoming call from ${callerName}`,
//       },
//       data: {
//         type: 'incoming_call',
//         roomId: roomId,
//         callerName: callerName,
//         isVideoCall: isVideoCall,
//         timestamp: new Date().toISOString()
//       },
//       buttons: [
//         {
//           id: "accept",
//           text: "Accept",
//           icon: "ic_accept"
//         },
//         {
//           id: "reject",
//           text: "Reject",
//           icon: "ic_reject"
//         }
//       ]
//     };

//     const response = await fetch('https://onesignal.com/api/v1/notifications', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Basic ${REST_API_KEY}`
//       },
//       body: JSON.stringify(notificationBody)
//     });

//     const data = await response.json();
//     console.log("Notification sent:", data);
//     return data;
//   } catch (error) {
//     console.error("Error sending notification:", error);
//     throw error;
//   }
// };

// // Get current user's OneSignal ID
// export const getOneSignalUserId = async () => {
//   const deviceState = await OneSignal.getDeviceState();
//   return deviceState.userId;
// };

// export default OneSignal;










// import { Platform } from 'react-native';

// // OneSignal को direct import करने की कोशिश करें
// // let OneSignal;
// import OneSignal from 'react-native-onesignal';

// try {
//   // Default import का उपयोग करें
//  // OneSignal = require('react-native-onesignal').default;
  
//   // अगर default नहीं है तो direct import
//   if (!OneSignal) {
//     OneSignal = require('react-native-onesignal');
//   }
// } catch (error) {
//   console.error('OneSignal module not found:', error);
// }

// // Initialize OneSignal
// export const initOneSignal = () => {
//   if (!OneSignal || typeof OneSignal.initialize !== 'function') {
//     console.error('OneSignal is not available or not properly imported');
//     return false;
//   }

//   try {
//     console.log('Initializing OneSignal...');
    
//     // Set App ID
//     OneSignal.initialize("2b6ff29a-ca84-40d2-9f90-80963a9f265f");
    
//     // Prompt for push notifications
//     OneSignal.promptForPushNotificationsWithUserResponse(response => {
//       console.log("Prompt response:", response);
//     });

//     // Set notification event handlers
//     // OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
//     //   console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
//     //   let notification = notificationReceivedEvent.getNotification();
//     //   console.log("notification: ", notification);
      
//     //   // Complete with null means don't show a notification
//     //   notificationReceivedEvent.complete(notification);
//     // });


//     // OneSignal.Notifications.addEventListener("foregroundWillDisplay", callback)



//     OneSignal.setNotificationOpenedHandler(notification => {
//       console.log("OneSignal: notification opened:", notification);
      
//       // Handle notification click - navigate to appropriate screen
//       const data = notification.notification.additionalData;
//       if (data && data.type === 'incoming_call') {
//         // Navigate to incoming call screen
//         console.log('Incoming call notification clicked');
//       }
//     });

//     // Optional: Add other handlers if needed
//     if (typeof OneSignal.setNotificationClickListener === 'function') {
//       OneSignal.setNotificationClickListener(notification => {
//         console.log("OneSignal: notification clicked:", notification);
//       });
//     }

//     if (typeof OneSignal.setPermissionsObserver === 'function') {
//       OneSignal.setPermissionsObserver(event => {
//         console.log("OneSignal: permissions changed:", event);
//       });
//     }

//     if (typeof OneSignal.setSubscriptionObserver === 'function') {
//       OneSignal.setSubscriptionObserver(event => {
//         console.log("OneSignal: subscription changed:", event);
//       });
//     }

//     if (typeof OneSignal.setEmailSubscriptionObserver === 'function') {
//       OneSignal.setEmailSubscriptionObserver(event => {
//         console.log("OneSignal: email subscription changed:", event);
//       });
//     }

//     console.log('OneSignal initialized successfully');
//     return true;
//   } catch (error) {
//     console.error('Error initializing OneSignal:', error);
//     return false;
//   }
// };

// // Send notification to specific user
// export const sendCallNotification = async (targetUserId, callerName, roomId, isVideoCall) => {
//   try {
//     const REST_API_KEY = "os_v2_app_fnx7fgwkqranfh4qqcldvhzgl6qgoeu4c7men4v2bqopjdfepmtsckpuraz5dv57beyf6jrqwplxxobjqonezcslds5qlw6fmitzrni";
    
//     const notificationBody = {
//       app_id: "2b6ff29a-ca84-40d2-9f90-80963a9f265f",
//       include_player_ids: [targetUserId],
//       contents: { 
//         en: `Incoming call from ${callerName}`,
//       },
//       data: {
//         type: 'incoming_call',
//         roomId: roomId,
//         callerName: callerName,
//         isVideoCall: isVideoCall,
//         timestamp: new Date().toISOString()
//       },
//       buttons: [
//         {
//           id: "accept",
//           text: "Accept",
//           icon: "ic_accept"
//         },
//         {
//           id: "reject",
//           text: "Reject",
//           icon: "ic_reject"
//         }
//       ]
//     };

//     const response = await fetch('https://onesignal.com/api/v1/notifications', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Basic ${REST_API_KEY}`
//       },
//       body: JSON.stringify(notificationBody)
//     });

//     const data = await response.json();
//     console.log("Notification sent:", data);
//     return data;
//   } catch (error) {
//     console.error("Error sending notification:", error);
//     throw error;
//   }
// };

// // Get current user's OneSignal ID - UPDATED
// export const getOneSignalUserId = async () => {
//   if (!OneSignal || typeof OneSignal.User.getOnesignalId !== 'function') {
//     console.error('OneSignal is not available or getDeviceState is not a function');
    
//     // Fallback: localStorage से stored ID check करें
//     try {
//       const storedId = localStorage.getItem('onesignal_user_id');
//       if (storedId) return storedId;
//     } catch (e) {
//       console.log('Local storage not available');
//     }
    
//     return null;
//   }

//   try {
//     console.log('Getting device state...');
//     const deviceState = await OneSignal.User.getOnesignalId();
    
//     if (deviceState && deviceState.userId) {
//       // localStorage में save करें fallback के लिए
//       try {
//         localStorage.setItem('onesignal_user_id', deviceState.userId);
//       } catch (e) {
//         console.log('Could not save to local storage');
//       }
      
//       return deviceState.userId;
//     }
    
//     console.log('No user ID found in device state');
//     return null;
//   } catch (error) {
//     console.error('Error getting OneSignal user ID:', error);
    
//     // Fallback: localStorage से stored ID return करें
//     try {
//       const storedId = localStorage.getItem('onesignal_user_id');
//       if (storedId) return storedId;
//     } catch (e) {
//       console.log('Local storage not available');
//     }
    
//     return null;
//   }
// };

// // Alternative method to get user ID
// export const getOneSignalUserIdAlternative = () => {
//   return new Promise((resolve) => {
//     if (!OneSignal || typeof OneSignal.User.getOnesignalId !== 'function') {
//       console.error('OneSignal not available');
//       resolve(null);
//       return;
//     }

//     // setTimeout के साथ try करें
//     setTimeout(async () => {
//       try {
//         const deviceState = await OneSignal.User.getOnesignalId();
//         resolve(deviceState?.userId || null);
//       } catch (error) {
//         console.error('Error in alternative method:', error);
//         resolve(null);
//       }
//     }, 1000);
//   });
// };

// // Check if OneSignal is initialized
// export const isOneSignalInitialized = () => {
//   return !!OneSignal && typeof OneSignal.initialize === 'function';
// };

// export default OneSignal;





import { Platform } from 'react-native';
import OneSignal from 'react-native-onesignal';

// Initialize OneSignal
export const initOneSignal = () => {
  try {
    console.log('Initializing OneSignal...');

    // Step 1: Initialize with App ID
    OneSignal.initialize("2b6ff29a-ca84-40d2-9f90-80963a9f265f");

    // Step 2: Set event listeners
    // Foreground notification handler
    OneSignal.Notifications.addEventListener('foregroundWillDisplay', (event) => {
      console.log('OneSignal: notification in foreground:', event);
      // You can prevent default notification display
      // event.preventDefault();
    });

    // Notification click handler
    OneSignal.Notifications.addEventListener('click', (event) => {
      console.log('OneSignal: notification clicked:', event);
      const data = event.notification.additionalData;
      
      if (data && data.type === 'incoming_call') {
        console.log('Incoming call notification received');
        // Handle call notification - navigate to call screen
        handleIncomingCallNotification(data);
      }
    });

    // Step 3: Request permissions (iOS)
    if (Platform.OS === 'ios') {
      OneSignal.Notifications.requestPermission(true);
    }

    // Step 4: Set In-App Message clicked handler
    OneSignal.InAppMessages.addEventListener('click', (event) => {
      console.log('OneSignal IAM clicked:', event);
    });

    // Step 5: Set In-App Message will display handler
    OneSignal.InAppMessages.addEventListener('willDisplay', (event) => {
      console.log('OneSignal IAM will display:', event);
    });

    // Step 6: Set In-App Message did display handler
    OneSignal.InAppMessages.addEventListener('didDisplay', (event) => {
      console.log('OneSignal IAM did display:', event);
    });

    // Step 7: Set In-App Message will dismiss handler
    OneSignal.InAppMessages.addEventListener('willDismiss', (event) => {
      console.log('OneSignal IAM will dismiss:', event);
    });

    // Step 8: Set In-App Message did dismiss handler
    OneSignal.InAppMessages.addEventListener('didDismiss', (event) => {
      console.log('OneSignal IAM did dismiss:', event);
    });

    console.log('OneSignal initialized successfully ✅');
    return true;
  } catch (error) {
    console.error('Error initializing OneSignal:', error);
    return false;
  }
};

// Handle incoming call notification
const handleIncomingCallNotification = (data) => {
  // यहां आप navigation handle कर सकते हैं
  // उदाहरण के लिए:
  // navigationRef.navigate('IncomingCall', { 
  //   roomId: data.roomId, 
  //   callerName: data.callerName,
  //   isVideoCall: data.isVideoCall
  // });
};

// Send notification to specific user
export const sendCallNotification = async (targetUserId, callerName, roomId, isVideoCall) => {
  try {
    const REST_API_KEY = "os_v2_app_fnx7fgwkqranfh4qqcldvhzgl6qgoeu4c7men4v2bqopjdfepmtsckpuraz5dv57beyf6jrqwplxxobjqonezcslds5qlw6fmitzrni";

    const notificationBody = {
      app_id: "2b6ff29a-ca84-40d2-9f90-80963a9f265f",
      include_player_ids: [targetUserId],
      contents: {
        en: `Incoming call from ${callerName}`,
        hi: `${callerName} का incoming call`
      },
      data: {
        type: 'incoming_call',
        roomId: roomId,
        callerName: callerName,
        isVideoCall: isVideoCall,
        timestamp: new Date().toISOString()
      },
      buttons: [
        { id: "accept", text: "Accept", icon: "ic_accept" },
        { id: "reject", text: "Reject", icon: "ic_reject" }
      ],
      // Android specific settings
      android_channel_id: "high_importance_channel",
      priority: 10, // High priority for call notifications
      // iOS specific settings
      ios_sound: "ringtone.wav",
      ios_badgeType: "Increase",
      ios_badgeCount: 1
    };

    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${REST_API_KEY}`
      },
      body: JSON.stringify(notificationBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Notification sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};

// Get current user's OneSignal ID
export const getOneSignalUserId = async () => {
  try {
    const onesignalId = await OneSignal.User.getOnesignalId();
    console.log("OneSignal User ID:", onesignalId);
    return onesignalId;
  } catch (error) {
    console.error('Error getting OneSignal user ID:', error);
    return null;
  }
};

// Get push token
export const getPushToken = async () => {
  try {
    const pushToken = await OneSignal.User.getPushSubscriptionId();
    console.log("Push Token:", pushToken);
    return pushToken;
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
};

// Set user external ID (optional - for linking with your user database)
export const setExternalUserId = async (userId) => {
  try {
    await OneSignal.User.setExternalUserId(userId);
    console.log("External user ID set:", userId);
  } catch (error) {
    console.error('Error setting external user ID:', error);
  }
};

// Remove external userId
export const removeExternalUserId = async () => {
  try {
    await OneSignal.User.removeExternalUserId();
    console.log("External user ID removed");
  } catch (error) {
    console.error('Error removing external user ID:', error);
  }
};

// Add tag to user
export const addTag = async (key, value) => {
  try {
    await OneSignal.User.addTag(key, value);
    console.log(`Tag added: ${key} = ${value}`);
  } catch (error) {
    console.error('Error adding tag:', error);
  }
};

// Remove tag from user
export const removeTag = async (key) => {
  try {
    await OneSignal.User.removeTag(key);
    console.log(`Tag removed: ${key}`);
  } catch (error) {
    console.error('Error removing tag:', error);
  }
};

// Check if OneSignal is initialized
export const isOneSignalInitialized = () => {
  return !!OneSignal;
};

export default OneSignal;