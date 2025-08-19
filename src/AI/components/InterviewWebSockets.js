import { getVoiceConfig, getSynthesisOptions } from "../utils/languageUtils"
const InterviewWebSockets = {
  setupWebSockets: (
    webSocketRef,
    speechWebSocketRef,
    setIsSpeechWebSocketReady,
    setTranscript,
    setUserResponse,
    language = "en",
  ) => {
    console.log(`Setting up WebSocket connections for language: ${language}...`)
    const transcriptionUrl = `wss://airuter-backend.onrender.com/ws/transcribe?language=${language}`
    webSocketRef.current = new WebSocket(transcriptionUrl)

    webSocketRef.current.onopen = () => {
      console.log(`Transcription WebSocket connected for ${language}`)
    }

    webSocketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "transcript" && data.data.trim()) {
        console.log("[Deepgram] Received transcript:", data.data)
        
        // Filter out very short or repetitive transcripts
        const transcript = data.data.trim()
        if (transcript.length < 3) {
          console.log("[Deepgram] Skipping very short transcript:", transcript)
          return
        }
        
        setUserResponse(prev => {
          // Check if the new transcript is too similar to the previous one
          if (prev && prev.length > 0) {
            const prevLower = prev.toLowerCase()
            const nextLower = transcript.toLowerCase()
            
            // If the new transcript is mostly contained in the previous, skip it
            if (prevLower.includes(nextLower) && nextLower.length > 5) {
              console.log("[Deepgram] New transcript is contained in previous, skipping:", transcript)
              return prev
            }
            
            // If they're very similar (more than 80% similarity), skip
            const similarity = calculateSimilarity(prevLower, nextLower)
            if (similarity > 0.8) {
              console.log(`[Deepgram] Transcripts too similar (${similarity.toFixed(2)}), skipping:`, transcript)
              return prev
            }
          }
          
          const merged = mergeTranscript(prev, transcript)
          if (prev !== merged) {
            console.log("[Deepgram] Previous:", prev)
            console.log("[Deepgram] New:", transcript)
            console.log("[Deepgram] Merged:", merged)
          } else {
            console.log("[Deepgram] No change in transcript, skipping update")
          }
          return merged
        })
      }
    }
    webSocketRef.current.onerror = (error) => {
      console.error("Transcription WebSocket error:", error)
    }
    webSocketRef.current.onclose = () => {
      console.log("Transcription WebSocket closed")
    }
    speechWebSocketRef.current = new WebSocket("wss://airuter-backend.onrender.com/ws/speech")
    speechWebSocketRef.current.onopen = () => {
      console.log("Speech WebSocket connected")
      setIsSpeechWebSocketReady(true)
    }
    speechWebSocketRef.current.onerror = (error) => {
      console.error("Speech WebSocket error:", error)
      setIsSpeechWebSocketReady(false)
    }
    speechWebSocketRef.current.onclose = () => {
      console.log("Speech WebSocket closed")
      setIsSpeechWebSocketReady(false)
    }
  },
  waitForWebSocket: (speechWebSocketRef, timeout = 2500) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now()
      const checkWebSocket = () => {
        if (speechWebSocketRef.current && speechWebSocketRef.current.readyState === WebSocket.OPEN) {
          resolve()
        } else if (Date.now() - startTime > timeout) {
          reject(new Error("WebSocket connection timeout"))
        } else {
          setTimeout(checkWebSocket, 25)
        }
      }
      checkWebSocket()
    })
  },
  speakQuestion: (
    question,
    speechWebSocketRef,
    audioPlayerRef,
    setIsSpeaking,
    setAiSpeaking,
    isRecording,
    startRecording,
    language = "en",
  ) => {
    if (!speechWebSocketRef.current || speechWebSocketRef.current.readyState !== WebSocket.OPEN) {
      console.error("Speech WebSocket not ready, retrying in 500ms...")
      setTimeout(() => {
        InterviewWebSockets.speakQuestion(
          question,
          speechWebSocketRef,
          audioPlayerRef,
          setIsSpeaking,
          setAiSpeaking,
          isRecording,
          startRecording,
          language,
        )
      }, 500)
      return
    }
    console.log(`Sending question to Sarvam AI for synthesis in ${language}:`, question)
    setIsSpeaking(true)
    setAiSpeaking(true)
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause()
      audioPlayerRef.current.src = ""
    }
    const audioChunks = []
    const startTime = Date.now()
    const timeoutId = setTimeout(() => {
      console.warn("Speech synthesis timeout, proceeding anyway")
      setIsSpeaking(false)
      setAiSpeaking(false)
      if (!isRecording) {
        startRecording()
      }
    }, 10000)
    const voiceConfig = getVoiceConfig(language)
    const synthesisOptions = getSarvamSynthesisOptions(language, voiceConfig.primary)
    console.log("Using Sarvam AI synthesis options:", synthesisOptions)
    speechWebSocketRef.current.send(
      JSON.stringify({
        text: question,
        ...synthesisOptions,
      }),
    )
    speechWebSocketRef.current.onmessage = (event) => {
      if (typeof event.data === "string") {
        const data = JSON.parse(event.data)
        if (data.type === "end") {
          clearTimeout(timeoutId)
          console.log(`Speech synthesis complete in ${Date.now() - startTime}ms`)
          const combinedBlob = new Blob(audioChunks, { type: "audio/wav" })
          const url = URL.createObjectURL(combinedBlob)
          audioPlayerRef.current.src = url
          audioPlayerRef.current
            .play()
            .then(() => {
              console.log("Audio playback started")
            })
            .catch((error) => {
              console.error("Error playing audio:", error)
            })
          setIsSpeaking(false)
          setAiSpeaking(false)

          setTimeout(() => {
            if (!isRecording) {
              startRecording()
            }
          }, 300)
        } else if (data.type === "error") {
          clearTimeout(timeoutId)
          console.error("Speech synthesis error:", data.error)
          setIsSpeaking(false)
          setAiSpeaking(false)
          if (!isRecording) {
            startRecording()
          }
        }
      } else {
        audioChunks.push(event.data)
      }
    }
  },
}
function getSarvamSynthesisOptions(language, voice) {
  const languageMapping = {
    'en': 'en-IN',
    'hi': 'hi-IN',
    'bn': 'bn-IN',
    'gu': 'gu-IN',
    'kn': 'kn-IN',
    'ml': 'ml-IN',
    'mr': 'mr-IN',
    'or': 'or-IN',
    'pa': 'pa-IN',
    'ta': 'ta-IN',
    'te': 'te-IN'
  }
  const voiceMapping = {
    'en': 'meera',
    'hi': 'meera',
    'bn': 'meera',
    'gu': 'meera',
    'kn': 'meera',
    'ml': 'meera',
    'mr': 'meera',
    'or': 'meera',
    'pa': 'meera',
    'ta': 'meera',
    'te': 'meera'
  }
  return {
    language_code: languageMapping[language] || 'en-IN',
    speaker: voiceMapping[language] || 'meera',
    pitch: 0,
    pace: 1.0,
    loudness: 1.0,
    speech_sample_rate: 22050,
    enable_preprocessing: true,
    model: 'bulbul:v1'
  }
}
// Helper function to merge transcript data without repeating words or sentences
function mergeTranscript(prev, next) {
  if (!prev) return next
  if (!next) return prev
  
  // Clean up the transcripts
  const cleanPrev = prev.trim()
  const cleanNext = next.trim()
  
  // If they're identical, return one
  if (cleanPrev === cleanNext) return cleanPrev
  
  // Split into words for better analysis
  const prevWords = cleanPrev.split(/\s+/).filter(w => w.length > 0)
  const nextWords = cleanNext.split(/\s+/).filter(w => w.length > 0)
  
  // If previous transcript is empty, return next
  if (prevWords.length === 0) return cleanNext
  
  // Find the longest common suffix from previous that matches prefix of next
  let maxOverlap = 0
  const maxPossibleOverlap = Math.min(prevWords.length, nextWords.length)
  
  for (let i = 1; i <= maxPossibleOverlap; i++) {
    const prevSuffix = prevWords.slice(-i).join(' ').toLowerCase()
    const nextPrefix = nextWords.slice(0, i).join(' ').toLowerCase()
    
    if (prevSuffix === nextPrefix && prevSuffix.length > 0) {
      maxOverlap = i
    }
  }
  
  // If we found overlap, merge by removing the overlapping part
  if (maxOverlap > 0) {
    const nonOverlappingNext = nextWords.slice(maxOverlap).join(' ')
    const result = cleanPrev + (nonOverlappingNext ? ' ' + nonOverlappingNext : '')
    console.log(`[Merge] Found ${maxOverlap} word overlap, merged: "${cleanPrev}" + "${nonOverlappingNext}" = "${result}"`)
    return result
  }
  
  // Check if the new transcript is completely contained within the previous
  const prevLower = cleanPrev.toLowerCase()
  const nextLower = cleanNext.toLowerCase()
  
  if (prevLower.includes(nextLower)) {
    console.log(`[Merge] New transcript "${cleanNext}" is already contained in previous, skipping`)
    return cleanPrev
  }
  
  // Check if the new transcript contains significant parts of the previous
  const prevWordSet = new Set(prevWords.map(w => w.toLowerCase()))
  const nextWordSet = new Set(nextWords.map(w => w.toLowerCase()))
  const commonWords = [...prevWordSet].filter(word => nextWordSet.has(word))
  
  // If there are too many common words, the new transcript might be redundant
  if (commonWords.length > Math.min(prevWords.length, nextWords.length) * 0.7) {
    console.log(`[Merge] Too many common words (${commonWords.length}), new transcript might be redundant`)
    return cleanPrev
  }
  
  // No significant overlap, append the new transcript
  const result = cleanPrev + ' ' + cleanNext
  console.log(`[Merge] No significant overlap, appending: "${cleanPrev}" + "${cleanNext}" = "${result}"`)
  return result
}

// Helper function to calculate similarity between two strings
function calculateSimilarity(str1, str2) {
  const words1 = str1.split(/\s+/).filter(w => w.length > 0);
  const words2 = str2.split(/\s+/).filter(w => w.length > 0);

  const set1 = new Set(words1);
  const set2 = new Set(words2);

  const intersection = [...set1].filter(word => set2.has(word));
  const union = new Set([...set1, ...set2]);

  return intersection.length / union.size;
}

export default InterviewWebSockets

