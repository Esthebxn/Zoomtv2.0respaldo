import React from "react";
import "./Loading.css";

// Logo PNG (asegúrate de que exista en src/assets/images/)
import logoZoom from "../../assets/images/logoZoomtv.png"; 
 

const Loading = () => {
  return (
    <div className="tv-loading-screen" role="status" aria-live="polite">
      {/* Partículas flotantes */}
      <div className="particles">
        <div className="particle p1">●</div>
        <div className="particle p2">●</div>
        <div className="particle p3">●</div>
        <div className="particle p4">●</div>
        <div className="particle p5">●</div>
        <div className="particle p6">●</div>
      </div>

      {/* TV container */}
      <div className="tv-frame">
        <div className="tv-bezel">
          <div className="tv-screen">
            <div className="scanlines"></div>

            <div className="logo-wrap">
              <img src={logoZoom} alt="Logo Zoom TV" className="loading-logo" />
            </div>

            <div className="tv-progress">
              <div className="progress-bar">
                <div className="progress-fill" />
              </div>
              <div className="progress-text">Cargando canales...</div>
            </div>
          </div>
        </div>

        <div className="tv-stand" />
      </div>

      <div className="tv-reflection" aria-hidden="true" />
    </div>
  );
};

export default Loading;
 