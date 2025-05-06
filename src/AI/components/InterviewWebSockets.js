import React from 'react';

const InterviewWebSockets = {
  setupWebSockets: (webSocketRef, speechWebSocketRef, setIsSpeechWebSocketReady, setTranscript, setUserResponse) => {
    console.log('Setting up WebSocket connections...');

    webSocketRef.current = new WebSocket(`wss://airuter-backend.onrender.com/ws/transcribe?language=en`);

    webSocketRef.current.onopen = () => {
      console.log('Transcription WebSocket connected');
    };

// Enhanced version with better phrase deduplication for InterviewWebSockets.js
webSocketRef.current.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'transcript' && data.data.trim()) {
    console.log('Received transcript:', data.data);
    
    // Set the current transcript for immediate display
    setTranscript(data.data);
    
    // For the full response, use a more advanced deduplication approach
    setUserResponse(prevResponse => {
      // If this is a completely new segment or the first response
      if (prevResponse.trim() === '') {
        return data.data;
      }
      
      // Advanced deduplication logic
      let newText = prevResponse;
      const incomingText = data.data;
      
      // Function to find the largest repeating phrase
      const findRepeatedPhrases = (text, minLength = 3) => {
        const words = text.toLowerCase().split(' ');
        const phrases = [];
        
        // Look for phrases of different lengths
        for (let phraseLength = minLength; phraseLength <= Math.floor(words.length / 2); phraseLength++) {
          // Check each possible starting position
          for (let i = 0; i <= words.length - 2 * phraseLength; i++) {
            const phrase1 = words.slice(i, i + phraseLength).join(' ');
            
            // Check if this phrase repeats later in the text
            for (let j = i + phraseLength; j <= words.length - phraseLength; j++) {
              const phrase2 = words.slice(j, j + phraseLength).join(' ');
              
              if (phrase1 === phrase2) {
                phrases.push({
                  phrase: phrase1,
                  length: phraseLength,
                  firstPos: i,
                  secondPos: j
                });
              }
            }
          }
        }
        
        // Sort by phrase length (prefer longer phrases)
        return phrases.sort((a, b) => b.length - a.length);
      };
      
      // Process the combined text to identify and remove repetitions
      const combined = prevResponse + ' ' + incomingText;
      const repeatedPhrases = findRepeatedPhrases(combined);
      
      if (repeatedPhrases.length > 0) {
        // We found repeating phrases, let's clean them up
        const combinedWords = combined.split(' ');
        const topPhrase = repeatedPhrases[0]; // Take the longest repeating phrase
        
        // Create a new array without the second occurrence of the phrase
        const cleanedWords = [
          ...combinedWords.slice(0, topPhrase.secondPos),
          ...combinedWords.slice(topPhrase.secondPos + topPhrase.length)
        ];
        
        return cleanedWords.join(' ');
      } else {
        // No significant repetition found, try simple overlap matching
        const prevWords = prevResponse.split(' ');
        const incomingWords = incomingText.split(' ');
        
        // Look for potential overlap of up to 10 words
        let maxOverlap = Math.min(10, prevWords.length, incomingWords.length);
        let bestOverlapSize = 0;
        
        // Find the largest overlapping segment
        for (let i = 1; i <= maxOverlap; i++) {
          const lastWordsOfPrev = prevWords.slice(-i).join(' ').toLowerCase();
          const firstWordsOfIncoming = incomingWords.slice(0, i).join(' ').toLowerCase();
          
          if (lastWordsOfPrev === firstWordsOfIncoming) {
            bestOverlapSize = i;
          }
        }
        
        // If we found a significant overlap, only add the non-overlapping part
        if (bestOverlapSize > 0) {
          return prevResponse + ' ' + incomingWords.slice(bestOverlapSize).join(' ');
        } else {
          // No overlap found, simply concatenate with appropriate spacing
          return prevResponse + ' ' + incomingText;
        }
      }
    });
  }
};

    webSocketRef.current.onerror = (error) => {
      console.error('Transcription WebSocket error:', error);
    };

    webSocketRef.current.onclose = () => {
      console.log('Transcription WebSocket closed');
    };

    speechWebSocketRef.current = new WebSocket('wss://airuter-backend.onrender.com/ws/speech');

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