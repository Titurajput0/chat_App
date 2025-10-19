// import { PermissionsAndroid } from 'react-native';

// export const requestCamAudioPermissions = async () => {
//   try {
//     const permissions = await PermissionsAndroid.requestMultiple([
//       PermissionsAndroid.PERMISSIONS.CAMERA,
//       PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//     ]);

//     const grantedCamera = permissions[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED;
//     const grantedAudio = permissions[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED;

//     return grantedCamera && grantedAudio;
//   } catch (err) {
//     console.warn(err);
//     return false;
//   }
// };


// export const requestAudioOnlyPermissions = async () => {
//   try {
//     const granted = await PermissionsAndroid.requestMultiple([
//       PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//     ]);
    
//     return (
//       granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
//       PermissionsAndroid.RESULTS.GRANTED
//     );
//   } catch (err) {
//     console.warn(err);
//     return false;
//   }
// };


















// import { PermissionsAndroid, Platform } from 'react-native';
// import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// export const requestCamAudioPermissions = async () => {
//   try {
//     if (Platform.OS === 'android') {
//       // Android permissions
//       const permissions = await PermissionsAndroid.requestMultiple([
//         PermissionsAndroid.PERMISSIONS.CAMERA,
//         PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//         PermissionsAndroid.PERMISSIONS.MODIFY_AUDIO_SETTINGS, // For speaker control
//       ]);

//       const grantedCamera = permissions[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED;
//       const grantedAudio = permissions[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED;
//       const grantedAudioSettings = permissions[PermissionsAndroid.PERMISSIONS.MODIFY_AUDIO_SETTINGS] === PermissionsAndroid.RESULTS.GRANTED;

//       console.log('Android Permissions:', {
//         camera: grantedCamera,
//         audio: grantedAudio,
//         audioSettings: grantedAudioSettings
//       });

//       return grantedCamera && grantedAudio;
      
//     } else {
//       // iOS permissions
//       const cameraPermission = await request(PERMISSIONS.IOS.CAMERA);
//       const microphonePermission = await request(PERMISSIONS.IOS.MICROPHONE);

//       const isCameraGranted = cameraPermission === RESULTS.GRANTED;
//       const isMicrophoneGranted = microphonePermission === RESULTS.GRANTED;

//       console.log('iOS Permissions:', {
//         camera: isCameraGranted,
//         microphone: isMicrophoneGranted
//       });

//       return isCameraGranted && isMicrophoneGranted;
//     }
//   } catch (err) {
//     console.warn('Permission error:', err);
//     return false;
//   }
// };

// export const requestAudioOnlyPermissions = async () => {
//   try {
//     if (Platform.OS === 'android') {
//       // Android audio only permissions
//       const granted = await PermissionsAndroid.requestMultiple([
//         PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//         PermissionsAndroid.PERMISSIONS.MODIFY_AUDIO_SETTINGS,
//       ]);
      
//       return (
//         granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
//         PermissionsAndroid.RESULTS.GRANTED
//       );
//     } else {
//       // iOS audio only permissions
//       const microphonePermission = await request(PERMISSIONS.IOS.MICROPHONE);
//       return microphonePermission === RESULTS.GRANTED;
//     }
//   } catch (err) {
//     console.warn(err);
//     return false;
//   }
// };

// // Additional utility functions for better permission handling
// export const checkCamAudioPermissions = async () => {
//   try {
//     if (Platform.OS === 'android') {
//       const cameraGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
//       const audioGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
      
//       return cameraGranted && audioGranted;
//     } else {
//       // For iOS, we need to request to know current status
//       // This is a simplified check - actual status might need different handling
//       return true; // iOS will show system prompt when requested
//     }
//   } catch (error) {
//     console.warn('Permission check error:', error);
//     return false;
//   }
// };

// export const openAppSettings = () => {
//   if (Platform.OS === 'ios') {
//     Linking.openURL('app-settings:');
//   } else {
//     Linking.openSettings();
//   }
// };















// utils/permissions.js
import { PermissionsAndroid, Platform, Linking, Alert } from 'react-native';

export const requestCamAudioPermissions = async () => {
  try {
    if (Platform.OS === 'android') {
      // Android permissions
      const permissions = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.MODIFY_AUDIO_SETTINGS,
      ]);

      const grantedCamera = permissions[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED;
      const grantedAudio = permissions[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED;

      console.log('Android Permissions:', {
        camera: grantedCamera,
        audio: grantedAudio
      });

      if (!grantedCamera || !grantedAudio) {
        console.log('Android permissions denied');
        return false;
      }

      return true;
      
    } else {
      // iOS - Use mediaDevices API to trigger native iOS permissions
      try {
        const { mediaDevices } = require('react-native-webrtc');
        
        // This will automatically show iOS permission dialogs
        const stream = await mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
          },
          video: true
        });
        
        if (stream) {
          // Immediately stop the stream as we just needed permissions
          stream.getTracks().forEach(track => track.stop());
          return true;
        }
        return false;
      } catch (error) {
        console.log('iOS permission denied:', error);
        return false;
      }
    }
  } catch (err) {
    console.warn('Permission request error:', err);
    return false;
  }
};

export const requestAudioOnlyPermissions = async () => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.MODIFY_AUDIO_SETTINGS,
      ]);
      
      return (
        granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
        PermissionsAndroid.RESULTS.GRANTED
      );
    } else {
      // iOS audio only
      try {
        const { mediaDevices } = require('react-native-webrtc');
        const stream = await mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
          },
          video: false
        });
        
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          return true;
        }
        return false;
      } catch (error) {
        console.log('iOS audio permission denied:', error);
        return false;
      }
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};