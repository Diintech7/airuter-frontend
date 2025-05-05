import React from "react";
import {
  FaInstagram,
  FaFacebookF,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // Updated Twitter icon to X
import "./Footer.css"; // Import the CSS for styling

const Footer = () => {
  return (
    <footer className="footer-container">
      {/* Airuter Container */}
      <div className="footer-section aishaala">
        <h2 className="footer_heading">Airuter</h2>
        <p className="about-us">Vision</p>
        <p className="about-us-text">
          Empower individuals by unlocking their potential and connecting them to the right opportunities through AI.
        </p>
        <ul className="social-icons">
          <li>
            <FaInstagram aria-label="Instagram" />
          </li>
          <li>
            <FaFacebookF aria-label="Facebook" />
          </li>
          <li>
            <FaXTwitter aria-label="X" /> {/* Updated Twitter icon to X */}
          </li>
          <li>
            <FaLinkedin aria-label="LinkedIn" />
          </li>
          <li>
            <FaYoutube aria-label="YouTube" />
          </li>
        </ul>
      </div>
      
      {/* Office Container */}
      <div className="footer-section office">
        <h2>Address</h2>
        <p>Head Office</p>
        <p>804, 5th Cross, 4th Block</p>
        <p>Koramangala, Bengaluru-560095</p>
        <p>contact@airuter.com</p>
        <p>Branch Office </p>
        <p>
          S4, D53, Sector 2,
          <br /> Noida 201301
        </p>
      </div>

      {/* Quick Links Container */}
      <div className="footer-section quick-links">
        <h2>Quick Links</h2>
        <p>Blog</p>
        <p>Careers</p>
        <p>IOS App</p>
        <p>Android App</p>
      </div>

      {/* Legal Stuff Container */}
      <div className="footer-section legal-stuff">
        <h2>Legal Stuff</h2>
        <p>Privacy Policy</p>
        <p>Terms of Service</p>
        <p>Refunds</p>
        <p>Disclaimer</p>
        <p className="links">Admin</p>
      </div>
    </footer>
  );
};

export default Footer;