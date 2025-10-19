import { ZegoExpressEngine } from 'zego-express-engine-webrtc';

class SimpleZego {
  constructor() {
    this.appID = 1476383802; // Your App ID
    this.zego = null;
    this.localStream = null;
    this.remoteStream = null;
  }

  async initialize() {
    try {
      console.log('🟡 Initializing ZEGO...');
      this.zego = new ZegoExpressEngine(this.appID);
      
      // Check if engine created
      if (!this.zego) {
        throw new Error('ZEGO Engine creation failed');
      }
      
      console.log('✅ ZEGO Engine initialized');
      return this.zego;
    } catch (error) {
      console.error('❌ ZEGO Initialization error:', error);
      return null;
    }
  }

  async joinRoom(roomID, userID) {
    if (!this.zego) {
      throw new Error('ZEGO not initialized');
    }

    console.log(`🟡 Joining room: ${roomID} with user: ${userID}`);
    
    // Room login
    await this.zego.loginRoom(roomID, userID, { 
      userName: `User_${userID}` 
    });

    // Create local stream
    this.localStream = await this.zego.createStream({
      camera: { audio: true, video: true }
    });

    // Start publishing
    await this.zego.startPublishingStream(`stream_${userID}`, this.localStream);

    return this.localStream;
  }

  async leaveRoom(roomID) {
    if (this.zego) {
      await this.zego.logoutRoom(roomID);
      if (this.localStream) {
        this.zego.destroyStream(this.localStream);
      }
    }
  }
}

export default new SimpleZego();