import React, { useRef, useState, useEffect } from "react";
import "./Home.css";
import Companies from "../Companies";
import Faq from "../Faq";
import InovationTestimonial from "../InnovationTestimonial";
import SuperpowerTestimonial from "../SuperpowerTestimonial";
import demoImage from "../wmremove-transformed.png";
import demoVideo from "../Airuter.mp4";
import interviewProcess from "../images/Airuter-Support-Interview Journey.png";
import { Search, FileText, MessageCircle, Video } from 'lucide-react';
import aitotaLogo from "../images/aitota__logo.png";
import image1 from "../images/discovering1.png";
import image2 from "../images/resumebuilder1.jpeg";
import image3 from "../images/Live-Interview.png";
import image4 from "../images/postinterview1.jpeg";

// Import company logos
import dailaiLogo from "../images/DailAi_Logo.png";
import kitabaiLogo from "../images/KitabAI.png";
import linguaaiLogo from "../images/LinguaAI.png";
import egclassesLogo from "../images/EG CLASSES.png";
import mobishaalaLogo from "../images/Mobishaala White.png";
import prayogteaLogo from "../images/PRAYOG TEA LOGO.png";
import goldpotLogo from "../images/GotPot-Logo.jpg";

const testimonials = [
  {
    description: `🎯 "Finding top AI talent was a challenge—until we used Airuter! Its AI-powered candidate matching ensured we hired <b>highly skilled professionals</b> who were the perfect fit for our team."`,
    name: "Aitota",
    location: "Bengaluru, India",
    businessType: "AI Talent Matching",
    logo: aitotaLogo
  },
  {
    description: `📊 "Airuter's AI-driven <b>mock interviews</b> helped us identify candidates with <b>strong analytical skills and AI expertise</b>. The result? Faster, more efficient hiring!"`,
    name: "DailAI",
    location: "Noida, India",
    businessType: "AI Mock Interviews",
    logo: dailaiLogo
  },
  {
    description: `🧠 "With Airuter's <b>AI Resume Optimization and skill assessment tools</b>, we found <b>the best AI researchers and developers</b>, making our hiring process seamless!"`,
    name: "KitabAI",
    location: "Noida, India",
    businessType: "AI Resume Optimization",
    logo: kitabaiLogo
  },
  {
    description: `🎥 "Airuter's AI-driven <b>video interview analysis</b> helped us hire <b>the right communication experts</b>, ensuring candidates had the technical and linguistic skills we needed!"`,
    name: "LinguaAI",
    location: "Patna, India",
    businessType: "AI Video Interview Analysis",
    logo: linguaaiLogo
  },
  {
    description: `📚 "We needed qualified educators <b>fast</b>. Airuter's AI <b>profile matching and interview insights</b> helped us hire <b>skilled teachers</b> effortlessly!"`,
    name: "EG Classes",
    location: "Delhi, India",
    businessType: "AI Profile Matching for Educators",
    logo: egclassesLogo
  },
  {
    description: `⏱️ "Hiring teachers was time-consuming—until we used Airuter! Its AI instantly <b>identified top teaching candidates</b> and provided interview feedback, making recruitment smooth and efficient!"`,
    name: "Mobishaala",
    location: "Delhi, India",
    businessType: "AI Recruitment for Education",
    logo: mobishaalaLogo
  },
  {
    description: `🌱 "Airuter's AI-driven <b>skill evaluation</b> helped us hire <b>candidates with deep knowledge of sustainable practices</b>, ensuring they aligned with our company's mission!"`,
    name: "PrayogTea",
    location: "Delhi, India",
    businessType: "AI Skill Evaluation",
    logo: prayogteaLogo
  },
  {
    description: `💎 "Finding skilled jewelry designers was tough, but Airuter's <b>AI-powered recruitment</b> helped us match with <b>creative and technically proficient candidates</b> instantly!"`,
    name: "GoldPot Jewelry",
    location: "Bengaluru, India",
    businessType: "Creative Talent Recruitment",
    logo: goldpotLogo
  },
];

