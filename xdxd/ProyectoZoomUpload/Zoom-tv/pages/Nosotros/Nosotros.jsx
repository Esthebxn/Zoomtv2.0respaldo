import React, { useState, useEffect } from "react";
import "./Nosotros.css";
import apiService from "../../services/api";

// âœ… ImÃ¡genes locales (cada secciÃ³n independiente)
import logoZoom from "/src/assets/images/logoZoomtv.png"; 
import historiaImg from "/src/assets/images/chatbot_logo.png";
import misionImg from "/src/assets/images/profesional3.jpg";
import visionImg from "/src/assets/images/profesional5.jpg";
import equipoCompletoImg from "/src/assets/images/equipo.png";

// âœ… Miembros del equipo
import mariaGonzalez from "/src/assets/images/profesional1.jpg";
import carlosMendoza from "/src/assets/images/profesional2.jpg";
import lauraJimenez from "/src/assets/images/profesional4.jpg";
import robertoSanchez from "/src/assets/images/profesional6.jpg";

const Nosotros = () => {
  const [nosotrosData, setNosotrosData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos de la API
  useEffect(() => {
    const loadNosotrosData = async () => {
      try {
        setLoading(true);
        const data = await apiService.getNosotros();
        setNosotrosData(data);
      } catch (err) {
        console.error('Error cargando datos de nosotros:', err);
        setError('Error al cargar la informaciÃ³n');
      } finally {
        setLoading(false);
      }
    };

    loadNosotrosData();
  }, []);

  // Datos dinÃ¡micos desde la API
  const companyInfo = nosotrosData ? {
    name: nosotrosData.nombre_empresa,
    slogan: nosotrosData.slogan,
    contactInfo: {
      email: nosotrosData.email,
      phone: nosotrosData.telefono,
    },
  } : null;

  // ðŸ§‘â€ðŸ’¼ Equipo de trabajo - datos dinÃ¡micos desde la API
  const teamMembers = []; // El campo equipo es texto simple, no JSON

  // ðŸ•° Historia
  const companyHistory = {
    title: "Nuestra Historia",
    content: nosotrosData?.historia || "No hay informaciÃ³n disponible",
    image: historiaImg,
  };

  // ðŸŽ¯ MisiÃ³n y VisiÃ³n
  const companyValues = {
    mission: {
      title: "Nuestra MisiÃ³n",
      content: nosotrosData?.mision || "No hay informaciÃ³n disponible",
      image: misionImg,
    },
    vision: {
      title: "Nuestra VisiÃ³n",
      content: nosotrosData?.vision || "No hay informaciÃ³n disponible",
      image: visionImg,
    },
  };

  if (loading) {
    return (
      <div className="nosotros-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Cargando informaciÃ³n...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="nosotros-container">
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          <h2>Error: {error}</h2>
        </div>
      </div>
    );
  }

  if (!nosotrosData) {
    return (
      <div className="nosotros-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>No hay informaciÃ³n disponible</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="nosotros-container">
      {/* ðŸŸ£ Banner superior */}
      <div className="nosotros-banner">
        <img
          src={logoZoom}
          alt={`Logo ${companyInfo.name}`}
          className="logo-canal"
        />
        <h1>{companyInfo.name}</h1>
        <p>{companyInfo.slogan}</p>
      </div>

      {/* ðŸŸ¢ IntroducciÃ³n */}
      <div className="nosotros-header">
        <h2>Conoce nuestro equipo y valores</h2>
        <p>Somos un equipo comprometido con la excelencia en la comunicaciÃ³n</p>
      </div>

      {/* ðŸŸ¡ Equipo */}
      <div className="equipo-section">
        <h2>Nuestro Equipo</h2>
        
        <div className="equipo-completo">
          <img
            src={equipoCompletoImg}
            alt="Equipo completo de Zoom TV Canal 10"
          />
          <p>
            {nosotrosData?.equipo || "Nuestro equipo completo de mÃ¡s de 50 profesionales trabajando para ustedes"}
          </p>
        </div>
      </div>

      {/* ðŸ”µ Historia */}
      <div className="nosotros-sections">
        <div className="nosotros-section historia">
          <div className="section-image">
            <img src={companyHistory.image} alt="Historia del canal" />
          </div>
          <div className="section-content">
            <h2>{companyHistory.title}</h2>
            {companyHistory.content.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* ðŸ”´ MisiÃ³n */}
        <div className="nosotros-section mision reverse">
          <div className="section-image">
            <img
              src={companyValues.mission.image}
              alt="MisiÃ³n de Zoom TV Canal 10"
            />
          </div>
          <div className="section-content">
            <h2>{companyValues.mission.title}</h2>
            <p>{companyValues.mission.content}</p>
          </div>
        </div>

        {/* ðŸŸ¢ VisiÃ³n */}
        <div className="nosotros-section vision">
          <div className="section-image">
            <img
              src={companyValues.vision.image}
              alt="VisiÃ³n de Zoom TV Canal 10"
            />
          </div>
          <div className="section-content">
            <h2>{companyValues.vision.title}</h2>
            <p>{companyValues.vision.content}</p>
          </div>
        </div>
      </div>

      {/* ðŸŸ£ Contacto */}
      <div className="contacto-section">
        <p>
          EnvÃ­anos tu informaciÃ³n a:{" "}
          <a href={`mailto:${companyInfo.contactInfo.email}`}>
            {companyInfo.contactInfo.email}
          </a>
        </p>
        <p>
          O llÃ¡manos al:{" "}
          <a href={`tel:${companyInfo.contactInfo.phone}`}>
            {companyInfo.contactInfo.phone}
          </a>
        </p>
      </div>
    </div>
  );
};

export default Nosotros;
 
