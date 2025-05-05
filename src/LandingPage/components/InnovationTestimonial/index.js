"use client";

import { useState, useEffect } from "react";
import "./InnovationTestimonial.css";

export default function InnovationTestimonial() {
  const [isPaused, setIsPaused] = useState(false);
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

  const testimonials = [
    {
      quote: "AI Resume Builder – A Game Changer!",
      description:
        "Airuter's AI Resume Builder didn't just format my resume—it optimized it! The AI analyzed industry trends and tailored suggestions to make my application stand out. Within weeks, I landed my dream job!",
      author: "Priya",
      position: "Digital Marketing",
      location: "Bangalore, India"
    },
    {
      quote: "AI Video Interview – Confidence Booster!",
      description:
        "I had never faced a video interview before, but Airuter's AI-powered mock interviews changed everything! The system analyzed my tone, body language, and response structure, giving me real-time insights. Thanks to this, I aced my interview!",
      author: "Aditya",
      position: "Software Developer",
      location: "Hyderabad, India"
    },
    {
      quote: "AI-Powered Mock Interviews – Precision Feedback!",
      description:
        "Airuter's AI-driven mock interviews pinpointed my weak spots with laser accuracy. Whether it was improving my communication or technical responses, the platform's feedback was incredibly precise. This personalized approach helped me secure my role!",
      author: "Neelam",
      position: "Data Analyst",
      location: "Pune, India"
    },
    {
      quote: "AI Profile Matching – Job Hunting Simplified!",
      description:
        "Searching for jobs used to be frustrating, but Airuter's AI Profile Matching changed the game! It scanned my skills and career goals, instantly connecting me with relevant job opportunities. The result? A perfect job match in no time!",
      author: "Vaibhav",
      position: "Full-Stack Developer",
      location: "Mumbai, India"
    },
    {
      quote: "AI-Driven Skill Enhancement – Fast-Track to Success!",
      description:
        "Airuter's AI-powered learning system identified gaps in my skills and recommended focused upskilling. This targeted approach helped me refine my UX/UI expertise quickly, leading to my dream job!",
      author: "Sushma",
      position: "UX/UI Designer",
      location: "Delhi, India"
    },
    {
      quote: "Smart AI Feedback – Personalized Career Growth!",
      description:
        "After each mock interview, Airuter's AI-generated feedback was incredibly detailed. It didn't just highlight mistakes—it provided actionable solutions! This made it easy to improve and boosted my confidence for real interviews.",
      author: "Khushboo",
      position: "Content Strategist",
      location: "Kolkata, India"
    },
    {
      quote: "AI Career Guidance – A Personalized Roadmap!",
      description:
        "Airuter's AI went beyond generic advice—it gave me data-backed insights on how to refine my resume, improve my interview technique, and showcase leadership skills. The AI-driven guidance made all the difference in landing my product management role!",
      author: "Samarjeet",
      position: "Product Manager",
      location: "Chennai, India"
    },
    {
      quote: "AI-Powered Networking – Finding the Right Fit!",
      description:
        "Traditional job searches felt overwhelming, but Airuter's AI streamlined the process! It analyzed my strengths, preferences, and market trends to match me with the right companies. This smart matching system helped me land my ideal job quickly!",
      author: "Preeti",
      position: "Marketing Strategist",
      location: "Jaipur, India"
    },
    {
      quote: "Real-Time AI Feedback – Unlocking True Potential!",
      description:
        "The AI mock interviews were next-level! They didn't just assess my answers—they provided in-depth analysis of my problem-solving approach and communication. This real-time feedback gave me a competitive edge and helped me secure my data scientist role!",
      author: "Shubham",
      position: "Data Scientist",
      location: "Ahmedabad, India"
    }
  ];

  // Adjust number of repetitions based on screen size
  const REPETITIONS =  100;
  const repeatedTestimonials = Array(REPETITIONS).fill().flatMap(() => testimonials);

  return (
    <div className="testimonials-containers">
      <div className="testimonials-contents">
        <div className="testimonials-headers">
          <h2 className="titles">
              Airuter's AI Transforming Careers
           
          </h2>
        </div>

        <div
          className="carousels-wrappers"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          // For touch devices
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div
            className={`carousels-tracks ${
              isPaused ? "paused" : ""
            }`}
          >
            {repeatedTestimonials.map((testimonial, index) => (
              <div key={index} className="testimonials-cards">
                <blockquote className="feature-tag">
                  {testimonial.quote}
                </blockquote>
                <div className="testimonials-quotes">
                  {testimonial.description}
                </div>
                <div className="testimonials-authors">
                  <div className="authors-infos">
                    <p className="authors-names">{testimonial.author}</p>
                    <p className="authors-position">{testimonial.position}</p>
                    <p className="authors-location">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}