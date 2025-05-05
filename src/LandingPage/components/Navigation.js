"use client";
import { useState } from "react";
import "./Navigation.css";
import { Link } from "react-router-dom";
import logo from "./images/Airuter LOGO_Without Background.png";
// import { Link, useLocation } from "react-router-dom";
export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  //   const [isMobile, setIsMobile] = useState(false);
  //   const location = useLocation();

  //   const toggleNavbar = () => {
  //     setIsMobile(!isMobile);
  //   };

  //   const isActive = (path) => {
  //     return location.pathname === path;
  //   };

  return (
    <div>
      <nav className="nav">
        <div className="nav-content">
          <div className="logo">
            <span>Airuter</span>
            <img src={logo} alt="Logo" className="logo-image" />
          </div>
          <nav className="desktopNav">
            <div className="desktop">
              <div>
                <ul className="desktopNavList">
                  <li>
                    {/* <Link
                  className={`links ${isActive("/") ? "active" : ""}`}
                  to="/"
                >
                  Home
                </Link> */}
                    About 
                  </li>
                  <li>
                    {/* <Link
                  className={`links ${isActive("/courses") ? "active" : ""}`}
                  to="/courses"
                >
                  Course
                </Link> */}
                    AI Interview 
                  </li>
                  <li>
                    {/* <Link
                  className={`links ${
                    isActive("/instructors") ? "active" : ""
                  }`}
                  to="/instructors"
                >
                  Instructors
                </Link> */}
                    Blog 
                  </li>
                  <li>
                    {/* <Link
                  className={`links ${isActive("/blog") ? "active" : ""}`}
                  to="/blog"
                >
                  BLOG
                </Link> */}
                    Pricing
                  </li>
                  <li>
                    {/* <Link
                  className={`links ${isActive("/contact") ? "active" : ""}`}
                  to="/contact"
                >
                  CONTACT
                </Link> */}
                    Tutorials
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          <div className="nav-links">
          <Link to="/auth"> <button className="sign-up-btn">Sign Up</button></Link>

            <button
              className="menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>

          {isMenuOpen && (
            <div className="mobile-menu">
              <a href="#">Interview Copilot™</a>
              <a href="#">AI Resume Builder</a>
              <a href="#">AI Mock Interview</a>
              <a href="#">Pricing</a>
              <a href="#">Resources</a>
              <a href="#">Question Bank</a>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}