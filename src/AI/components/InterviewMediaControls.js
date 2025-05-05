import axios from 'axios';
const InterviewMediaControls = {
  requestPermissions: async (localVideoRef) => {
    try {
      console.log('Requesting camera and microphone permissions...');
      if (!localVideoRef.current) {
        console.error('Video element reference not found');
        await new Promise(resolve => setTimeout(resolve, 500));
        if (!localVideoRef.current) {
          alert('Video element not found. Please refresh and try again.');
          return false;
        }
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true
      });
      localVideoRef.current.srcObject = stream;
      try {
        await localVideoRef.current.play();
        console.log('Video playback started');
      } catch (playError) {
        console.error('Error playing video:', playError);
        alert('Please click OK to start your camera');
        try {
          await localVideoRef.current.play();
        } catch (e) {
          console.error('Failed to play video after user interaction:', e);
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      alert('Camera access was denied. Please grant camera and microphone permissions.');
      return false;
    }
  },
  checkDeviceAvailability: async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasCamera = devices.some(device => device.kind === 'videoinput');
      const hasMicrophone = devices.some(device => device.kind === 'audioinput');
      if (!hasCamera || !hasMicrophone) {
        alert('Your device does not have a camera or microphone. Please ensure your device has the necessary hardware.');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error enumerating devices:', error);
      alert('An error occurred while checking for camera and microphone availability.');
      return false;
    }
  },
  toggleFullScreen: (containerRef, setIsFullScreen) => {
    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
        setIsFullScreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  },
  // Replace the startScreenRecording function with this improved version
startScreenRecording: async (
  screenMediaRecorderRef, 
  screenVideoChunksRef, 
  webSocketRef, 
  setIsScreenRecording,
  setScreenRecordingUrl,
  setRemainingTime, 
  setTimerActive,
  roomId,
  onRecordingComplete,
  audioPlayerRef,
  feedbackAudioPlayerRef
) => {
  try {
    console.log('Starting screen recording with improved audio capture...');
    
    // First capture screen with its audio
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: { 
        displaySurface: 'browser', 
        width: { ideal: 1920, max: 1920 },
        height: { ideal: 1080, max: 1080 }
      },
      audio: true // Request screen audio
    });
    
    console.log('Screen stream acquired with video tracks:', screenStream.getVideoTracks().length);
    console.log('Screen stream acquired with audio tracks:', screenStream.getAudioTracks().length);

    // Then capture microphone audio separately with enhanced settings
    const micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        // Try to ensure high quality audio capture
        sampleRate: 48000,
        sampleSize: 16,
        channelCount: 2
      }
    });
    
    console.log('Microphone stream acquired with audio tracks:', micStream.getAudioTracks().length);
    if (micStream.getAudioTracks().length > 0) {
      console.log('Microphone track label:', micStream.getAudioTracks()[0].label);
      console.log('Microphone track enabled:', micStream.getAudioTracks()[0].enabled);
      console.log('Microphone track muted:', micStream.getAudioTracks()[0].muted);
    }

    // Create a new audio context
    const audioContext = new AudioContext();
    
    // Create a single destination for all audio sources
    const audioDestination = audioContext.createMediaStreamDestination();
    
    // Create a combined stream with all tracks
    const combinedStream = new MediaStream();
    
    // Add screen video track
    screenStream.getVideoTracks().forEach(track => {
      combinedStream.addTrack(track);
      console.log('Added screen video track:', track.label);
    });
    
    // Process and add microphone audio with increased gain
    if (micStream.getAudioTracks().length > 0) {
      try {
        const micSource = audioContext.createMediaStreamSource(micStream);
        const micGain = audioContext.createGain();
        micGain.gain.value = 1.5; // Boost microphone volume
        micSource.connect(micGain);
        micGain.connect(audioDestination);
        console.log('Processed microphone with gain boost');
      } catch (error) {
        console.error('Error processing microphone audio with gain:', error);
        // Fallback: directly add mic tracks if audio processing fails
        micStream.getAudioTracks().forEach(track => {
          combinedStream.addTrack(track);
          console.log('Added original microphone track (fallback):', track.label);
        });
      }
    } else {
      console.warn('No microphone tracks found to add!');
    }
    
    // Connect audioPlayer to the audio destination if available
    if (audioPlayerRef?.current) {
      try {
        const audioPlayerSource = audioContext.createMediaElementSource(audioPlayerRef.current);
        audioPlayerSource.connect(audioDestination);
        audioPlayerSource.connect(audioContext.destination); // Connect to speakers
        console.log('Connected AI voice audio player to recording');
      } catch (error) {
        console.error('Error connecting audio player:', error);
      }
    }
    
    // Connect feedbackAudioPlayer to the audio destination if available
    if (feedbackAudioPlayerRef?.current) {
      try {
        const feedbackPlayerSource = audioContext.createMediaElementSource(feedbackAudioPlayerRef.current);
        feedbackPlayerSource.connect(audioDestination);
        feedbackPlayerSource.connect(audioContext.destination); // Connect to speakers
        console.log('Connected feedback audio player to recording');
      } catch (error) {
        console.error('Error connecting feedback audio player:', error);
      }
    }
    
    // Add screen audio if available (system audio)
    const screenAudioTracks = screenStream.getAudioTracks();
    if (screenAudioTracks.length > 0) {
      screenAudioTracks.forEach(track => {
        combinedStream.addTrack(track);
        console.log('Added screen audio track:', track.label);
      });
    } else {
      console.log('No screen audio tracks available');
    }
    
    // Add the audio destination tracks (includes all processed audio)
    audioDestination.stream.getAudioTracks().forEach(track => {
      combinedStream.addTrack(track);
      console.log('Added processed audio destination track:', track.kind);
    });
    
    // IMPORTANT: Directly add the microphone tracks to ensure they're included
    micStream.getAudioTracks().forEach(track => {
      // Check if we already have this track to avoid duplicates
      if (!combinedStream.getAudioTracks().some(t => t.id === track.id)) {
        combinedStream.addTrack(track);
        console.log('Added microphone track directly to combined stream:', track.label);
      }
    });
  
    // Log the final track configuration
    console.log(`Recording with ${combinedStream.getVideoTracks().length} video tracks and ${combinedStream.getAudioTracks().length} audio tracks`);
    combinedStream.getAudioTracks().forEach((track, i) => {
      console.log(`Audio track ${i}: ${track.label || track.id} (enabled: ${track.enabled}, muted: ${track.muted})`);
    });
    
    // Use a well-supported format for maximum compatibility
    let options;
    try {
      if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')) {
        options = {
          mimeType: 'video/webm;codecs=vp9,opus',
          audioBitsPerSecond: 128000,
          videoBitsPerSecond: 2500000
        };
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) {
        options = {
          mimeType: 'video/webm;codecs=vp8,opus',
          audioBitsPerSecond: 128000,
          videoBitsPerSecond: 2500000
        };
      } else {
        options = {};
      }
    } catch (e) {
      console.warn('Error checking codec support:', e);
      options = {};
    }
    
    // Prepare for recording
    screenVideoChunksRef.current = [];
    screenMediaRecorderRef.current = new MediaRecorder(combinedStream, options);
    
    // Handle data available event
    screenMediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        screenVideoChunksRef.current.push(event.data);
      }
    };
    
    // Handle recording stop event
    screenMediaRecorderRef.current.onstop = async () => {
      // Stop all tracks
      combinedStream.getTracks().forEach(track => {
        track.stop();
        console.log(`Stopped track: ${track.kind} - ${track.label || track.id}`);
      });
      
      // Close the audio context to release resources
      if (audioContext.state !== 'closed') {
        await audioContext.close();
      }
      
      // Create the final video blob
      const videoBlob = new Blob(screenVideoChunksRef.current, { type: 'video/webm' });
      console.log(`Created final video blob of size: ${(videoBlob.size / (1024 * 1024)).toFixed(2)}MB`);
      
      try {
        console.log('Uploading recording to Cloudinary...');
        const uploadUrl = await InterviewMediaControls.uploadToCloudinary(videoBlob, roomId);
        console.log('Upload successful, URL:', uploadUrl);
        
        await axios.post('https://auriter-backen.onrender.com/api/interview/save-recording', {
          roomId,
          videoUrl: uploadUrl
        });
        
        if (setScreenRecordingUrl) {
          setScreenRecordingUrl(uploadUrl);
        }
        
        // Call the callback after everything is complete
        if (onRecordingComplete && typeof onRecordingComplete === 'function') {
          onRecordingComplete(uploadUrl);
        }
        
        // Also call any callback set directly on the recorder (from stopScreenRecording)
        if (screenMediaRecorderRef.current.onCompleteCallback) {
          screenMediaRecorderRef.current.onCompleteCallback();
        }
      } catch (uploadError) {
        console.error('Error uploading recording:', uploadError);
        // Still try to call callbacks even if there was an error
        if (onRecordingComplete && typeof onRecordingComplete === 'function') {
          onRecordingComplete(null, uploadError);
        }
        if (screenMediaRecorderRef.current.onCompleteCallback) {
          screenMediaRecorderRef.current.onCompleteCallback();
        }
      }
    };
    
    // Start recording with a higher frequency to capture more data points
    screenMediaRecorderRef.current.start(1000);
    setIsScreenRecording(true);
    setRemainingTime(120); 
    setTimerActive(true);
    
    // Return the combined stream for any additional uses
    return combinedStream;
  } catch (error) {
    console.error('Error starting screen recording:', error);
    if (error.name === 'NotAllowedError') {
      alert('Screen recording permission was denied. Please grant permissions and try again.');
    } else if (error.name === 'NotReadableError') {
      alert('Could not access screen or microphone. Another application might be using them.');
    } else {
      alert('An error occurred while trying to start screen recording: ' + error.message);
    }
    return null;
  }
},
  uploadToCloudinary: async (videoBlob, roomId) => {
    try {
      const formData = new FormData();
      formData.append('file', videoBlob, `interview-${roomId}-recording.webm`);
      formData.append('upload_preset', 'post_blog');
      formData.append('cloud_name', 'dsbuzlxpw');
      formData.append('public_id', `interview_${roomId}_${Date.now()}`);
      
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dsbuzlxpw/video/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  },
  startRecording: async (mediaRecorderRef, audioChunksRef, webSocketRef, setIsRecording, setRemainingTime, setTimerActive) => {
    try {
      console.log('Starting audio recording...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
            const reader = new FileReader();
            reader.onload = () => {
              webSocketRef.current.send(reader.result);
            };
            reader.readAsArrayBuffer(event.data);
          }
        }
      };

      mediaRecorderRef.current.start(250);
      setIsRecording(true);
      setRemainingTime(120); 
      setTimerActive(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  },

  stopScreenRecording: (
    screenMediaRecorderRef, 
    setIsScreenRecording, 
    setTimerActive,
    onComplete
  ) => {
    if (screenMediaRecorderRef.current && screenMediaRecorderRef.current.state !== 'inactive') {
      console.log('Stopping screen recording...');
      
      // If a callback was provided, set it as a property on the recorder to be called after upload
      if (onComplete && typeof onComplete === 'function') {
        screenMediaRecorderRef.current.onCompleteCallback = onComplete;
      }
      
      screenMediaRecorderRef.current.stop();
      setIsScreenRecording(false);
      setTimerActive(false);
    }
  },
  stopRecording: (mediaRecorderRef, setIsRecording, setTimerActive) => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      console.log('Stopping audio recording...');
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setTimerActive(false);
    }
  }
};
export default InterviewMediaControls;