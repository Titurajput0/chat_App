import React, { useEffect, useRef, useState } from 'react';
import './IncomingCallScreen.css';

// Icons
import { 
  IoCall,
  IoVideocam,
  IoClose,
  IoArrowUp
} from 'react-icons/io5';
import { MdCallEnd } from 'react-icons/md';

const IncomingCallScreen = ({ 
  callerName, 
  callerImage, 
  onAccept, 
  onReject,
  isVideoCall = false,
  ringtone,
  stopRingtone
}) => {
  const [scale, setScale] = useState(1);
  const [pulse, setPulse] = useState(0);
  const [buttonScale1, setButtonScale1] = useState(1);
  const [buttonScale2, setButtonScale2] = useState(1);
  const [slide, setSlide] = useState(100);
  const [fade, setFade] = useState(0);
  const [ring, setRing] = useState(0);
  
  const animationRef = useRef(null);
  const vibrationInterval = useRef(null);
  const ringtonePlaying = useRef(false);

  useEffect(() => {
    // Start all animations
    startPulseAnimation();
    startEntranceAnimation();
    startRingAnimation();

    // Play ringtone if provided
    if (ringtone) {
      ringtonePlaying.current = true;
      ringtone.play().then(() => {
        console.log('Ringtone played successfully');
      }).catch((error) => {
        console.log('Ringtone playback failed:', error);
        ringtonePlaying.current = false;
      });
    }

    // Vibrate pattern (browser vibration API)
    if (navigator.vibrate) {
      vibrationInterval.current = setInterval(() => {
        navigator.vibrate(1000);
      }, 2000);
    }

    // Cleanup on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearInterval(vibrationInterval.current);
      if (navigator.vibrate) {
        navigator.vibrate(0); // Stop vibration
      }
      stopRingtoneIfPlaying();
    };
  }, []);

  const stopRingtoneIfPlaying = () => {
    if (ringtone && ringtonePlaying.current) {
      ringtone.pause();
      ringtone.currentTime = 0;
      console.log('Ringtone stopped');
      ringtonePlaying.current = false;
    }
  };

  const handleButtonPress = (callback) => {
    // Stop vibration
    clearInterval(vibrationInterval.current);
    if (navigator.vibrate) {
      navigator.vibrate(0);
    }
    
    // Stop ringtone
    stopRingtoneIfPlaying();
    
    // Call the callback function
    if (callback) {
      callback();
    }
  };

  const startPulseAnimation = () => {
    let startTime = null;
    let scaleDirection = 1;
    let pulseDirection = 1;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      // Scale animation (1 to 1.05 and back)
      if (progress > 1500) {
        scaleDirection *= -1;
        startTime = timestamp;
      }
      const scaleProgress = progress / 1500;
      setScale(1 + (scaleDirection > 0 ? scaleProgress * 0.05 : 0.05 - scaleProgress * 0.05));

      // Pulse animation (0 to 1 and back)
      if (progress > 2000) {
        pulseDirection *= -1;
        startTime = timestamp;
      }
      const pulseProgress = progress / 2000;
      setPulse(pulseDirection > 0 ? pulseProgress : 1 - pulseProgress);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const startEntranceAnimation = () => {
    const duration = 800;
    const startTime = Date.now();

    const animate = () => {
      const progress = Date.now() - startTime;
      const normalizedProgress = Math.min(progress / duration, 1);

      // Easing functions
      const slideEase = 1 - Math.pow(1 - normalizedProgress, 3); // easeOutBack approximation
      const fadeEase = normalizedProgress; // linear fade

      setSlide(100 * (1 - slideEase));
      setFade(fadeEase);

      if (normalizedProgress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  const startRingAnimation = () => {
    let ringDirection = 1;
    let ringStartTime = null;

    const animateRing = (timestamp) => {
      if (!ringStartTime) ringStartTime = timestamp;
      const progress = timestamp - ringStartTime;

      if (progress > 1000) {
        ringDirection *= -1;
        ringStartTime = timestamp;
      }

      const ringProgress = progress / 1000;
      setRing(ringDirection > 0 ? ringProgress : 1 - ringProgress);

      requestAnimationFrame(animateRing);
    };

    requestAnimationFrame(animateRing);
  };

  const handlePressIn = (setButtonScale) => {
    setButtonScale(0.9);
  };

  const handlePressOut = (setButtonScale, callback) => {
    setButtonScale(1);
    setTimeout(() => {
      if (callback) {
        handleButtonPress(callback);
      }
    }, 150);
  };

  // Calculate dynamic styles
  const backgroundStyle = {
    backgroundColor: `rgba(0, 0, 0, ${0.7 - pulse * 0.3})`
  };

  const ringScale = 1 + ring * 0.2;
  const ringOpacity = 0.7 - ring * 0.7;

  return (
    <div className="incoming-call-overlay">
      <div 
        className="incoming-call-background" 
        style={backgroundStyle}
      />
      
      <div className="incoming-call-container">
        <div 
          className="incoming-call-content"
          style={{ 
            opacity: fade,
            transform: `translateY(${slide}px)`
          }}
        >
          {/* Animated Rings */}
          <div className="ring-container">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="ring"
                style={{
                  transform: `scale(${ringScale})`,
                  opacity: ringOpacity,
                  borderWidth: index === 0 ? 2 : index === 1 ? 3 : 4,
                  animationDelay: `${index * 0.2}s`
                }}
              />
            ))}
          </div>

          <div className="call-header">
            <p className="incoming-call-text">Incoming Call</p>
          </div>
          
          <div className="profile-wrapper">
            <div 
              className="profile-container" 
              style={{ transform: `scale(${scale})` }}
            >
              <img 
                src={callerImage || 'https://i.pravatar.cc/300'} 
                alt={callerName || 'Caller'}
                className="profile-image"
              />
              <div className="profile-gradient" />
            </div>
          </div>
          
          <div className="caller-info">
            <h1 className="caller-name">{callerName || 'Unknown Caller'}</h1>
            <p className="call-type">
              {isVideoCall ? 'Video Call' : 'Voice Call'}
            </p>
          </div>
          
          <div className="button-container">
            <div 
              className="button-wrapper"
              style={{ transform: `scale(${buttonScale1})` }}
            >
              <button 
                className="call-button reject-button"
                onMouseDown={() => handlePressIn(setButtonScale1)}
                onMouseUp={() => handlePressOut(setButtonScale1, onReject)}
                onMouseLeave={() => setButtonScale1(1)}
                onTouchStart={() => handlePressIn(setButtonScale1)}
                onTouchEnd={() => handlePressOut(setButtonScale1, onReject)}
              >
                <div className="button-gradient reject-gradient">
                  <MdCallEnd className="button-icon" />
                  <span className="button-text">Decline</span>
                </div>
              </button>
            </div>
            
            <div 
              className="button-wrapper"
              style={{ transform: `scale(${buttonScale2})` }}
            >
              <button 
                className="call-button accept-button"
                onMouseDown={() => handlePressIn(setButtonScale2)}
                onMouseUp={() => handlePressOut(setButtonScale2, onAccept)}
                onMouseLeave={() => setButtonScale2(1)}
                onTouchStart={() => handlePressIn(setButtonScale2)}
                onTouchEnd={() => handlePressOut(setButtonScale2, onAccept)}
              >
                <div className="button-gradient accept-gradient">
                  {isVideoCall ? (
                    <IoVideocam className="button-icon" />
                  ) : (
                    <IoCall className="button-icon" />
                  )}
                  <span className="button-text">
                    {isVideoCall ? 'Video' : 'Audio'}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Swipe to answer hint for video calls */}
          {isVideoCall && (
            <div 
              className="swipe-hint"
              style={{ opacity: fade }}
            >
              <IoArrowUp className="swipe-icon" />
              <span className="swipe-text">Click to answer with video</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncomingCallScreen;