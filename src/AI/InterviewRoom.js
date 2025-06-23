"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { Chart, registerables } from "chart.js"
import { useHMSActions, useHMSStore, selectIsConnectedToRoom, selectLocalPeer, selectPeers } from "@100mslive/react-sdk"
import InterviewStart from "./components/InterviewStart"
import InterviewSession from "./components/InterviewSession"
import InterviewAnalysis from "./components/InterviewAnalysis"
import InterviewMediaControls from "./components/InterviewMediaControls"
import InterviewWebSockets from "./components/InterviewWebSockets"
import EnhancedLoadingAnimation from "./components/EnhancedLoadingAnimation"

Chart.register(...registerables)

const InterviewRoom = () => {
  const { roomId } = useParams()
  const navigate = useNavigate()

  // Question management state
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userResponse, setUserResponse] = useState("")
  const [responses, setResponses] = useState([])
  const [isGeneratingNextQuestion, setIsGeneratingNextQuestion] = useState(false)
  const [interviewPhase, setInterviewPhase] = useState("basic")
  const [basicQuestionsCompleted, setBasicQuestionsCompleted] = useState(0)
  const [adaptiveQuestionsCompleted, setAdaptiveQuestionsCompleted] = useState(0)
  const [interviewDocument, setInterviewDocument] = useState("")

  // Existing state
  const [isLoading, setIsLoading] = useState(true)
  const [interviewTime, setInterviewTime] = useState(null)
  const [isInterviewActive, setIsInterviewActive] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [analysis, setAnalysis] = useState(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [aiSpeaking, setAiSpeaking] = useState(false)
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [permissionsGranted, setPermissionsGranted] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [remainingTime, setRemainingTime] = useState(90) // Reduced from 120
  const [timerActive, setTimerActive] = useState(false)
  const [isSpeechWebSocketReady, setIsSpeechWebSocketReady] = useState(false)
  const [isScreenRecording, setIsScreenRecording] = useState(false)
  const [screenRecordingUrl, setScreenRecordingUrl] = useState(null)
  const [isTransitioningToNextQuestion, setIsTransitioningToNextQuestion] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Refs
  const screenMediaRecorderRef = useRef(null)
  const screenVideoChunksRef = useRef([])
  const webSocketRef = useRef(null)
  const speechWebSocketRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const audioPlayerRef = useRef(new Audio())
  const feedbackAudioPlayerRef = useRef(new Audio())
  const localVideoRef = useRef(null)
  const containerRef = useRef(null)
  const timerRef = useRef(null)

  const hmsActions = useHMSActions()
  const isConnected = useHMSStore(selectIsConnectedToRoom)
  const localPeer = useHMSStore(selectLocalPeer)
  const peers = useHMSStore(selectPeers)

  // Basic questions that will always be asked first
  const BASIC_QUESTIONS = [
    "Tell me about yourself and your background.",
    "What are your key strengths and how do they relate to this role?",
    "Describe a challenging project you've worked on recently.",
  ]

  const startScreenRecording = async () => {
    try {
      const stream = await InterviewMediaControls.startScreenRecording(
        screenMediaRecorderRef,
        screenVideoChunksRef,
        webSocketRef,
        setIsScreenRecording,
        setScreenRecordingUrl,
        setRemainingTime,
        setTimerActive,
        roomId,
        (url, error) => {
          console.log("Recording completed with URL:", url)
          if (error) {
            console.error("Error in recording process:", error)
          }
        },
        audioPlayerRef,
        feedbackAudioPlayerRef,
      )

      if (!stream) {
        throw new Error("Screen recording could not be started")
      }

      return stream
    } catch (error) {
      console.error("Screen recording failed:", error)
      throw error
    }
  }

  const stopScreenRecording = (callback) => {
    InterviewMediaControls.stopScreenRecording(screenMediaRecorderRef, setIsScreenRecording, setTimerActive, callback)
  }

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert(
        "Your browser does not support the required features for this interview. Please use a modern browser like Chrome, Firefox, or Edge.",
      )
    }
  }, [])

  useEffect(() => {
    const fetchInterviewDetails = async () => {
      try {
        console.log("Fetching interview details...")
        const response = await axios.get(`https://airuter-backend.onrender.com/api/interview/details/${roomId}`)
        const { date, time, jobTitle, document } = response.data
        const interviewDateTime = new Date(`${date}T${time}`)
        setInterviewTime(interviewDateTime)
        setInterviewDocument(document)

        const currentTime = new Date()
        if (currentTime >= interviewDateTime) {
          setIsInterviewActive(true)
        } else {
          setIsInterviewActive(false)
        }
      } catch (error) {
        console.error("Error fetching interview details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInterviewDetails()

    return () => {
      if (isConnected) {
        hmsActions.leave()
      }
      if (webSocketRef.current) {
        webSocketRef.current.close()
      }
      if (speechWebSocketRef.current) {
        speechWebSocketRef.current.close()
      }
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause()
        audioPlayerRef.current.src = ""
      }
      if (feedbackAudioPlayerRef.current) {
        feedbackAudioPlayerRef.current.pause()
        feedbackAudioPlayerRef.current.src = ""
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (document.fullscreenElement) {
        document.exitFullscreen()
      }
    }
  }, [roomId, hmsActions, isConnected])

  useEffect(() => {
    if (timerActive && remainingTime > 0) {
      timerRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            setTimerActive(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (remainingTime <= 0) {
      setTimerActive(false)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [timerActive, remainingTime])

  useEffect(() => {
    if (permissionsGranted && localVideoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localVideoRef.current.srcObject = stream
        })
        .catch((err) => console.error("Error accessing media devices:", err))
    }
  }, [permissionsGranted])

  const startInterview = async () => {
    console.log("Starting interview...")
    const devicesAvailable = await InterviewMediaControls.checkDeviceAvailability()
    if (!devicesAvailable) return

    setInterviewStarted(true)

    // Reduced delay for faster start
    setTimeout(async () => {
      const hasPermissions = await InterviewMediaControls.requestPermissions(localVideoRef)
      if (!hasPermissions) {
        setInterviewStarted(false)
        return
      }

      setPermissionsGranted(true)

      // Make screen recording mandatory - interview won't start without it
      console.log("Requesting screen sharing permissions...")
      try {
        const screenStream = await startScreenRecording()
        if (!screenStream) {
          alert("Screen sharing is required to start the interview. Please allow screen sharing and try again.")
          setInterviewStarted(false)
          return
        }
        console.log("Screen sharing enabled successfully")
      } catch (error) {
        console.error("Screen sharing failed:", error)
        alert("Screen sharing is required to start the interview. Please allow screen sharing and try again.")
        setInterviewStarted(false)
        return
      }

      InterviewWebSockets.setupWebSockets(
        webSocketRef,
        speechWebSocketRef,
        setIsSpeechWebSocketReady,
        setTranscript,
        setUserResponse,
      )

      // Initialize with basic questions only after screen sharing is confirmed
      await initializeBasicQuestions()
      toggleFullScreen()
    }, 500)
  }

  const toggleFullScreen = () => {
    InterviewMediaControls.toggleFullScreen(containerRef, setIsFullScreen)
  }

  const initializeBasicQuestions = async () => {
    try {
      console.log("Initializing basic questions...")
      setQuestions(BASIC_QUESTIONS)
      setResponses(new Array(6).fill(""))
      setInterviewPhase("basic")
      setCurrentQuestionIndex(0)

      // Start speaking question faster
      setTimeout(() => {
        speakQuestion(BASIC_QUESTIONS[0])
      }, 1000) // Reduced from 2000
    } catch (error) {
      console.error("Error initializing basic questions:", error)
    }
  }

  const generateNextAdaptiveQuestion = async () => {
    try {
      setIsGeneratingNextQuestion(true)
      console.log("Generating next adaptive question...")

      const previousQA = responses
        .slice(0, currentQuestionIndex + 1)
        .map((response, index) => ({
          question: questions[index],
          answer: response,
        }))
        .filter((qa) => qa.question && qa.answer)

      // Faster timeout for question generation
      const response = await Promise.race([
        axios.post(`https://airuter-backend.onrender.com/api/interview/generate-adaptive-question`, {
          roomId,
          previousQA,
          document: interviewDocument,
          questionNumber: adaptiveQuestionsCompleted + 1,
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 6000)), // Reduced from 8000
      ])

      const nextQuestion = response.data.question
      console.log("Generated adaptive question:", nextQuestion)

      setQuestions((prev) => [...prev, nextQuestion])
      return nextQuestion
    } catch (error) {
      console.error("Error generating adaptive question:", error)
      const fallbackQuestions = [
        "Based on your experience, how would you handle a situation where you need to learn a new technology quickly?",
        "Can you elaborate on the technical challenges you mentioned and how you overcame them?",
        "What would you say is your most significant professional achievement and why?",
      ]
      const fallback = fallbackQuestions[adaptiveQuestionsCompleted] || "Tell me about your future career goals."

      setQuestions((prev) => [...prev, fallback])
      return fallback
    } finally {
      setIsGeneratingNextQuestion(false)
    }
  }

  const speakQuestion = (question) => {
    InterviewWebSockets.speakQuestion(
      question,
      speechWebSocketRef,
      audioPlayerRef,
      setIsSpeaking,
      setAiSpeaking,
      isRecording,
      () => startRecording(),
    )
  }

  const speakFeedback = (feedback) => {
    if (!speechWebSocketRef.current || speechWebSocketRef.current.readyState !== WebSocket.OPEN) {
      console.error("Speech WebSocket not ready for feedback")
      setIsTransitioningToNextQuestion(false)
      continueToNextQuestion()
      return
    }

    console.log("Sending feedback to speech synthesis:", feedback)
    setAiSpeaking(true)

    const audioChunks = []

    speechWebSocketRef.current.send(
      JSON.stringify({
        text: feedback,
        voice: "lily",
        language: "en",
        speed: 1.2, // Slightly faster speech
      }),
    )

    const originalOnMessage = speechWebSocketRef.current.onmessage

    // Reduced timeout for faster transitions
    const timeoutId = setTimeout(() => {
      console.warn("Speech synthesis timeout - proceeding anyway")
      setAiSpeaking(false)
      setIsTransitioningToNextQuestion(false)
      speechWebSocketRef.current.onmessage = originalOnMessage
      continueToNextQuestion()
    }, 8000) // Reduced from 10000

    speechWebSocketRef.current.onmessage = (event) => {
      if (typeof event.data === "string") {
        const data = JSON.parse(event.data)
        if (data.type === "end") {
          console.log("Feedback speech synthesis complete")
          clearTimeout(timeoutId)

          const combinedBlob = new Blob(audioChunks, { type: "audio/mp3" })
          const url = URL.createObjectURL(combinedBlob)

          feedbackAudioPlayerRef.current.src = url
          feedbackAudioPlayerRef.current.onended = () => {
            setAiSpeaking(false)
            setIsTransitioningToNextQuestion(false)
            speechWebSocketRef.current.onmessage = originalOnMessage
            continueToNextQuestion()
          }

          feedbackAudioPlayerRef.current.play().catch((error) => {
            console.error("Error playing feedback audio:", error)
            setAiSpeaking(false)
            setIsTransitioningToNextQuestion(false)
            speechWebSocketRef.current.onmessage = originalOnMessage
            continueToNextQuestion()
          })
        } else if (data.type === "error") {
          console.error("Feedback speech synthesis error:", data.error)
          clearTimeout(timeoutId)
          setAiSpeaking(false)
          setIsTransitioningToNextQuestion(false)
          speechWebSocketRef.current.onmessage = originalOnMessage
          continueToNextQuestion()
        }
      } else {
        audioChunks.push(event.data)
      }
    }
  }

  const startRecording = async () => {
    await InterviewMediaControls.startRecording(
      mediaRecorderRef,
      audioChunksRef,
      webSocketRef,
      setIsRecording,
      setRemainingTime,
      setTimerActive,
    )
  }

  const stopRecording = () => {
    InterviewMediaControls.stopRecording(mediaRecorderRef, setIsRecording, setTimerActive)
  }

  const handleNextQuestion = async () => {
    if (isTransitioningToNextQuestion) {
      console.log("Already transitioning to next question, ignoring duplicate request")
      return
    }

    setIsTransitioningToNextQuestion(true)

    if (isRecording) {
      stopRecording()
    }

    // Store current response
    const updatedResponses = [...responses]
    updatedResponses[currentQuestionIndex] = userResponse
    setResponses(updatedResponses)

    window.finalResponsesForSubmission = [...updatedResponses]

    const totalCompleted = currentQuestionIndex + 1
    const isLastQuestion = totalCompleted >= 6

    console.log(`Question ${totalCompleted} completed. Is last question: ${isLastQuestion}`)

    let feedbackMessage
    let shouldContinue = true

    if (isLastQuestion) {
      feedbackMessage = "Thank you for completing all the questions. I'll now analyze your responses."
      shouldContinue = false
      setIsAnalyzing(true)
    } else if (interviewPhase === "basic") {
      const completedBasic = basicQuestionsCompleted + 1
      setBasicQuestionsCompleted(completedBasic)

      if (completedBasic >= 3) {
        feedbackMessage = "Great! Now I'd like to dive deeper based on your responses."
        setInterviewPhase("adaptive")
      } else {
        feedbackMessage = "Thank you for that response. Let's continue."
      }
    } else {
      const completedAdaptive = adaptiveQuestionsCompleted + 1
      setAdaptiveQuestionsCompleted(completedAdaptive)
      feedbackMessage = "Excellent answer. Let me ask something more specific."
    }

    console.log("Proceeding with feedback:", feedbackMessage, "shouldContinue:", shouldContinue)

    if (!shouldContinue) {
      speakFeedback(feedbackMessage)
      return
    }

    speakFeedback(feedbackMessage)
  }

  const continueToNextQuestion = async () => {
    const nextIndex = currentQuestionIndex + 1
    const totalCompleted = nextIndex

    console.log(`Moving to question ${nextIndex + 1}, total completed: ${totalCompleted}`)

    if (totalCompleted >= 6) {
      console.log("Interview complete! Submitting final responses...")
      const responsesToSubmit = window.finalResponsesForSubmission || responses
      setIsAnalyzing(true)

      try {
        if (isScreenRecording && screenMediaRecorderRef.current) {
          stopScreenRecording(() => {
            submitAllResponses(responsesToSubmit)
          })
        } else {
          await submitAllResponses(responsesToSubmit)
        }
      } catch (error) {
        console.error("Error in final submission process:", error)
        analyzeResponses(responsesToSubmit)
      }
      return
    }

    setCurrentQuestionIndex(nextIndex)
    setUserResponse("")
    setTranscript("")

    let nextQuestion = null

    if (interviewPhase === "basic" && nextIndex < 3) {
      nextQuestion = BASIC_QUESTIONS[nextIndex]
      console.log("Next basic question:", nextQuestion)
    } else if (interviewPhase === "adaptive" || nextIndex >= 3) {
      try {
        console.log("Generating adaptive question...")
        nextQuestion = await generateNextAdaptiveQuestion()
      } catch (error) {
        console.error("Error generating adaptive question:", error)
        const fallbackQuestions = [
          "Based on your experience, how would you handle a situation where you need to learn a new technology quickly?",
          "Can you elaborate on the technical challenges you mentioned and how you overcame them?",
          "What would you say is your most significant professional achievement and why?",
        ]
        nextQuestion = fallbackQuestions[adaptiveQuestionsCompleted] || "Tell me about your future career goals."
      }
    }

    if (!nextQuestion) {
      console.error("No next question available")
      return
    }

    // Quickly re-establish WebSocket connections
    console.log("Re-establishing WebSocket connections...")

    if (webSocketRef.current?.readyState === WebSocket.OPEN) {
      webSocketRef.current.close()
    }
    if (speechWebSocketRef.current?.readyState === WebSocket.OPEN) {
      speechWebSocketRef.current.close()
    }

    // Reduced wait time
    await new Promise((resolve) => setTimeout(resolve, 200))

    InterviewWebSockets.setupWebSockets(
      webSocketRef,
      speechWebSocketRef,
      setIsSpeechWebSocketReady,
      setTranscript,
      setUserResponse,
    )

    try {
      await InterviewWebSockets.waitForWebSocket(speechWebSocketRef, 2500) // Reduced timeout
      console.log("WebSocket ready, speaking question...")
      speakQuestion(nextQuestion)
    } catch (error) {
      console.error("WebSocket timeout, trying anyway:", error)
      setTimeout(() => speakQuestion(nextQuestion), 300)
    }
  }

  const submitAllResponses = async (finalResponses) => {
    try {
      console.log("Submitting all responses...")

      const submitPromises = questions.map((question, index) => {
        return axios.post(`https://airuter-backend.onrender.com/api/interview/response/${roomId}`, {
          question,
          response: finalResponses[index],
        })
      })

      await Promise.all(submitPromises)
      console.log("All responses submitted successfully, analyzing now...")

      await analyzeResponses(finalResponses)
    } catch (error) {
      console.error("Error submitting responses:", error)
      setIsAnalyzing(false)

      try {
        await analyzeResponses(finalResponses)
      } catch (secondError) {
        console.error("Failed to analyze after submission error:", secondError)
      }
    }
  }

  const analyzeResponses = async (finalResponses) => {
    try {
      console.log("Analyzing responses...")

      const response = await axios.post("https://airuter-backend.onrender.com/api/interview/analyze", {
        roomId,
        questions,
        answers: finalResponses,
      })

      console.log("Analysis received:", response.data.analysis)

      if (document.fullscreenElement) {
        document.exitFullscreen()
      }

      setAnalysis(response.data.analysis)
      setIsAnalyzing(false)
    } catch (error) {
      console.error("Error analyzing responses:", error)

      setAnalysis({
        overview: "Analysis not available due to a technical issue.",
        strengths: ["Your answers were recorded successfully."],
        areas_for_improvement: ["We couldn't process the automatic analysis."],
        score: {
          overall: null,
          categories: [],
        },
      })

      setIsAnalyzing(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const getTotalQuestions = () => {
    return 6
  }

  const getCurrentQuestionNumber = () => {
    return currentQuestionIndex + 1
  }

  const isOnLastQuestion = () => {
    return getCurrentQuestionNumber() >= getTotalQuestions()
  }

  const getCurrentProgress = () => {
    if (interviewPhase === "basic") {
      return `Basic Question ${currentQuestionIndex + 1} of 3`
    } else {
      return `Adaptive Question ${currentQuestionIndex - 2} of 3`
    }
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="w-12 h-12 mx-auto text-blue-500 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <div className="text-xl text-white font-semibold">Loading your interview environment...</div>
          <p className="text-blue-300 mt-2">Preparing your AI interviewer</p>
        </div>
      </div>
    )
  }

  if (isAnalyzing) {
    return <EnhancedLoadingAnimation />
  }

  if (!isInterviewActive) {
    return (
      <div className="w-full h-screen p-8 bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-8 transform transition-all">
          <div className="flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">Interview Not Active Yet</h1>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-lg text-center">Your interview is scheduled for:</p>
            <p className="text-2xl font-semibold text-center text-blue-700 my-2">{interviewTime?.toLocaleString()}</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-500 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <p>Find a quiet place with good lighting and minimal distractions</p>
            </div>
            <div className="flex items-center p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-500 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>Test your camera and microphone before the interview</p>
            </div>
            <div className="flex items-center p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-500 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>Return to this page at the scheduled time to begin</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (analysis) {
    return <InterviewAnalysis analysis={analysis} />
  }

  return (
    <div ref={containerRef} className="w-full h-screen bg-gray-900 text-white flex flex-col">
      {interviewStarted ? (
        <InterviewSession
          localVideoRef={localVideoRef}
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          userResponse={userResponse}
          transcript={transcript}
          isRecording={isRecording}
          aiSpeaking={aiSpeaking}
          remainingTime={remainingTime}
          timerActive={timerActive}
          stopRecording={stopRecording}
          handleNextQuestion={handleNextQuestion}
          formatTime={formatTime}
          isScreenRecording={isScreenRecording}
          startScreenRecording={startScreenRecording}
          stopScreenRecording={stopScreenRecording}
          isTransitioning={isTransitioningToNextQuestion}
          interviewPhase={interviewPhase}
          currentProgress={getCurrentProgress()}
          totalQuestions={getTotalQuestions()}
          isGeneratingNextQuestion={isGeneratingNextQuestion}
        />
      ) : (
        <InterviewStart startInterview={startInterview} />
      )}
    </div>
  )
}

export default InterviewRoom
