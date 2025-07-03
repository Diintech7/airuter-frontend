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

    // Setup transcription WebSocket with language parameter
    const transcriptionUrl = `wss://airuter-backend.onrender.com/ws/transcribe?language=${language}`
    webSocketRef.current = new WebSocket(transcriptionUrl)

    webSocketRef.current.onopen = () => {
      console.log(`Transcription WebSocket connected for ${language}`)
    }

    webSocketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "transcript" && data.data.trim()) {
        console.log("Received transcript:", data.data)

        setTranscript(data.data)

        setUserResponse((prevResponse) => {
          if (prevResponse.trim() === "") {
            return data.data
          }

          const prevWords = prevResponse.split(" ")
          const incomingWords = data.data.split(" ")

          const maxOverlap = Math.min(5, prevWords.length, incomingWords.length)
          let bestOverlapSize = 0

          for (let i = 1; i <= maxOverlap; i++) {
            const lastWordsOfPrev = prevWords.slice(-i).join(" ").toLowerCase()
            const firstWordsOfIncoming = incomingWords.slice(0, i).join(" ").toLowerCase()

            if (lastWordsOfPrev === firstWordsOfIncoming) {
              bestOverlapSize = i
            }
          }

          if (bestOverlapSize > 0) {
            return prevResponse + " " + incomingWords.slice(bestOverlapSize).join(" ")
          } else {
            return prevResponse + " " + data.data
          }
        })
      }
    }

    webSocketRef.current.onerror = (error) => {
      console.error("Transcription WebSocket error:", error)
    }

    webSocketRef.current.onclose = () => {
      console.log("Transcription WebSocket closed")
    }

    // Setup speech synthesis WebSocket
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

    console.log(`Sending question to LMNT for synthesis in ${language}:`, question)
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

    // Get proper voice configuration for the language
    const voiceConfig = getVoiceConfig(language)
    const synthesisOptions = getSynthesisOptions(language, voiceConfig.primary)

    console.log("Using synthesis options:", synthesisOptions)

    // Send synthesis request with proper voice configuration
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

          const combinedBlob = new Blob(audioChunks, { type: "audio/mp3" })
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

export default InterviewWebSockets
