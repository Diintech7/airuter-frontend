import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Paperclip, Mic, Volume2, VolumeX, Loader, Clock, Search, Settings, Globe, Languages } from 'lucide-react';
import { AudioStream } from '../Audio/AudioStream';
import Cookies from 'js-cookie';
import { useTheme } from '../../context/ThemeContext';
import { useThemeStyles } from '../hooks/useThemeStyles';

const ChatContent = () => {
  const { theme } = useTheme();
  const { colors, styles, isDark } = useThemeStyles();
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [language, setLanguage] = useState('en');
  const [selectedVoice, setSelectedVoice] = useState('lily');
  const [ttsSpeed, setTtsSpeed] = useState(1.0);
  const [transcriptMessage, setTranscriptMessage] = useState("");

  const transcriptWsRef = useRef(null);
  const speechWsRef = useRef(null);
  const streamRef = useRef(null);
  const audioStreamRef = useRef(null);
  const processingRef = useRef(false);
  const messagesEndRef = useRef(null);
  const audioChunksRef = useRef([]);
  const userId = "user123";
  const silenceTimeoutRef = useRef(null);

  useEffect(() => {
    if (isRecording && transcriptMessage) {
      console.log('Updating input with transcript:', transcriptMessage);
      setInput(transcriptMessage);
    }
  }, [transcriptMessage, isRecording]);

  const getVoiceOptions = (lang) => {
    const voiceMap = {
      'en': ['lily', 'anthony', 'rachel', 'josh', 'emma'],
      'hi': ['lily']
    };
    return voiceMap[lang] || voiceMap['en'];
  };

  useEffect(() => {
    console.log('Initializing audio stream and fetching chat history');
    audioStreamRef.current = new AudioStream();
    fetchChatHistory();
    return () => {
      console.log('Cleaning up media tracks and audio stream');
      stopMediaTracks();
      if (audioStreamRef.current) {
        audioStreamRef.current.reset();
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    console.log('Language changed to:', language);
    setSelectedVoice(getVoiceOptions(language)[0]);
  }, [language]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChatHistory = async () => {
    console.log('Fetching chat history');
    try {
      const token = Cookies.get('usertoken');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch('https://auriter-backen.onrender.com/api/chat/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
      
      if (response.status === 401) {
        setError('Session expired. Please login again.');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.length > 0) {
        setMessages(data[0].messages);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
      setError('Failed to load chat history. Please refresh the page.');
    }
  };

  const connectWebSockets = async () => {
    console.log('Connecting WebSockets for speech recognition');
    try {
      if (transcriptWsRef.current) {
        console.log('Closing existing transcript WebSocket');
        transcriptWsRef.current.close();
      }
      if (speechWsRef.current) {
        console.log('Closing existing speech WebSocket');
        speechWsRef.current.close();
      }

      setError(null);
      setIsPlaying(false);
      setTranscriptMessage(""); 

      console.log(`Opening transcript WebSocket with language: ${language}`);
      transcriptWsRef.current = new WebSocket(
        `wss://auriter-backen.onrender.com/ws/transcribe?language=${language}&model=nova-2`
      );

      await new Promise((resolve, reject) => {
        transcriptWsRef.current.onopen = () => {
          console.log('Transcript WebSocket connected successfully');
          resolve();
        };
        transcriptWsRef.current.onerror = (e) => {
          console.error('WebSocket connection failed:', e);
          reject(e);
        };
      });

      transcriptWsRef.current.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Parsed WebSocket message:', data);
          
          if (data.type === 'transcript' && data.data.trim()) {
            setTranscriptMessage(data.data);
            // Automatically send message when transcript is received
            const messageText = data.data;
            await handleVoiceMessage(messageText);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

    } catch (error) {
      console.error('Failed to connect WebSockets:', error);
      setError('Failed to connect to speech recognition service');
    }
  };

  const handleVoiceMessage = async (messageText) => {
    if (!messageText.trim() || loading) return;

    console.log('Processing voice message:', messageText);
    setLoading(true);
    setError(null);
    
    const userMessage = {
      content: messageText,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setTranscriptMessage("");

    try {
      const token = Cookies.get('usertoken');
      const response = await fetch('https://auriter-backen.onrender.com/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          userId,
          message: messageText,
          language: language,
          isVoiceInteraction: true
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received response from API:', data);
      
      if (data.chatHistory) {
        setMessages(data.chatHistory);
        // Automatically speak the assistant's response
        const lastMessage = data.chatHistory[data.chatHistory.length - 1];
        if (!lastMessage.isUser) {
          await speakText(lastMessage.content, data.chatHistory.length - 1);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
      setMessages(prev => prev.filter(msg => msg !== userMessage));
    } finally {
      setLoading(false);
      if (isRecording) {
        console.log('Auto-stopping recording after sending message');
        stopRecording();
      }
    }
  };

  const startRecording = async () => {
    console.log('Starting recording...');
    try {
      setTranscriptMessage(""); 
      setInput("");
      
      await connectWebSockets();
      console.log('Getting user media...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 48000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      console.log('Media stream obtained successfully');
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      console.log('MediaRecorder created with mimeType:', recorder.mimeType);
      
      audioChunksRef.current = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0 && transcriptWsRef.current?.readyState === WebSocket.OPEN) {
          console.log('Sending audio data to WebSocket');
          transcriptWsRef.current.send(event.data);
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        console.log('Recorder stopped');
        stopMediaTracks();
        audioChunksRef.current = [];
      };

      setMediaRecorder(recorder);
      setIsRecording(true);
      setError(null);
      
      if (audioStreamRef.current) {
        audioStreamRef.current.reset();
      }
      
      console.log('Starting MediaRecorder with 250ms timeslice');
      recorder.start(250);
    } catch (err) {
      console.error('Recording error:', err);
      setError('Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = () => {
    console.log('Stopping recording...');
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      console.log('MediaRecorder is in recording state, stopping it');
      mediaRecorder.stop();
      setIsRecording(false);
    } else {
      console.warn('Cannot stop recording: MediaRecorder not in recording state');
      console.log('MediaRecorder state:', mediaRecorder?.state);
    }
  };

  const stopMediaTracks = () => {
    console.log('Stopping media tracks and closing connections');
    if (streamRef.current) {
      console.log('Stopping all tracks in the stream');
      streamRef.current.getTracks().forEach(track => {
        console.log('Stopping track:', track.kind, track.label);
        track.stop();
      });
      streamRef.current = null;
    }
    
    if (transcriptWsRef.current) {
      console.log('Closing transcript WebSocket');
      transcriptWsRef.current.close();
      transcriptWsRef.current = null;
    }
    
    if (speechWsRef.current && speechWsRef.current.readyState === WebSocket.OPEN) {
      console.log('Closing speech WebSocket');
      speechWsRef.current.close();
      speechWsRef.current = null;
    }
    
    if (silenceTimeoutRef.current) {
      console.log('Clearing silence timeout');
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    const messageText = input;
    if (!messageText.trim() || loading) return;

    setLoading(true);
    setError(null);
    
    const userMessage = {
      content: messageText,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setTranscriptMessage("");

    try {
      const token = Cookies.get('usertoken');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch('https://auriter-backen.onrender.com/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          message: messageText,
          language: language,
          isVoiceInteraction: isRecording || messageText === transcriptMessage
        })
      });

      if (response.status === 401) {
        setError('Session expired. Please login again.');
        return;
      }

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      if (data.chatHistory) {
        setMessages(data.chatHistory);
        if (isRecording || messageText === transcriptMessage) {
          const lastMessage = data.chatHistory[data.chatHistory.length - 1];
          if (!lastMessage.isUser) {
            await speakText(lastMessage.content, data.chatHistory.length - 1);
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
      setMessages(prev => prev.filter(msg => msg !== userMessage));
    } finally {
      setLoading(false);
    }
  };

  const speakText = async (text, messageId) => {
    console.log('Speaking text for message ID:', messageId);
    try {
      if (currentPlayingId === messageId && isPlaying) {
        console.log('Already playing this message, stopping playback');
        audioStreamRef.current.reset();
        setIsPlaying(false);
        setCurrentPlayingId(null);
        return;
      }

      setIsPlaying(true);
      setCurrentPlayingId(messageId);
      setError(null);

      if (!audioStreamRef.current) {
        console.log('Creating new AudioStream instance');
        audioStreamRef.current = new AudioStream();
      }
      
      await audioStreamRef.current.resume();

      console.log('Opening speech WebSocket');
      const ws = new WebSocket('wss://auriter-backen.onrender.com/ws/speech');
      speechWsRef.current = ws;
      
      ws.onopen = () => {
        console.log('Speech WebSocket opened, sending request');
        const request = {
          text,
          voice: selectedVoice,
          language: language,
          speed: ttsSpeed
        };
        console.log('Speech request:', request);
        ws.send(JSON.stringify(request));
      };

      ws.onmessage = async (event) => {
        try {
          if (event.data instanceof Blob) {
            console.log('Received audio blob, size:', event.data.size, 'bytes');
            const arrayBuffer = await event.data.arrayBuffer();
            await audioStreamRef.current.playAudio(arrayBuffer, messageId);
          } else {
            console.log('Received speech control message:', event.data);
            const data = JSON.parse(event.data);
            if (data.type === 'end') {
              console.log('Received end of speech signal');
              setIsPlaying(false);
              setCurrentPlayingId(null);
              ws.close();
            } else if (data.type === 'error') {
              console.error('Speech error:', data.error);
              throw new Error(data.error);
            }
          }
        } catch (error) {
          console.error('Error processing speech data:', error);
          setError('Failed to play audio');
          setIsPlaying(false);
          setCurrentPlayingId(null);
          ws.close();
        }
      };

      ws.onerror = (e) => {
        console.error('Speech WebSocket error:', e);
        setError('Connection error occurred');
        setIsPlaying(false);
        setCurrentPlayingId(null);
      };

      ws.onclose = (e) => {
        console.log('Speech WebSocket closed with code:', e.code, 'reason:', e.reason);
        if (isPlaying && currentPlayingId === messageId) {
          setIsPlaying(false);
          setCurrentPlayingId(null);
        }
      };
    } catch (error) {
      console.error('Error in speakText:', error);
      setError(`Failed to synthesize speech: ${error.message}`);
      setIsPlaying(false);
      setCurrentPlayingId(null);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const MessageComponent = ({ message, index }) => (
    <div className={`mb-6 flex ${message.isUser ? 'justify-end' : 'justify-start'} group`}>
      <div className={`max-w-[70%] rounded-2xl p-4 shadow-sm transition-all duration-200 ${
        message.isUser
          ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:shadow-md'
          : isDark
            ? 'bg-gray-700 text-gray-200 hover:shadow-md'
            : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 hover:shadow-md'
      }`}>
        <div className="break-words whitespace-pre-wrap text-[15px] leading-relaxed">
          {message.content}
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Clock size={14} className={
              message.isUser 
                ? 'text-purple-200' 
                : isDark
                  ? 'text-gray-500'
                  : 'text-gray-400'
            } />
            <span className={`text-xs ${
              message.isUser 
                ? 'text-purple-200' 
                : isDark
                  ? 'text-gray-400'
                  : 'text-gray-500'
            }`}>
              {formatTimestamp(message.timestamp)}
            </span>
          </div>
          {!message.isUser && (
            <button
              onClick={() => speakText(message.content, index)}
              className={`${
                isDark
                  ? 'text-gray-400 hover:text-purple-400'
                  : 'text-gray-400 hover:text-purple-600'
              } transition-all duration-200 flex items-center gap-1`}
              disabled={isPlaying && currentPlayingId !== index}
            >
              {isPlaying && currentPlayingId === index ? (
                <>
                  <VolumeX size={16} className="animate-pulse" />
                  <span className="text-xs">Stop</span>
                </>
              ) : (
                <>
                  <Volume2 size={16} className="hover:scale-110" />
                  <span className="text-xs">Listen</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const SettingsPanel = () => (
    <div className={`absolute top-16 right-4 ${isDark ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl shadow-lg z-10 border ${colors.border} w-80`}>
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Globe className={colors.primary} size={18} />
          <label className={`text-sm font-medium ${colors.text}`}>Language</label>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm
              ${language === 'en' ? 'bg-purple-500 text-white shadow-md' : isDark ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600' : 'bg-white text-gray-700 border hover:bg-purple-50'}`}
          >
            🇺🇸 English
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-3 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm
              ${language === 'hi' ? 'bg-purple-500 text-white shadow-md' : isDark ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600' : 'bg-white text-gray-700 border hover:bg-purple-50'}`}
          >
            🇮🇳 Hindi
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Volume2 className={colors.primary} size={18} />
          <label className={`text-sm font-medium ${colors.text}`}>Voice</label>
        </div>
        <select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          className={`w-full p-2 rounded-lg border ${colors.border} ${styles.input}`}
        >
          {getVoiceOptions(language).map((voice) => (
            <option key={voice} value={voice}>
              {voice.charAt(0).toUpperCase() + voice.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Languages className={colors.primary} size={18} />
            <label className={`text-sm font-medium ${colors.text}`}>Speech Speed</label>
          </div>
          <div className={`text-sm ${colors.textSecondary}`}>{ttsSpeed.toFixed(1)}x</div>
        </div>
        <input 
          type="range" 
          min="0.5" 
          max="2" 
          step="0.1" 
          value={ttsSpeed}
          onChange={(e) => setTtsSpeed(parseFloat(e.target.value))}
          className={`w-full h-2 ${isDark ? 'bg-purple-900' : 'bg-purple-200'} rounded-lg appearance-none cursor-pointer`}
        />
      </div>
    </div>
  );

  return (
    <div className={`flex h-full gap-6 p-4 ${colors.bg}`}>
      <div className={`flex-1 flex flex-col ${colors.bgCard} rounded-xl shadow-lg overflow-hidden`}>
        <div className={`border-b ${colors.border} ${colors.bgCard} p-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className={colors.primary} size={24} />
              <h2 className={`text-xl font-semibold ${colors.text}`}>Chat Assistant</h2>
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full transition-all duration-200`}
              >
                <Settings size={20} className={colors.textMuted} />
              </button>
              {showSettings && <SettingsPanel />}
            </div>
          </div>
        </div>

        {error && (
          <div className={`p-4 mx-4 mt-4 ${styles.error} rounded-lg border`}>
            {error}
          </div>
        )}

        <div className={`flex-1 overflow-y-auto p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          {messages.map((message, index) => (
            <MessageComponent 
              key={index} 
              message={message} 
              index={index} 
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className={`border-t ${colors.border} p-4 ${colors.bgCard}`}>
          <div className="flex items-center gap-3">
            <button className={`p-2.5 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full transition-all duration-200 hover:scale-110`}>
              <Paperclip size={20} className={colors.textMuted} />
            </button>
            
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isRecording ? "Listening..." : "Type your message..."}
              className={`flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 max-h-32 resize-y transition-shadow duration-200 ${
                isRecording 
                  ? 'border-purple-500 bg-purple-50' 
                  : isDark 
                    ? 'border-gray-600 bg-gray-700 text-white focus:border-purple-400' 
                    : 'bg-white text-gray-900 focus:border-purple-600'
              }`}
              disabled={loading}
              rows={1}
            />
            
            <button
              onClick={() => isRecording ? stopRecording() : startRecording()}
              className={`p-2.5 rounded-full transition-all duration-200 hover:scale-110 ${
                isRecording ? 'bg-red-500 hover:bg-red-600' : isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              disabled={loading}
            >
              {isRecording ? (
                <Mic size={20} className="text-white animate-pulse" />
              ) : (
                <Mic size={20} className={colors.textMuted} />
              )}
            </button>
            
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className={`p-2.5 rounded-full transition-all duration-200 ${
                loading || !input.trim()
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 hover:scale-110 text-white'
              }`}
            >
              {loading ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
          
          {/* Recording status indicator */}
          {isRecording && (
            <div className="mt-2 flex items-center justify-center">
              <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 rounded-full">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-xs text-purple-700">Recording... {transcriptMessage ? "Transcribing..." : "Listening..."}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={`w-80 ${colors.bgCard} rounded-xl shadow-lg flex flex-col`}>
        <div className={`p-4 border-b ${colors.border}`}>
          <h2 className={`text-lg font-semibold ${colors.text}`}>Chat History</h2>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-400 focus:border-purple-400' 
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-purple-500 focus:border-purple-500'
              }`}
            />
          </div>
        </div>
        <div className={`flex-1 overflow-y-auto p-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="space-y-4">
            {messages.filter(m => !m.isUser).map((message, index) => (
              <div
                key={index}
                className={`group p-4 ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-50 hover:bg-white'
                } rounded-xl hover:shadow-md cursor-pointer transition-all duration-200`}
              >
                <p className={`text-sm ${colors.text} line-clamp-2 leading-relaxed`}>
                  {message.content}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className={colors.textMuted} />
                    <span className={`text-xs ${colors.textMuted}`}>
                      {formatTimestamp(message.timestamp)}
                    </span>
                  </div>
                  <button
                    onClick={() => speakText(message.content, `history-${index}`)}
                    className={`${isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-400 hover:text-purple-600'} transition-all duration-200 flex items-center gap-1`}
                    disabled={isPlaying && currentPlayingId !== `history-${index}`}
                    title={isPlaying && currentPlayingId === `history-${index}` ? "Stop" : "Listen"}
                  >
                    {isPlaying && currentPlayingId === `history-${index}` ? (
                      <>
                        <VolumeX size={16} className="animate-pulse" />
                        <span className="text-xs">Stop</span>
                      </>
                    ) : (
                      <>
                        <Volume2 size={16} className="hover:scale-110" />
                        <span className="text-xs">Listen</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatContent;