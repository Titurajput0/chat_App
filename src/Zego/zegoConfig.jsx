import { ZegoExpressEngine } from 'zego-express-engine-webrtc';

// ✅ Server Secret ke bina bhi kaam ho sakta hai
export const zegoConfig = {
  appID: 1476383802, // Bas App ID daldo
};

export const initializeZego = async () => {
  try {
    // Server secret without initialize
    const zego = new ZegoExpressEngine(zegoConfig.appID);
    
    // Check engine created
    if (!zego) {
      throw new Error('ZEGO Engine create nahi hua');
    }
    
    console.log('✅ ZEGO Engine initialized successfully');
    return zego;
  } catch (error) {
    console.error('❌ ZEGO Initialization error:', error);
    return null;
  }
};