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
        setUserResponse(prev => {
          const merged = mergeTranscript(prev, data.data)
          if (prev !== merged) {
            console.log("[Deepgram] Previous:", prev)
            console.log("[Deepgram] New:", data.data)
            console.log("[Deepgram] Merged:", merged)
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
  // Deduplicate at sentence level
  const prevSentences = prev.split(/(?<=[.!?])\s+/)
  const nextSentences = next.split(/(?<=[.!?])\s+/)
  const newSentences = nextSentences.filter(s => !prevSentences.includes(s))
  let merged = (prev + (newSentences.length ? ' ' + newSentences.join(' ') : '')).trim()
  // Further deduplicate at word level (remove repeated trailing words)
  const prevWords = prev.split(/\s+/)
  const nextWords = next.split(/\s+/)
  let overlap = 0
  for (let i = 1; i <= Math.min(prevWords.length, nextWords.length); i++) {
    if (prevWords.slice(-i).join(' ') === nextWords.slice(0, i).join(' ')) {
      overlap = i
    }
  }
  if (overlap > 0) {
    merged = prev + ' ' + nextWords.slice(overlap).join(' ')
  }
  return merged.trim()
}
export default InterviewWebSockets
