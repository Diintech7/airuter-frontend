import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import {
  useHMSActions,
  useHMSStore,
  selectIsConnectedToRoom,
  selectLocalPeer,
  selectPeers
} from '@100mslive/react-sdk';
import InterviewStart from './components/InterviewStart';
import InterviewSession from './components/InterviewSession';
import InterviewAnalysis from './components/InterviewAnalysis';
import InterviewMediaControls from './components/InterviewMediaControls';
import InterviewWebSockets from './components/InterviewWebSockets';
import EnhancedLoadingAnimation from './components/EnhancedLoadingAnimation';

Chart.register(...registerables);

const InterviewRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [interviewTime, setInterviewTime] = useState(null);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [responses, setResponses] = useState([]);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [remainingTime, setRemainingTime] = useState(120);
  const [timerActive, setTimerActive] = useState(false);
  const [isSpeechWebSocketReady, setIsSpeechWebSocketReady] = useState(false);
  const [isScreenRecording, setIsScreenRecording] = useState(false);
  const [screenRecordingUrl, setScreenRecordingUrl] = useState(null);
  const [isTransitioningToNextQuestion, setIsTransitioningToNextQuestion] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const screenMediaRecorderRef = useRef(null);
  const screenVideoChunksRef = useRef([]);
  const webSocketRef = useRef(null);
  const speechWebSocketRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioPlayerRef = useRef(new Audio());
  const feedbackAudioPlayerRef = useRef(new Audio());
  const localVideoRef = useRef(null);
  const containerRef = useRef(null);
  const timerRef = useRef(null);
  
  const hmsActions = useHMSActions();
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const localPeer = useHMSStore(selectLocalPeer);
  const peers = useHMSStore(selectPeers);
  
  const startScreenRecording = async () => {
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
        // This callback will be called after recording is complete and uploaded
        console.log('Recording completed with URL:', url);
        if (error) {
          console.error('Error in recording process:', error);
        }
        // You can add additional logic here if needed
      },
      audioPlayerRef,     // Pass the audio player reference
      feedbackAudioPlayerRef  // Pass the feedback audio player reference
    );
    if (!stream) {
      alert('Screen recording could not be started. Please try again.');
    }
  };
  
  const stopScreenRecording = (callback) => {
    InterviewMediaControls.stopScreenRecording(
      screenMediaRecorderRef, 
      setIsScreenRecording, 
      setTimerActive,
      callback
    );
  };
  
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Your browser does not support the required features for this interview. Please use a modern browser like Chrome, Firefox, or Edge.');
    }
  }, []);
  
  useEffect(() => {
    const fetchInterviewDetails = async () => {
      try {
        console.log('Fetching interview details...');
        const response = await axios.get(`https://auriter-backen.onrender.com/api/interview/details/${roomId}`);
        const { date, time, jobTitle, document } = response.data;
        const interviewDateTime = new Date(`${date}T${time}`);
        setInterviewTime(interviewDateTime);
        const currentTime = new Date();
        if (currentTime >= interviewDateTime) {
          setIsInterviewActive(true);
        } else {
          setIsInterviewActive(false);
        }
      } catch (error) {
        console.error('Error fetching interview details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInterviewDetails();
    
    return () => {
      if (isConnected) {
        hmsActions.leave();
      }
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
      if (speechWebSocketRef.current) {
        speechWebSocketRef.current.close();
      }
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.src = '';
      }
      if (feedbackAudioPlayerRef.current) {
        feedbackAudioPlayerRef.current.pause();
        feedbackAudioPlayerRef.current.src = '';
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, [roomId, hmsActions, isConnected]);
  
  useEffect(() => {
    if (timerActive && remainingTime > 0) {
      timerRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (remainingTime <= 0) {
      setTimerActive(false);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, remainingTime]);
  
  useEffect(() => {
    if (permissionsGranted && localVideoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          localVideoRef.current.srcObject = stream;
        })
        .catch(err => console.error("Error accessing media devices:", err));
    }
  }, [permissionsGranted]);
  
  const startInterview = async () => {
    console.log('Starting interview...');
    const devicesAvailable = await InterviewMediaControls.checkDeviceAvailability();
    if (!devicesAvailable) return;
    
    setInterviewStarted(true);
    
    setTimeout(async () => {
      const hasPermissions = await InterviewMediaControls.requestPermissions(localVideoRef);
      if (!hasPermissions) {
        setInterviewStarted(false);
        return;
      }
      
      setPermissionsGranted(true);
      await startScreenRecording();
      
      InterviewWebSockets.setupWebSockets(
        webSocketRef, 
        speechWebSocketRef, 
        setIsSpeechWebSocketReady, 
        setTranscript, 
        setUserResponse
      );
      
      await fetchQuestions();
      toggleFullScreen();
    }, 1000); 
  };
  
  const toggleFullScreen = () => {
    InterviewMediaControls.toggleFullScreen(containerRef, setIsFullScreen);
  };
  
  const fetchQuestions = async () => {
    try {
      console.log('Fetching interview questions...');
      const response = await axios.get(`https://auriter-backen.onrender.com/api/interview/questions/${roomId}`);
      setQuestions(response.data.questions);
      setResponses(response.data.questions.map(() => ''));
      
      setTimeout(() => {
        speakQuestion(response.data.questions[0]);
      }, 2000);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };
  
  const speakQuestion = (question) => {
    InterviewWebSockets.speakQuestion(
      question, 
      speechWebSocketRef, 
      audioPlayerRef, 
      setIsSpeaking, 
      setAiSpeaking, 
      isRecording, 
      () => startRecording()
    );
  };
  
  const speakFeedback = (feedback) => {
    if (!speechWebSocketRef.current || speechWebSocketRef.current.readyState !== WebSocket.OPEN) {
      console.error('Speech WebSocket not ready for feedback');
      // If WebSocket isn't available, proceed anyway
      setIsTransitioningToNextQuestion(false);
      continueToNextQuestion();
      return;
    }
    
    console.log('Sending feedback to speech synthesis:', feedback);
    setAiSpeaking(true);
    
    const audioChunks = [];
    
    speechWebSocketRef.current.send(JSON.stringify({
      text: feedback,
      voice: 'lily',
      language: 'en',
      speed: 1.0
    }));
    
    const originalOnMessage = speechWebSocketRef.current.onmessage;
    
    // Set timeout to ensure we don't get stuck if speech synthesis fails
    const timeoutId = setTimeout(() => {
      console.warn('Speech synthesis timeout - proceeding anyway');
      setAiSpeaking(false);
      setIsTransitioningToNextQuestion(false);
      speechWebSocketRef.current.onmessage = originalOnMessage;
      continueToNextQuestion();
    }, 10000); // 10 second timeout
    
    speechWebSocketRef.current.onmessage = (event) => {
      if (typeof event.data === 'string') {
        const data = JSON.parse(event.data);
        if (data.type === 'end') {
          console.log('Feedback speech synthesis complete');
          clearTimeout(timeoutId);
          
          const combinedBlob = new Blob(audioChunks, { type: 'audio/mp3' });
          const url = URL.createObjectURL(combinedBlob);
          
          feedbackAudioPlayerRef.current.src = url;
          feedbackAudioPlayerRef.current.onended = () => {
            setAiSpeaking(false);
            setIsTransitioningToNextQuestion(false);
            speechWebSocketRef.current.onmessage = originalOnMessage;
            continueToNextQuestion();
          };
          
          feedbackAudioPlayerRef.current.play().catch((error) => {
            console.error('Error playing feedback audio:', error);
            setAiSpeaking(false);
            setIsTransitioningToNextQuestion(false);
            speechWebSocketRef.current.onmessage = originalOnMessage;
            continueToNextQuestion();
          });
        } else if (data.type === 'error') {
          console.error('Feedback speech synthesis error:', data.error);
          clearTimeout(timeoutId);
          setAiSpeaking(false);
          setIsTransitioningToNextQuestion(false);
          speechWebSocketRef.current.onmessage = originalOnMessage;
          continueToNextQuestion();
        }
      } else {
        audioChunks.push(event.data);
      }
    };
  };
  
  const startRecording = async () => {
    await InterviewMediaControls.startRecording(
      mediaRecorderRef, 
      audioChunksRef, 
      webSocketRef, 
      setIsRecording, 
      setRemainingTime, 
      setTimerActive
    );
  };
  
  const stopRecording = () => {
    InterviewMediaControls.stopRecording(
      mediaRecorderRef, 
      setIsRecording, 
      setTimerActive
    );
  };
  
  const handleNextQuestion = async () => {
    if (isTransitioningToNextQuestion) {
      console.log('Already transitioning to next question, ignoring duplicate request');
      return;
    }
    
    setIsTransitioningToNextQuestion(true);
    
    if (isRecording) {
      stopRecording();
    }
    
    // Store current response
    const updatedResponses = [...responses];
    updatedResponses[currentQuestionIndex] = userResponse;
    setResponses(updatedResponses);
    
    // Save for final submission
    window.finalResponsesForSubmission = [...updatedResponses];
    
    const feedbackMessages = [
      "Great answer! Let's continue to the next question.",
      "Thank you for that response. Moving on.",
      "Excellent! Let's proceed with the next question.",
      "Good job! Here's the next question.",
      "Thanks for sharing your thoughts. Let's continue.",
    ];
    
    const randomFeedback = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const finalFeedback = isLastQuestion 
      ? "Thank you for completing all the questions. I'll now analyze your responses."
      : randomFeedback;
    
    console.log('Proceeding with feedback:', finalFeedback, 'isLastQuestion:', isLastQuestion);
    
    // If it's the last question, set flag to ensure we're moving to analysis mode
    if (isLastQuestion) {
      // Pre-set isAnalyzing to true to show loading state
      setIsAnalyzing(true);
    }
    
    speakFeedback(finalFeedback);
  };
  
  const continueToNextQuestion = async () => {
    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      setUserResponse('');
      setTranscript('');
      
      console.log('Re-establishing WebSocket connections for next question...');
      if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
        webSocketRef.current.close();
      }
      
      if (speechWebSocketRef.current && speechWebSocketRef.current.readyState === WebSocket.OPEN) {
        speechWebSocketRef.current.close();
      }
      await new Promise(resolve => setTimeout(resolve, 500));
      InterviewWebSockets.setupWebSockets(
        webSocketRef, 
        speechWebSocketRef, 
        setIsSpeechWebSocketReady, 
        setTranscript, 
        setUserResponse
      );
      
      try {
        await InterviewWebSockets.waitForWebSocket(speechWebSocketRef);
        console.log('WebSocket is ready, sending next question...');
        speakQuestion(questions[nextIndex]);
      } catch (error) {
        console.error('Error waiting for WebSocket:', error);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await InterviewWebSockets.waitForWebSocket(speechWebSocketRef);
        speakQuestion(questions[nextIndex]);
      }
    } else {
      // Make sure we have the most recent responses
      const responsesToSubmit = window.finalResponsesForSubmission || responses;
      console.log('Interview complete! Submitting final responses:', responsesToSubmit);
      
      // Add a clear flag to indicate analysis is starting
      setIsAnalyzing(true);
      
      try {
        // Ensure screen recording is stopped if it's running
        if (isScreenRecording && screenMediaRecorderRef.current) {
          // Pass a callback function to be executed after upload completes
          stopScreenRecording(() => {
            submitAllResponses(responsesToSubmit);
          });
          // Don't immediately call submitAllResponses, let the callback handle it
        } else {
          // If no screen recording, proceed directly
          await submitAllResponses(responsesToSubmit);
        }
      } catch (error) {
        console.error('Error in final submission process:', error);
        // Fallback to direct analysis if submission fails
        analyzeResponses(responsesToSubmit);
      }
    }
  };
  
  const submitAllResponses = async (finalResponses) => {
    try {
      console.log('Submitting all responses...');
      
      const submitPromises = questions.map((question, index) => {
        return axios.post(`https://auriter-backen.onrender.com/api/interview/response/${roomId}`, {
          question,
          response: finalResponses[index]
        });
      });
      
      await Promise.all(submitPromises);
      console.log('All responses submitted successfully, analyzing now...');
      
      // Always call analyzeResponses after submissions
      await analyzeResponses(finalResponses);
    } catch (error) {
      console.error('Error submitting responses:', error);
      setIsAnalyzing(false);
      
      // Add fallback attempt for analysis even if submission fails
      try {
        await analyzeResponses(finalResponses);
      } catch (secondError) {
        console.error('Failed to analyze after submission error:', secondError);
      }
    }
  };
  
  const analyzeResponses = async (finalResponses) => {
    try {
      console.log('Analyzing responses...');
      
      const response = await axios.post('https://auriter-backen.onrender.com/api/interview/analyze', {
        roomId,
        questions,
        answers: finalResponses
      });
      
      console.log('Analysis received:', response.data.analysis);
      
      // Exit fullscreen first if needed
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      
      // Set analysis state - this should trigger the UI change
      setAnalysis(response.data.analysis);
      setIsAnalyzing(false);
    } catch (error) {
      console.error('Error analyzing responses:', error);
      
      // Add fallback display in case of analysis error
      setAnalysis({
        overview: "Analysis not available due to a technical issue.",
        strengths: ["Your answers were recorded successfully."],
        areas_for_improvement: ["We couldn't process the automatic analysis."],
        score: {
          overall: null,
          categories: []
        }
      });
      
      setIsAnalyzing(false);
    }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="mb-4">
            <svg className="w-12 h-12 mx-auto text-blue-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <div className="text-xl text-white font-semibold">Loading your interview environment...</div>
          <p className="text-blue-300 mt-2">Preparing your AI interviewer</p>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return <EnhancedLoadingAnimation />;
  }
  
  if (!isInterviewActive) {
    return (
      <div className="w-full h-screen p-8 bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-8 transform transition-all">
          <div className="flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">Interview Not Active Yet</h1>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-lg text-center">Your interview is scheduled for:</p>
            <p className="text-2xl font-semibold text-center text-blue-700 my-2">
              {interviewTime?.toLocaleString()}
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <p>Find a quiet place with good lighting and minimal distractions</p>
            </div>
            <div className="flex items-center p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Test your camera and microphone before the interview</p>
            </div>
            <div className="flex items-center p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Return to this page at the scheduled time to begin</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (analysis) {
    return <InterviewAnalysis analysis={analysis} />;
  }
  
  return (
    <div
      ref={containerRef}
      className="w-full h-screen bg-gray-900 text-white flex flex-col"
    >
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
        />
      ) : (
        <InterviewStart startInterview={startInterview} />
      )}
    </div>
  );
};

export default InterviewRoom;