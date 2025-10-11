import React from "react";
import Navbar from "./Navbar";
import HamburguesaMenu from "../HamburguesaMenu/HamburguesaMenu";
import "./Header.css";
import logo from "../../assets/images/logoZoomtv.png";

const Header = () => {
  return (
    <header className="header">
      <div className="header-top">
        <img 
          src={logo} 
          alt="Zoom TV Canal 10 " 
          className="logo" 
        />
        
        <h1>ℤ𝕠𝕠𝕞 𝕋𝕍 ℂ𝕒𝕟𝕒𝕝 𝟙𝟘 </h1>

        {/* Menú hamburguesa - visible solo en mobile */}
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