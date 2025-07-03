// Voice configuration for different languages
export const getVoiceConfig = (language) => {
    const voiceConfig = {
      en: {
        primary: "lily",
        alternatives: ["anthony", "rachel", "josh", "emma"],
      },
      hi: {
        primary: "lily", // Use lily for Hindi as well since LMNT doesn't have dedicated Hindi voices
        alternatives: ["lily"],
        // Note: LMNT will handle Hindi text with English voices
      },
    }
    return voiceConfig[language] || voiceConfig.en
  }
  
  // Language-specific synthesis options
  export const getSynthesisOptions = (language, voice) => {
    const baseOptions = {
      voice: voice || "lily",
      speed: 1.2,
      format: "mp3",
      sample_rate: 16000,
    }
  
    // Language-specific adjustments
    if (language === "hi") {
      return {
        ...baseOptions,
        language: "hi", // Let LMNT know it's Hindi text
        voice: "lily", // Use lily voice for Hindi text
        speed: 1.1, // Slightly slower for Hindi
      }
    }
  
    return {
      ...baseOptions,
      language: language || "en",
    }
  }
  
  export const getInterviewQuestions = (language = "en") => {
    const questions = {
      en: [
        "Tell me about yourself and your background.",
        "What are your key strengths and how do they relate to this role?",
        "Describe a challenging project you've worked on recently.",
      ],
      hi: [
        "अपने बारे में और अपनी पृष्ठभूमि के बारे में बताएं।",
        "आपकी मुख्य शक्तियां क्या हैं और वे इस भूमिका से कैसे संबंधित हैं?",
        "हाल ही में आपने जिस चुनौतीपूर्ण परियोजना पर काम किया है, उसका वर्णन करें।",
      ],
    }
    return questions[language] || questions.en
  }
  
  export const getLocalizedText = (language, key) => {
    const texts = {
      en: {
        voiceInterviewActive: "Voice Interview Active",
        questionOf: "Question {current} of {total}",
        basicPhase: "Basic Phase",
        adaptivePhase: "Adaptive Phase",
        generatingQuestion: "Generating Question...",
        aiSpeaking: "AI Speaking",
        recording: "Recording",
        liveVoiceTranscript: "Live Voice Transcript",
        progress: "Progress: {current} of {total} questions",
        autoScrolling: "Auto-scrolling",
        you: "You",
        youLive: "You (Live)",
        alex: "Alex (AI)",
        stopRecording: "Stop Recording",
        nextQuestion: "Next Question",
        finishInterview: "Finish Interview",
        generating: "Generating...",
        interviewAnalysis: "Interview Analysis",
        analysisComplete: "Analysis Complete",
        analysisDescription: "Here's an in-depth evaluation of your interview performance",
        selfIntroduction: "Self Introduction",
        projectExplanation: "Project Explanation",
        englishCommunication: "English Communication",
        outOf10: "out of 10",
        detailedFeedback: "Detailed Performance Feedback",
        priorityFocusAreas: "Priority Focus Areas",
        keyStrengths: "Key Strengths",
        growthOpportunities: "Growth Opportunities",
        returnToDashboard: "Return to Dashboard",
        downloadReport: "Download Report (PDF)",
        score: "Score",
        remaining: "Remaining",
        analyzingInterview: "Analyzing Your Interview",
        analysisInProgress:
          "We're carefully reviewing your responses to provide detailed feedback. This may take a few moments...",
      },
      hi: {
        voiceInterviewActive: "वॉयस साक्षात्कार सक्रिय",
        questionOf: "प्रश्न {current} का {total}",
        basicPhase: "बुनियादी चरण",
        adaptivePhase: "अनुकूली चरण",
        generatingQuestion: "प्रश्न तैयार कर रहे हैं...",
        aiSpeaking: "AI बोल रहा है",
        recording: "रिकॉर्डिंग",
        liveVoiceTranscript: "लाइव वॉयस ट्रांसक्रिप्ट",
        progress: "प्रगति: {total} में से {current} प्रश्न",
        autoScrolling: "ऑटो-स्क्रॉलिंग",
        you: "आप",
        youLive: "आप (लाइव)",
        alex: "एलेक्स (AI)",
        stopRecording: "रिकॉर्डिंग बंद करें",
        nextQuestion: "अगला प्रश्न",
        finishInterview: "साक्षात्कार समाप्त करें",
        generating: "तैयार कर रहे हैं...",
        interviewAnalysis: "साक्षात्कार विश्लेषण",
        analysisComplete: "विश्लेषण पूर्ण",
        analysisDescription: "यहाँ आपके साक्षात्कार प्रदर्शन का गहन मूल्यांकन है",
        selfIntroduction: "स्व-परिचय",
        projectExplanation: "परियोजना व्याख्या",
        englishCommunication: "अंग्रेजी संचार",
        outOf10: "10 में से",
        detailedFeedback: "विस्तृत प्रदर्शन फीडबैक",
        priorityFocusAreas: "प्राथमिकता फोकस क्षेत्र",
        keyStrengths: "मुख्य शक्तियां",
        growthOpportunities: "विकास के अवसर",
        returnToDashboard: "डैशबोर्ड पर वापस जाएं",
        downloadReport: "रिपोर्ट डाउनलोड करें (PDF)",
        score: "स्कोर",
        remaining: "शेष",
        analyzingInterview: "आपके साक्षात्कार का विश्लेषण",
        analysisInProgress:
          "हम आपको विस्तृत फीडबैक प्रदान करने के लिए आपके उत्तरों की सावधानीपूर्वक समीक्षा कर रहे हैं। इसमें कुछ समय लग सकता है...",
      },
    }
  
    const text = texts[language]?.[key] || texts.en[key] || key
    return text
  }
  
  export const formatLocalizedText = (language, key, replacements = {}) => {
    let text = getLocalizedText(language, key)
    Object.keys(replacements).forEach((placeholder) => {
      text = text.replace(`{${placeholder}}`, replacements[placeholder])
    })
    return text
  }
  