export default function Home() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const REPETITIONS = 100; // Match Companies component

  // Create a large array of repeated testimonials
  const repeatedTestimonials = Array(REPETITIONS).fill().flatMap(() => testimonials);

  const handleGetInTouch = () => {
    const whatsappUrl = "https://web.whatsapp.com/send/?phone=8147540362&text=Hello%20Airuter%20team%20,%20I%20want%20to%20use%20Airuter%20service,%20%20my%20name%20is";
    window.open(whatsappUrl, "_blank");
  };

  // Calculate container width for proper scrolling animation
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      // This ensures the container width is properly calculated
      const testimonialCard = container.querySelector('.testimonial-cards');
      if (testimonialCard) {
        const cardWidth = testimonialCard.offsetWidth;
        const cardMargin = parseInt(window.getComputedStyle(testimonialCard).marginRight);
        const firstGroupWidth = (cardWidth + cardMargin) * testimonials.length;
        
        // Set a custom property that can be used in the CSS
        document.documentElement.style.setProperty('--scroll-width', `${firstGroupWidth}px`);
      }
    }
  }, []);

  // Handle video playback
  useEffect(() => {
    if (videoRef.current) {
      // Mute video by default for better autoplay experience
      videoRef.current.muted = true;
      
      // Play video after load
      const playVideo = () => {
        if (videoRef.current) {
          videoRef.current.play().catch(err => {
            console.log('Video autoplay prevented:', err);
          });
        }
      };
      
      // Handle visibility changes
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          playVideo();
        } else if (videoRef.current) {
          videoRef.current.pause();
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      playVideo();
      
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, []);

  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Screening Talent with AI,
            <br />
            Matching Potential with Opportunity.
          </h1>

          <div className="metrics">
            <div className="metric">
              <span className="metric-value">2K+</span>
              <span className="metric-label">Offers Received</span>
            </div>
            <div className="separator"></div>
            <div className="metric">
              <span className="metric-value">12K+</span>
              <span className="metric-label">Interviews Aced</span>
            </div>
          </div>

          <div className="button-container">
            <button className="cta-button" onClick={handleGetInTouch}>Get In Touch</button>
            <button className="try-free-button">Try for Free</button>
          </div>

          <p className="subtitle">
            Meet your AI hiring assistant – from resume creation to real-time video interview, 
            Airuter empowers you to stand out and get hired.
          </p>
        </div>
        <div className="hero-image-container">
          <div className="demo-image">
            <img
              src={demoImage}
              alt="Interview interface demo"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <Companies />

      {/* Interview Process Section */}
      <div className="process-sections-container">
        <section className="InterviewProcessContainerSection">
        <div className="InterviewProcessContainer">
  <div className="InterviewProcessHeader">
    <h3>AI is Redefining and Elevating the <br /> Interview Experience</h3>
  </div>
  
  <div className="InterviewProcessContentWrapper">
    <div className="InterviewProcessText">
      <div className="InterviewProcessContent">
        <div className="InterviewProcessContentBox">
          
          <div className="content-image-container">
            <img src={image1} alt="Discovering Opportunities" className="content-image" loading="lazy" />
          </div>
          <h4>
            Discovering Opportunities
          </h4>
        </div>
        
        <div className="InterviewProcessContentBox">
          
          <div className="content-image-container">
            <img src={image2} alt="Resume & Profile Building" className="content-image" loading="lazy" />
          </div>
          <h4>
            Resume & Profile Building
          </h4> 
        </div>
        
        <div className="InterviewProcessContentBox">
          
          <div className="content-image-container">
            <img src={image3} alt="Live-Interview Support" className="content-image" loading="lazy" />
          </div>
          <h4>
            Live-Interview Support
          </h4>
        </div>
        
        <div className="InterviewProcessContentBox">
          
          <div className="content-image-container">
            <img src={image4} alt="Post-Interview Review" className="content-image" loading="lazy" />
          </div>
          <h4>
            Post-Interview Review
          </h4>
        </div>
      </div>
    </div>
    
    <div className="InterviewProcess">
      <img 
        src={interviewProcess} 
        alt="Interview journey visualization" 
        loading="lazy" 
      />
    </div>
  </div>
</div>
        </section>
        
        {/* AI Partner Section */}
        <section className="InterviewProcessContainerSection">
          <div className="InterviewProcessContainer2">
            <div className="InterviewProcessLeft2">
              <div className="InterviewProcessHeaderContainer2">
                
                <h2>AI Powered partner for every step of the hiring journey</h2>
              </div>
              <div>
                <ul className="InterviewProcessList2">
                  <li>
                    <div>
                      <h3>Ace Every Step of Your Interview Journey with AI</h3>
                      <p>
                        From building standout resumes and preparing smarter to acing interviews with real-time guidance 
                        and post-interview insights.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div>
                      <h3>Always Interview-Ready, Whether You're a Fresher or a Pro</h3>
                      <p>
                        Airuter is your AI-powered companion designed to help you succeed in today's competitive job market.
                      </p>
                    </div>
                  </li>
                </ul>
                <a href="#contact" className="cta-button2">Get Started Today</a>
              </div>
            </div>
            <div className="InterviewProcessRight2">
              <video 
                ref={videoRef}
                src={demoVideo} 
                autoPlay 
                playsInline
                loop
                controls
                aria-label="Demo of AI-powered interview assistant"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </div>
      
      {/* Testimonials Section */}
      <section className="testimonialsContainers">
        <div className="testimonials-container">
          <h1>Airuter's AI Transforming Hiring for Leading Companies!</h1>
          <div className="testimonials-scroll-wrapper">
            <div className="testimonials-scroll-container" ref={containerRef}>
              {repeatedTestimonials.map((testimonial, index) => (
                <div key={index} className="testimonial-cards">
                  <div className="testimonial-header">
                    <div className="testimonial-header-tag">
                      <h3>{testimonial.businessType}</h3>
                    </div>
                    <div className="testimonial-content">
                      <h3 
                        className="testimonial-text"
                        dangerouslySetInnerHTML={{ __html: testimonial.description }}
                      />
                    </div>
                    <div className="testimonial-company-info">
                      <p className="testimonial-name">{testimonial.name} ({testimonial.location})</p>
                    </div>
                  </div>
                  <div className="company-logo-container">
                    <img
                      className="company-logo"
                      src={testimonial.logo || "https://d12araoe7z5xxk.cloudfront.net/landing-page/images/questionBank/company1.png"}
                      alt={`${testimonial.name} logo`}
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ and Testimonial Sections */}
      <Faq />
      <section className="testimonial-section">
        <InovationTestimonial />
      </section>
      <section className="superpower-section">
        <SuperpowerTestimonial />
      </section>
    </div>
  );
}