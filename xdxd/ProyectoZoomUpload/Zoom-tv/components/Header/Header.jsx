import React from "react";
import Navbar from "./Navbar";
import HamburguesaMenu from "../HamburguesaMenu/HamburguesaMenu";
import "./Header.css";
import logo from "/src/assets/images/logoZoomtv.png";

const Header = () => {
  return (
    <header className="header">
      <div className="header-top">
        <img 
          src={logo} 
          alt="Zoom TV Canal 10 " 
          className="logo" 
        />
        
        <h1>â„¤ð• ð• ð•ž ð•‹ð• â„‚ð•’ð•Ÿð•’ð• ðŸ™ðŸ˜ </h1>

        {/* MenÃº hamburguesa - visible solo en mobile */}
        <div className="mobile-menu">
          <HamburguesaMenu />
        </div>
      </div>

      {/* Navbar - visible solo en desktop */}
      <div className="desktop-nav">
        <Navbar />
      </div>
    </header>
  );
};

export default Header; 
