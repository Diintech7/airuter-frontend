"use client";

import { useState, useEffect } from "react";
import "./Faq.css";

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on a mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const faqData = [
    {
      question: "Can I get a transcript of my interview?",
      answer:
        "To protect user data in line with our privacy policy, Airuter does not store interview transcripts. However, you can access a detailed Interview Report immediately after your session. Please note: if the 'View Interview Report' option is not selected at the end of the session, the report cannot be retrieved later.",
    },
    {
      question: "How does your cancellation and refund policy work?",
      answer:
        "We offer a 30-day money-back guarantee. If you're not satisfied with our service within this period, you can request a full refund—no questions asked.",
    },
    {
      question: "Is there a free trial available? What does it include?",
      answer:
        "Yes! Our 14-day free trial gives you unrestricted access to all features, with no credit card required to sign up.",
    },
    {
      question: "Which industries does Airuter cater to?",
      answer:
        "Airuter is designed to support diverse industries, including technology, finance, healthcare, education, retail, and more.",
    },
    {
      question: "Will I be charged after the free trial ends?",
      answer:
        "No, you won't be charged automatically. Since no credit card is required for the trial, you can explore Airuter risk-free.",
    },
    {
      question: "Can I download the Interview Report later?",
      answer:
        "Interview Reports must be viewed and saved immediately after the session. Once you leave the session without viewing it, it won't be available later due to our privacy protocols.",
    },
    {
      question: "Are there any limitations during the free trial period?",
      answer:
        "None at all! You'll get full access to every feature so you can evaluate the platform thoroughly before committing.",
    },
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <div style={{ margin: "0px auto" }} className="InterviewProcessHeader">
        <h1 className="faq-heading">Frequently Asked Questions</h1>
      </div>
      <div className="faq-container">
        {faqData.map((item, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
          >
            <div
              className="faq-question"
              onClick={() => toggleAccordion(index)}
            >
              <span>{item.question}</span>
              <span className="faq-icon">
                {activeIndex === index ? "−" : "+"}
              </span>
            </div>
            <div className="faq-answer">{item.answer}</div>
          </div>
        ))}
      </div>
    </>
  );
}