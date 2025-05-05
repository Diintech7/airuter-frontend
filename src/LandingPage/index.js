import React from 'react';
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import Footer from "./components/Footer";
import "./utils/globals.css";

function LandingPage() {
  return (
    <>
      <Navigation />
      <Home />
      <Footer />
    </>
  );
}

export default LandingPage;