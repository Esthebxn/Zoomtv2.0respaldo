import React from "react";
import "./Inicio.css";
import bannerPrincipal from "/src/assets/images/logoZoomtv.png";

const Inicio = () => {
  // Puedes cambiar esto a true si quieres mostrar el video
  const useVideoBanner = false;

  const videoUrl =
    "https://www.youtube.com/embed/6T7pUEZfgdM?autoplay=1&mute=1&loop=1&controls=0";

  return (
    <main className="inicio-container">
      <section className="banner">
        {useVideoBanner ? (
          <div className="video-banner">
            <iframe
              src={videoUrl}
              title="Zoom TV Canal 10 Promo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div className="image-banner">
            <img
              src={bannerPrincipal}
              alt="Banner principal Zoom TV Canal 10"
              loading="lazy"
              className="banner-image"
            />
            <div className="banner-overlay">
              <h1 className="banner-title">ZOOM TV CANAL 10</h1>
              <p className="banner-subtitle">Tu señal local, más cerca de ti</p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default Inicio;
 
 