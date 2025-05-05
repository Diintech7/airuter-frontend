import React from 'react';

const InterviewWebSockets = {
  setupWebSockets: (webSocketRef, speechWebSocketRef, setIsSpeechWebSocketReady, setTranscript, setUserResponse) => {
    console.log('Setting up WebSocket connections...');

    webSocketRef.current = new WebSocket(`wss://auriter-backen.onrender.com/ws/transcribe?language=en`);

    webSocketRef.current.onopen = () => {
      console.log('Transcription WebSocket connected');
    };

    webSocketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'transcript' && data.data.trim()) {
        console.log('Received transcript:', data.data);
        setTranscript(data.data);
        setUserResponse(prev => prev + ' ' + data.data);
      }
    };

    webSocketRef.current.onerror = (error) => {
      console.error('Transcription WebSocket error:', error);
    };

    webSocketRef.current.onclose = () => {
      console.log('Transcription WebSocket closed');
    };

    speechWebSocketRef.current = new WebSocket('wss://auriter-backen.onrender.com/ws/speech');

    speechWebSocketRef.current.onopen = () => {
      console.log('Speech WebSocket connected');
      setIsSpeechWebSocketReady(true);
    };

    speechWebSocketRef.current.onerror = (error) => {
      console.error('Speech WebSocket error:', error);
      setIsSpeechWebSocketReady(false);
    };

    speechWebSocketRef.current.onclose = () => {
      console.log('Speech WebSocket closed');
      setIsSpeechWebSocketReady(false);
    };
  },

  speakQuestion: (question, speechWebSocketRef, audioPlayerRef, setIsSpeaking, setAiSpeaking, isRecording, startRecording) => {
    if (!speechWebSocketRef.current || speechWebSocketRef.current.readyState !== WebSocket.OPEN) {
      console.error('Speech WebSocket not ready');
      return;
    }

    console.log('Sending question to LMNT for synthesis:', question);
    setIsSpeaking(true);
    setAiSpeaking(true);

    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.src = '';
    }
    const audioChunks = [];

    speechWebSocketRef.current.send(JSON.stringify({
      text: question,
      voice: 'lily',
      language: 'en',
      speed: 1.0
    }));

    speechWebSocketRef.current.onmessage = (event) => {
      if (typeof event.data === 'string') {
        const data = JSON.parse(event.data);
        if (data.type === 'end') {
          console.log('Speech synthesis complete');

          const combinedBlob = new Blob(audioChunks, { type: 'audio/mp3' });
          const url = URL.createObjectURL(combinedBlob);

          audioPlayerRef.current.src = url;
          audioPlayerRef.current.play().then(() => {
            console.log('Audio playback started');
          }).catch((error) => {
            console.error('Error playing audio:', error);
          });

          setIsSpeaking(false);
          setAiSpeaking(false);

          setTimeout(() => {
            if (!isRecording) {
              startRecording();
            }
          }, 1000);
        } else if (data.type === 'error') {
          console.error('Speech synthesis error:', data.error);
          setIsSpeaking(false);
          setAiSpeaking(false);
        }
      } else {
        console.log('Received audio chunk:', event.data);
        audioChunks.push(event.data); 
      }
    };
  },

  waitForWebSocket: (speechWebSocketRef) => {
    return new Promise((resolve) => {
      const checkWebSocket = () => {
        if (speechWebSocketRef.current && speechWebSocketRef.current.readyState === WebSocket.OPEN) {
          resolve();
        } else {
          setTimeout(checkWebSocket, 100);
        }
      };
      checkWebSocket();
    });
  }
};

export default InterviewWebSockets; 