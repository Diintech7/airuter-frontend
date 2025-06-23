const InterviewWebSockets = {
  setupWebSockets: (webSocketRef, speechWebSocketRef, setIsSpeechWebSocketReady, setTranscript, setUserResponse) => {
    console.log("Setting up WebSocket connections...")

    // Setup transcription WebSocket
    webSocketRef.current = new WebSocket(`wss://airuter-backend.onrender.com/ws/transcribe?language=en`)

    webSocketRef.current.onopen = () => {
      console.log("Transcription WebSocket connected")
    }

    // Enhanced version with better phrase deduplication and faster processing
    webSocketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "transcript" && data.data.trim()) {
        console.log("Received transcript:", data.data)

        // Set the current transcript for immediate display
        setTranscript(data.data)

        // For the full response, use optimized deduplication
        setUserResponse((prevResponse) => {
          if (prevResponse.trim() === "") {
            return data.data
          }

          // Faster deduplication logic
          const newText = prevResponse
          const incomingText = data.data

          // Simple overlap matching for better performance
          const prevWords = prevResponse.split(" ")
          const incomingWords = incomingText.split(" ")

          // Reduced overlap check for faster processing
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
            return prevResponse + " " + incomingText
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
    // Reduced timeout for faster processing
    return new Promise((resolve, reject) => {
      const startTime = Date.now()
      const checkWebSocket = () => {
        if (speechWebSocketRef.current && speechWebSocketRef.current.readyState === WebSocket.OPEN) {
          resolve()
        } else if (Date.now() - startTime > timeout) {
          reject(new Error("WebSocket connection timeout"))
        } else {
          setTimeout(checkWebSocket, 25) // Faster checking interval
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
        )
      }, 500) // Reduced retry delay
      return
    }

    console.log("Sending question to LMNT for synthesis:", question)
    setIsSpeaking(true)
    setAiSpeaking(true)

    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause()
      audioPlayerRef.current.src = ""
    }

    const audioChunks = []
    const startTime = Date.now()

    // Reduced timeout for faster processing
    const timeoutId = setTimeout(() => {
      console.warn("Speech synthesis timeout, proceeding anyway")
      setIsSpeaking(false)
      setAiSpeaking(false)
      if (!isRecording) {
        startRecording()
      }
    }, 10000) // Reduced from 15000

    speechWebSocketRef.current.send(
      JSON.stringify({
        text: question,
        voice: "lily",
        language: "en",
        speed: 1.2, // Slightly faster speech for smoother experience
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

          // Start recording immediately after speech ends
          setTimeout(() => {
            if (!isRecording) {
              startRecording()
            }
          }, 300) // Reduced delay for smoother transition
        } else if (data.type === "error") {
          clearTimeout(timeoutId)
          console.error("Speech synthesis error:", data.error)
          setIsSpeaking(false)
          setAiSpeaking(false)
          // Start recording even if speech fails
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
